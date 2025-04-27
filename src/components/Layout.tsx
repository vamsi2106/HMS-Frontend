import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hotel, LogOut } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Hotel className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">LuxStay</span>
              </Link>
            </div>
            
            <div className="flex items-center">
              {user ? (
                <>
                  <Link to="/reservations" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                    My Reservations
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="ml-4 inline-flex items-center text-gray-700 hover:text-indigo-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}