const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database. Starting seed process...');

    // Clear existing collections for a clean, deterministic demo state
    await User.deleteMany({});
    await Complaint.deleteMany({});

    // Hash passwords
    const officerPasswordHash = await bcrypt.hash('Officer123!', 10);
    const citizenPasswordHash = await bcrypt.hash('Citizen123!', 10);
    const citizen2PasswordHash = await bcrypt.hash('Citizen123!', 10);

    // Create Demo Users
    const officer = await User.create({
      name: 'Engr. Tariq Mehmood',
      email: 'officer@citizenportal.com',
      password: officerPasswordHash,
      role: 'officer',
    });

    const citizen = await User.create({
      name: 'Ayesha Khan',
      email: 'citizen@citizenportal.com',
      password: citizenPasswordHash,
      role: 'citizen',
    });

    const citizen2 = await User.create({
      name: 'Bilal Ahmed',
      email: 'bilal@citizenportal.com',
      password: citizen2PasswordHash,
      role: 'citizen',
    });

    console.log('[Seed] Demo accounts created successfully:');
    console.log(' - Officer: officer@citizenportal.com / Officer123!');
    console.log(' - Citizen: citizen@citizenportal.com / Citizen123!');

    // Dates for dynamic priority score calculation
    const now = new Date();
    const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const complaintsToInsert = [
      {
        title: 'Broken streetlight causing safety hazard',
        description: 'Streetlight pole #14 has been non-functional for 8 days near Commercial Market, causing severe safety and visibility hazards at night.',
        category: 'Electricity',
        area: 'Satellite Town',
        status: 'In Progress',
        upvotes: 18, // Priority score: 18*2 + 8 = 44 (Critical)
        createdBy: citizen._id,
        officerRemark: 'Electric maintenance team dispatched. Replacement fixture ordered.',
        createdAt: daysAgo(8),
        feedbackGiven: false,
        feedbackPending: false,
      },
      {
        title: 'Severe garbage accumulation near main market',
        description: 'Huge piles of uncollected municipal waste blocking the pedestrian walkway and producing foul smell near Gulberg Main Market.',
        category: 'Garbage',
        area: 'Gulberg',
        status: 'Pending',
        upvotes: 12, // Priority score: 12*2 + 3 = 27 (High)
        createdBy: citizen._id,
        officerRemark: '',
        createdAt: daysAgo(3),
        feedbackGiven: false,
        feedbackPending: false,
      },
      {
        title: 'Water supply interruption for 48 hours',
        description: 'Main pipeline leak has disrupted municipal drinking water supply to over 60 households in Sector F-7/2.',
        category: 'Water',
        area: 'F-7 Markaz',
        status: 'Pending',
        upvotes: 15, // Priority score: 15*2 + 2 = 32 (Critical)
        createdBy: citizen2._id,
        officerRemark: '',
        createdAt: daysAgo(2),
        feedbackGiven: false,
        feedbackPending: false,
      },
      {
        title: 'Damaged asphalt and deep potholes on Main Boulevard',
        description: 'Multiple large potholes causing vehicle damage and traffic jams right after monsoon rain near Clifton Block 4.',
        category: 'Road',
        area: 'Clifton',
        status: 'In Progress',
        upvotes: 6, // Priority score: 6*2 + 5 = 17 (High)
        createdBy: citizen._id,
        officerRemark: 'Road carpeting machinery deployed. Patchwork underway.',
        createdAt: daysAgo(5),
        feedbackGiven: false,
        feedbackPending: false,
      },
      {
        title: 'Overflowing garbage container attracting strays',
        description: 'Municipal dumpster overflowing onto the service lane near Saddar Bazaar. Needs immediate clearing and sanitization.',
        category: 'Garbage',
        area: 'Saddar',
        status: 'Resolved',
        upvotes: 4, // Priority score: 4*2 + 10 = 18 (High)
        createdBy: citizen._id,
        officerRemark: 'Sanitation crew cleared dumpster and disinfected the area on Aug 28.',
        createdAt: daysAgo(10),
        feedbackRating: 5,
        feedbackComment: 'Prompt and thorough response by the sanitation department. Thank you!',
        feedbackGiven: true,
        feedbackPending: false,
      },
      {
        title: 'Dangerous hanging live wire near community playground',
        description: 'Loose overhead power line dangling dangerously close to children playground entrance near Model Town Park.',
        category: 'Electricity',
        area: 'Model Town',
        status: 'Pending',
        upvotes: 16, // Priority score: 16*2 + 1 = 33 (Critical)
        createdBy: citizen2._id,
        officerRemark: '',
        createdAt: daysAgo(1),
        feedbackGiven: false,
        feedbackPending: false,
      },
      {
        title: 'Damaged drainage manhole cover open on street',
        description: 'Cover missing on main street. Poses severe fall risk for pedestrians and motorcyclists.',
        category: 'Road',
        area: 'Satellite Town',
        status: 'Resolved',
        upvotes: 2, // Priority score: 2*2 + 4 = 8 (Medium)
        createdBy: citizen._id,
        officerRemark: 'Heavy duty concrete cover installed and sealed.',
        createdAt: daysAgo(4),
        feedbackRating: 4,
        feedbackComment: 'Fixed within 24 hours of reporting. Good job.',
        feedbackGiven: true,
        feedbackPending: false,
      },
      {
        title: 'Low municipal water pressure in residential block',
        description: 'Water pressure is too low to reach first-floor storage tanks throughout the morning supply window.',
        category: 'Water',
        area: 'Gulberg',
        status: 'Resolved',
        upvotes: 1, // Priority score: 1*2 + 6 = 8 (Medium)
        createdBy: citizen._id,
        officerRemark: 'Booster pump repaired at local pumping station.',
        createdAt: daysAgo(6),
        feedbackPending: true, // Needs feedback from citizen! Perfect for demo flow!
        feedbackGiven: false,
      }
    ];

    await Complaint.insertMany(complaintsToInsert);
    console.log(`[Seed] Seeded ${complaintsToInsert.length} realistic complaint records.`);
    console.log('[Seed] Database initialization complete!');
  } catch (error) {
    console.error('[Seed] Seeding failed:', error);
  }
};

// If run directly via `node src/seed.js`
if (require.main === module) {
  require('dotenv').config();
  seedData().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}

module.exports = seedData;
