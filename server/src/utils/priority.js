/**
 * Calculate dynamic priority score and tier for a complaint.
 * Formula: Score = upvotes * 2 + daysSinceCreated
 * Tiers:
 *  - Score < 5: "Low"
 *  - Score 5–15: "Medium"
 *  - Score 16–30: "High"
 *  - Score > 30: "Critical"
 */
function calculatePriority(complaint) {
  const createdAt = complaint.createdAt ? new Date(complaint.createdAt) : new Date();
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - createdAt.getTime());
  const daysSinceCreated = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const upvotes = typeof complaint.upvotes === 'number' ? complaint.upvotes : 0;
  const score = upvotes * 2 + daysSinceCreated;

  let priority = 'Low';
  if (score > 30) {
    priority = 'Critical';
  } else if (score >= 16) {
    priority = 'High';
  } else if (score >= 5) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  return {
    priorityScore: score,
    priority,
    daysSinceCreated,
  };
}

/**
 * Attaches computed priority fields to a complaint plain object or Mongoose document
 */
function attachPriority(complaintDoc) {
  if (!complaintDoc) return null;
  const obj = typeof complaintDoc.toObject === 'function' ? complaintDoc.toObject() : { ...complaintDoc };
  const { priorityScore, priority, daysSinceCreated } = calculatePriority(obj);
  obj.priorityScore = priorityScore;
  obj.priority = priority;
  obj.daysSinceCreated = daysSinceCreated;
  return obj;
}

module.exports = {
  calculatePriority,
  attachPriority,
};
