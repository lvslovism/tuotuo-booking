import { Routes, Route, Navigate } from 'react-router-dom';
import { MerchantLayout } from './components/layout/MerchantLayout';
import { BookingPage } from './pages/BookingPage';
import { ServicesPage } from './pages/ServicesPage';
import { MemberPage } from './pages/MemberPage';
import { SuccessPage } from './pages/SuccessPage';
import { CallbackPage } from './pages/CallbackPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/s/:merchantCode" element={<MerchantLayout />}>
        <Route index element={<BookingPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="member" element={<MemberPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="callback" element={<CallbackPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/s/chikang" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
