import type { Handler } from '@netlify/functions';
import { createExtractHandler } from '../../../server/extractArticle.ts';

// 平台适配层不包含业务逻辑，避免 Cloudflare / Netlify 两套实现漂移。
const extract = createExtractHandler({ ARTICLE_ALLOWED_HOSTS: process.env.ARTICLE_ALLOWED_HOSTS });
export const handler: Handler = async (event) => extract({ httpMethod: event.httpMethod, body: event.body });
