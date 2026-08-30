# Citizen Complaint Portal

> **Full-Stack MERN Civic Complaint & Municipal Management Portal**  
> Empowering citizens to report local civic issues, upvote community priorities, and hold municipal administration accountable through transparent workflows, dynamic algorithmic priority scoring, officer command dashboards, AI briefings, and feedback loops.

---

## 🚀 Key Features

### 1. Citizen Portal
- **Localized Complaint Reporting**: Submit civic issues across 5 categories: `Road`, `Garbage`, `Water`, `Electricity`, `Other`.
- **Smart Duplicate Detection**: Real-time detection of existing active reports in the same category and locality before final submission, offering options to *View & Upvote Existing* or *Continue Anyway*.
- **Citizen Dashboard**: Personal metrics (Total, Pending, In Progress, Resolved) and quick access to active reports.
- **My Complaints & Resolution Feedback**: Track officer remarks and rate resolved complaints with a 1–5 star rating and comments.
- **Public Complaint Feed**: Search, multi-criteria filtering (Category, Status, Priority, Area), sorting, and community upvoting.

### 2. Algorithmic Dynamic Priority System
- **Formula**: `Priority Score = (Upvotes × 2) + Days Active`
- **Dynamic Tiers**:
  - `Score < 5` &rarr; **Low**
  - `Score 5–15` &rarr; **Medium**
  - `Score 16–30` &rarr; **High**
  - `Score > 30` &rarr; **Critical** (Visual alert badge)

### 3. Municipal Officer Operations Center
- **AI Executive Operations Briefing**: Real-time 3–4 sentence executive summary powered by **Google Gemini API** (with deterministic statistical fallback engine).
- **Operations Metric Cards**: Total, Pending Triage, In Progress, Resolved, Critical Escalations, and Citizen Satisfaction Rating.
- **Complaint Triage & Status Workflow**: Update status (`Pending` &rarr; `In Progress` &rarr; `Resolved`) and publish public officer remarks.
- **CSV Data Export**: Instant download of filtered complaint datasets for municipal reporting.

---

## 👥 Demo Accounts (Seed Credentials)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Municipal Officer** | `officer@citizenportal.com` | `Officer123!` | Officer Command Center, Status Updates, Officer Remarks, AI Briefings, CSV Export |
| **Citizen** | `citizen@citizenportal.com` | `Citizen123!` | Report Complaints, Upvote Issues, Track Personal Tickets, Submit Resolution Ratings |

*(Quick 1-click autofill buttons are built directly into the Login screen for fast demonstration!)*

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 7, Lucide Icons, Modern Civic Design System CSS
- **Backend**: Node.js, Express.js, JWT, bcryptjs, json2csv
- **Database**: MongoDB & Mongoose (with automated in-memory MongoDB fallback for instant zero-config evaluation)
- **AI Integration**: Google Gemini API (`GEMINI_API_KEY`)

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/citizen_complaints
JWT_SECRET=hackathon-citizen-portal-jwt-secret-key-2026
GEMINI_API_KEY=your_gemini_api_key_here # Optional: deterministic engine fallback if empty
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 How to Run Locally

### Option A: Run Server and Client Separately

1. **Start Backend Server**:
   ```bash
   cd server
   npm install
   npm start
   ```
   *The backend will automatically connect to MongoDB (or launch the embedded database) and seed initial demo accounts.*

2. **Start Frontend Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 🧪 Automated Testing

To run the end-to-end API test suite:
```bash
node server/test/api.test.js
```

---

## 🚢 Deployment Guide

- **Frontend**: Ready for **Vercel** / **Netlify** (includes `vercel.json` and `_redirects` for SPA routing).
- **Backend**: Deployable to **Render**, **Railway**, or **Heroku**.
- **Database**: Connect to **MongoDB Atlas** by setting `MONGODB_URI`.
