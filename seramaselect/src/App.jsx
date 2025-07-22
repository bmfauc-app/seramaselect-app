
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Records from './pages/Records'
import TraitSelector from './pages/TraitSelector'
import ResultsPage from './pages/ResultsPage'
import ComingSoon from './pages/ComingSoon'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import { TraitProvider } from './contexts/TraitContext'
import './App.css';

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {}
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <TraitProvider>
        <div className="app" style={{
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          color: isDarkMode ? '#ffffff' : '#333333',
          minHeight: '100vh',
          transition: 'background-color 0.3s ease, color 0.3s ease',
          overflowX: 'hidden',
          width: '100%'
        }}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/records" element={
                <ProtectedRoute>
                  <Records />
                </ProtectedRoute>
              } />
              <Route path="/traits" element={
                <ProtectedRoute>
                  <TraitSelector />
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              } />
              <Route path="/hatching" element={
                <ProtectedRoute>
                  <ComingSoon label="Hatching" />
                </ProtectedRoute>
              } />
              <Route path="/gallery" element={
                <ProtectedRoute>
                  <ComingSoon label="Gallery" />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </div>
      </TraitProvider>
    </ThemeContext.Provider>
  )
}
