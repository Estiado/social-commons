import type { ArticleDocument } from '../model';
import { prepareArticleExport } from '../model';
import { downloadArticleFile } from './assets';

export async function exportArticle(
  article: ArticleDocument,
  format: 'docx' | 'pdf',
): Promise<string[]> {
  article = prepareArticleExport(article);
  if (format === 'docx') {
    const { buildArticleDocx } = await import('./exportDocx');
    const result = await buildArticleDocx(article);
    downloadArticleFile(
      result.blob,
      `${article.title}.docx`,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    return result.warnings;
  }
  const { buildArticlePdf } = await import('./exportPdf');
  const result = await buildArticlePdf(article);
  downloadArticleFile(result.bytes, `${article.title}.pdf`, 'application/pdf');
  return result.warnings;
}
