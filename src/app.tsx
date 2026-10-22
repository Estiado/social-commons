import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';

// 首页直接加载；其余页面只在访问时下载，避免首屏解析阅读器和导出库。
const DailyPage = lazy(() => import('@/pages/DailyPage/DailyPage'));
const DailyDetailPage = lazy(() => import('@/pages/DailyDetailPage/DailyDetailPage'));
const QuoteDetailPage = lazy(() => import('@/pages/QuoteDetailPage/QuoteDetailPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage/EventsPage'));
const EventDetailPage = lazy(() => import('@/pages/EventDetailPage/EventDetailPage'));
const QuotesPage = lazy(() => import('@/pages/QuotesPage/QuotesPage'));
const EssayPage = lazy(() => import('@/pages/EssayPage/EssayPage'));
const EditorMaterialsPage = lazy(() => import('@/pages/EditorMaterialsPage/EditorMaterialsPage'));
const GuanlanPage = lazy(() => import('@/pages/GuanlanPage/GuanlanPage'));
const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage/ArticleDetailPage'));
const PresetArticleDetailPage = lazy(
  () => import('@/pages/PresetArticleDetailPage/PresetArticleDetailPage'),
);
const TopicsPage = lazy(() => import('@/pages/TopicsPage/TopicsPage'));
const TopicDetailPage = lazy(() => import('@/pages/TopicDetailPage/TopicDetailPage'));
const AdminArticlesPage = lazy(() => import('@/pages/AdminArticlesPage/AdminArticlesPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage'));
const ArticleImportPage = lazy(() => import('@/pages/ArticleImportPage/ArticleImportPage'));
const ReadingLibraryPage = lazy(() => import('@/pages/ReadingLibraryPage/ReadingLibraryPage'));
const ReadingArticlePage = lazy(() => import('@/pages/ReadingArticlePage/ReadingArticlePage'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="daily" element={<DailyPage />} />
        <Route path="daily/:id" element={<DailyDetailPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="quotes/:id" element={<QuoteDetailPage />} />
        <Route path="essay" element={<EssayPage />} />
        <Route path="editor/materials" element={<EditorMaterialsPage />} />
        <Route path="guanlan" element={<GuanlanPage />} />
        <Route path="guanlan/preset/:id" element={<PresetArticleDetailPage />} />
        <Route path="guanlan/:id" element={<ArticleDetailPage />} />
        <Route path="reading" element={<ReadingLibraryPage />} />
        <Route path="reading/import" element={<ArticleImportPage />} />
        <Route path="reading/:id" element={<ReadingArticlePage />} />
        <Route path="paragraphs" element={<Navigate to="/reading?tab=excerpts" replace />} />
        <Route path="collections" element={<Navigate to="/reading?tab=collections" replace />} />
        <Route path="collections/:id" element={<Navigate to="/reading?tab=legacy" replace />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="topics/:id" element={<TopicDetailPage />} />
        <Route path="admin/articles" element={<AdminArticlesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
