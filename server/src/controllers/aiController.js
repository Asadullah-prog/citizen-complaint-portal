const Complaint = require('../models/Complaint');
const { attachPriority } = require('../utils/priority');

/**
 * Generate officer AI briefing with Gemini API or smart deterministic fallback
 */
exports.getOfficerSummary = async (req, res) => {
  try {
    const rawComplaints = await Complaint.find().populate('createdBy', 'name');
    const complaints = rawComplaints.map(attachPriority);

    const total = complaints.length;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const newToday = complaints.filter((c) => new Date(c.createdAt) >= startOfToday).length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const critical = complaints.filter((c) => c.priority === 'Critical').length;
    const high = complaints.filter((c) => c.priority === 'High').length;

    // Categories breakdown
    const categoryCounts = {};
    complaints.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'None';

    // Hotspot areas
    const areaCounts = {};
    complaints.forEach((c) => {
      if (c.area) {
        areaCounts[c.area] = (areaCounts[c.area] || 0) + 1;
      }
    });
    const sortedAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);
    const hotspotArea = sortedAreas.length > 0 ? sortedAreas[0][0] : 'None';

    // Citizen satisfaction
    const ratedComplaints = complaints.filter((c) => typeof c.feedbackRating === 'number' && c.feedbackRating > 0);
    const avgSatisfaction =
      ratedComplaints.length > 0
        ? (ratedComplaints.reduce((acc, c) => acc + c.feedbackRating, 0) / ratedComplaints.length).toFixed(1)
        : null;

    const stats = {
      total,
      newToday,
      pending,
      inProgress,
      resolved,
      critical,
      high,
      topCategory,
      topCategories: sortedCategories.slice(0, 3),
      hotspotArea,
      hotspotAreas: sortedAreas.slice(0, 3),
      avgSatisfaction: avgSatisfaction ? Number(avgSatisfaction) : null,
      totalFeedbackCount: ratedComplaints.length,
    };

    // Deterministic fallback briefing
    let briefing = `Civic Operations Overview: Currently there are ${total} total complaints in the system (${pending} Pending, ${inProgress} In Progress, and ${resolved} Resolved). `;
    if (critical > 0) {
      briefing += `ALERT: ${critical} complaint(s) are classified as Critical priority and require immediate department dispatch. `;
    } else {
      briefing += `No critical priority escalations are currently pending. `;
    }
    if (topCategory !== 'None') {
      briefing += `"${topCategory}" is the highest volume category (${categoryCounts[topCategory]} issues), with highest activity centered in ${hotspotArea}. `;
    }
    if (avgSatisfaction) {
      briefing += `Citizen satisfaction rating is currently ${avgSatisfaction}/5.0 based on ${ratedComplaints.length} verified resolutions.`;
    } else {
      briefing += `Citizens are actively submitting issues and awaiting swift administrative action.`;
    }

    let isAiGenerated = false;

    // Check if GEMINI_API_KEY is available to enhance with Google Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.trim() !== '') {
      try {
        const prompt = `You are an AI Civic Operations Analyst for a Municipal Citizen Complaint Portal.
Generate a concise, professional 3-4 sentence operational briefing for the city officer based on these real-time metrics:
- Total complaints: ${total}
- New today: ${newToday}
- Pending review: ${pending}
- In progress: ${inProgress}
- Resolved: ${resolved}
- Critical priority count: ${critical}
- High priority count: ${high}
- Top issue category: ${topCategory} (${categoryCounts[topCategory] || 0} reports)
- Primary hotspot locality: ${hotspotArea}
- Citizen resolution satisfaction: ${avgSatisfaction ? `${avgSatisfaction}/5.0` : 'No feedback yet'}

Requirements: Professional government tone, actionable recommendations, highlighting critical escalations, maximum 4 sentences. Do not use markdown bolding or headers.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 200, temperature: 0.3 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim().length > 20) {
            briefing = generatedText.trim();
            isAiGenerated = true;
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call warning (using fallback briefing):', geminiError.message);
      }
    }

    return res.status(200).json({
      success: true,
      stats,
      briefing,
      isAiGenerated,
    });
  } catch (error) {
    console.error('Officer summary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate officer briefing.',
      error: error.message,
    });
  }
};
