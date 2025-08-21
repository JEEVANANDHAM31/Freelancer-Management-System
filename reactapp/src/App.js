import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProjectDashboard from './components/ProjectDashboard';
import ProjectDetails from './components/ProjectDetails';

import ProjectListing from './components/ProjectListing';
import ContractListing from './components/ContractListing';
import ContractDetails from './components/ContractDetails';
import DashboardNavigation from './components/DashboardNavigation';
import MyProjects from './components/MyProjects';
import ProposalPage from './components/ProposalPage';
import ProposalListing from './components/ProposalListing';
import ProjectForm from './components/ProjectForm';
import MilestonePage from './components/MilestonePage';
import FilePage from './components/FilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Home and Auth Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardNavigation />
              </ProtectedRoute>
            } />
            
            {/* Project Routes */}
            <Route path="/projects" element={
              <ProtectedRoute>
                <ProjectListing />
              </ProtectedRoute>
            } />
            <Route path="/projects/new" element={
              <ProtectedRoute>
                <ProjectForm />
              </ProtectedRoute>
            } />
            <Route path="/projects/:projectId" element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            } />
            <Route path="/projects/:projectId/proposal" element={
              <ProtectedRoute>
                <ProposalPage />
              </ProtectedRoute>
            } />
            <Route path="/my-projects" element={
              <ProtectedRoute>
                <MyProjects />
              </ProtectedRoute>
            } />
            
            {/* Contract Routes */}
            <Route path="/contracts" element={
              <ProtectedRoute>
                <ContractListing />
              </ProtectedRoute>
            } />
            <Route path="/contracts/:contractId" element={
              <ProtectedRoute>
                <ContractDetails />
              </ProtectedRoute>
            } />
            <Route path="/contracts/:contractId/milestones" element={
              <ProtectedRoute>
                <MilestonePage />
              </ProtectedRoute>
            } />
            <Route path="/projects/:projectId/files" element={
              <ProtectedRoute>
                <FilePage />
              </ProtectedRoute>
            } />
            
            {/* Legacy Dashboard */}
            <Route path="/project-dashboard" element={
              <ProtectedRoute>
                <ProjectDashboard />
              </ProtectedRoute>
            } />
            <Route path="/proposals" element={
              <ProtectedRoute>
                <ProposalListing />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
