import type { ArticleDocument } from './model.ts';

export const SOURCE_VERIFICATION_MESSAGE =
  '原网站返回了验证或访问拦截页面，尚未取得文章正文。请在原站正常打开后复制正文，切换到“粘贴正文”导入。';
export class SourceVerificationError extends Error {
  constructor() {
    super(SOURCE_VERIFICATION_MESSAGE);
    this.name = 'SourceVerificationError';
  }
}

/** Pair a challenge heading with instructions. A news story merely discussing
 * verification must not be mistaken for an access challenge. */
export function isVerificationPage(title: string, text: string, challengeForm = false) {
  const compact = text.replace(/\s+/g, ' ').trim();
  const heading =
    /^(环境异常|安全验证|访问验证|访问受限|人机验证|验证码|just a moment[.!…]*|attention required[!…]*|access denied|robot check)$/i.test(
      title.trim(),
    );
  const instruction =
    /完成验证后.{0,12}(继续访问|查看|访问)|当前环境异常|请.{0,8}(完成验证|进行验证)|去验证|verify (you are|that you)|checking your browser|enable javascript and cookies|unusual traffic/i.test(
      compact,
    );
  return (
    (heading && instruction) ||
    (challengeForm && instruction) ||
    (compact.length < 1500 && /当前环境异常/.test(compact) && /完成验证后|去验证/.test(compact))
  );
}
export function isBlockedDocument(article: ArticleDocument) {
  return isVerificationPage(
    article.title,
    article.blocks.flatMap((block) => ('text' in block ? [block.text] : [])).join(' '),
  );
}
