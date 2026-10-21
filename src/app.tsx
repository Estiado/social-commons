import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';

// 首页直接加载；其余页面只在访问时下载，避免首屏解析阅读器和导出库。
const DailyPage = lazy(() => import('@/pages/DailyPage/DailyPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage/EventsPage'));
const EventDetailPage = lazy(() => import('@/pages/EventDetailPage/EventDetailPage'));
const QuotesPage = lazy(() => import('@/pages/QuotesPage/QuotesPage'));
const EssayPage = lazy(() => import('@/pages/EssayPage/EssayPage'));
const GuanlanPage = lazy(() => import('@/pages/GuanlanPage/GuanlanPage'));
const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage/ArticleDetailPage'));
const PresetArticleDetailPage = lazy(() => import('@/pages/PresetArticleDetailPage/PresetArticleDetailPage'));
const ParagraphsPage = lazy(() => import('@/pages/ParagraphsPage/ParagraphsPage'));
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('@/pages/CollectionDetailPage/CollectionDetailPage'));
const TopicsPage = lazy(() => import('@/pages/TopicsPage/TopicsPage'));
const TopicDetailPage = lazy(() => import('@/pages/TopicDetailPage/TopicDetailPage'));
const AdminArticlesPage = lazy(() => import('@/pages/AdminArticlesPage/AdminArticlesPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage'));

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
        <Route path="guanlan/preset/:id" element={<PresetArticleDetailPage />} />
        <Route path="guanlan/:id" element={<ArticleDetailPage />} />
        <Route path="paragraphs" element={<ParagraphsPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="collections/:id" element={<CollectionDetailPage />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="topics/:id" element={<TopicDetailPage />} />
        <Route path="admin/articles" element={<AdminArticlesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
