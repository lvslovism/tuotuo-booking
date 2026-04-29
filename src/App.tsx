import { Routes, Route } from 'react-router-dom';
import { MerchantLayout } from './components/layout/MerchantLayout';
import { AuthGuard } from './components/auth/AuthGuard';
import { BookingPage } from './pages/BookingPage';
import { ServicesPage } from './pages/ServicesPage';
import { MemberPage } from './pages/MemberPage';
import SuccessPage from './pages/SuccessPage';
import { CallbackPage } from './pages/CallbackPage';
import { StaffPage } from './pages/StaffPage';
import { PaymentResultPage } from './pages/PaymentResultPage';
import { ReschedulePage } from './pages/ReschedulePage';
import { ReviewPage } from './pages/ReviewPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LandingPage } from './pages/LandingPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { PackagesPage } from './pages/PackagesPage';
import { WaitlistPage } from './pages/WaitlistPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/s/:merchantCode" element={<MerchantLayout />}>
        <Route index element={<AuthGuard><BookingPage /></AuthGuard>} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="member" element={<AuthGuard><MemberPage /></AuthGuard>} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="callback" element={<CallbackPage />} />
        <Route path="payment-result" element={<PaymentResultPage />} />
        <Route path="reschedule" element={<ReschedulePage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="waitlist" element={<WaitlistPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
