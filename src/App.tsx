import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DailyKhata from './pages/DailyKhata';
import Reports from './pages/Reports';
import HistoryPage from './pages/History';
import SettingsPage from './pages/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DailyKhata />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;