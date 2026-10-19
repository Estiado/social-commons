import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import DailyPage from '@/pages/DailyPage/DailyPage';
import EventsPage from '@/pages/EventsPage/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage/EventDetailPage';
import QuotesPage from '@/pages/QuotesPage/QuotesPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="daily" element={<DailyPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
