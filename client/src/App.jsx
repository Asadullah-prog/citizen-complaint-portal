import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CitizenDashboard from './pages/CitizenDashboard';
import NewComplaintPage from './pages/NewComplaintPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import PublicComplaintsPage from './pages/PublicComplaintsPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';
import OfficerDashboard from './pages/OfficerDashboard';
import OfficerComplaintReviewPage from './pages/OfficerComplaintReviewPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/complaints" element={<PublicComplaintsPage />} />
            <Route path="/complaints/:id" element={<ComplaintDetailPage />} />

            {/* Citizen Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="citizen">
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/new"
              element={
                <ProtectedRoute requiredRole="citizen">
                  <NewComplaintPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/mine"
              element={
                <ProtectedRoute requiredRole="citizen">
                  <MyComplaintsPage />
                </ProtectedRoute>
              }
            />

            {/* Officer Protected Routes */}
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute requiredRole="officer">
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/complaints/:id"
              element={
                <ProtectedRoute requiredRole="officer">
                  <OfficerComplaintReviewPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
