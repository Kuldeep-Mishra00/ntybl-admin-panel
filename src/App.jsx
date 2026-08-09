import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './controllers/AuthContext.jsx';
import ProtectedRoute from './views/ProtectedRoute.jsx';
import DashboardLayout from './views/DashboardLayout.jsx';
import Login from './views/Login.jsx';
import Leads from './views/Leads.jsx';
import HomeImages from './views/HomeImages.jsx';
import WellnessAreas from './views/WellnessAreas.jsx';
import Testimonials from './views/Testimonials.jsx';
import Faq from './views/Faq.jsx';
import FooterLinks from './views/FooterLinks.jsx';
import FestivePromotions from './views/FestivePromotions.jsx';
import AccountSettings from './views/AccountSettings.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/leads" element={<Leads />} />
              <Route path="/home-images" element={<HomeImages />} />
              <Route path="/wellness-areas" element={<WellnessAreas />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/footer-links" element={<FooterLinks />} />
              <Route path="/festive" element={<FestivePromotions />} />
              <Route path="/account" element={<AccountSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/leads" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
