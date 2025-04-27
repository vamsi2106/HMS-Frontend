import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const RoomSearchPage = React.lazy(() => import('./pages/RoomSearchPage'));
const RoomDetailsPage = React.lazy(() => import('./pages/RoomDetailsPage'));
const ReservationPage = React.lazy(() => import('./pages/ReservationPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<RoomSearchPage />} />
              <Route path="/room/:id" element={<RoomDetailsPage />} />
              <Route
                path="/reservations"
                element={
                  <PrivateRoute>
                    <ReservationPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute adminOnly>
                    <AdminPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </React.Suspense>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;