import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PitchListPage from './pages/PitchListPage';
import PitchDetailPage from './pages/PitchDetailPage';
import CreatePitchPage from './pages/CreatePitchPage';
import EditPitchPage from './pages/EditPitchPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow container-custom py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pitches" element={<PitchListPage />} />
              <Route path="/pitch/:id" element={<PitchDetailPage />} />
              <Route path="/create-pitch" element={
                <PrivateRoute>
                  <CreatePitchPage />
                </PrivateRoute>
              } />
              <Route path="/edit-pitch/:id" element={
                <PrivateRoute>
                  <EditPitchPage />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;