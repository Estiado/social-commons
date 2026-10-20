import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import DailyPage from '@/pages/DailyPage/DailyPage';
import EventsPage from '@/pages/EventsPage/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage/EventDetailPage';
import QuotesPage from '@/pages/QuotesPage/QuotesPage';
import EssayPage from '@/pages/EssayPage/EssayPage';
import GuanlanPage from '@/pages/GuanlanPage/GuanlanPage';
import ArticleDetailPage from '@/pages/ArticleDetailPage/ArticleDetailPage';
import ParagraphsPage from '@/pages/ParagraphsPage/ParagraphsPage';
import CollectionsPage from '@/pages/CollectionsPage/CollectionsPage';
import CollectionDetailPage from '@/pages/CollectionDetailPage/CollectionDetailPage';
import TopicsPage from '@/pages/TopicsPage/TopicsPage';
import TopicDetailPage from '@/pages/TopicDetailPage/TopicDetailPage';
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
        <Route path="essay" element={<EssayPage />} />
        <Route path="guanlan" element={<GuanlanPage />} />
        <Route path="guanlan/:id" element={<ArticleDetailPage />} />
        <Route path="paragraphs" element={<ParagraphsPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="collections/:id" element={<CollectionDetailPage />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="topics/:id" element={<TopicDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
