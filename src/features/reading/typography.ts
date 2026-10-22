import { z } from 'zod';

export const documentTypographySchema = z.object({
  font: z.enum(['song', 'hei', 'yahei', 'arial', 'times']),
  size: z.union([z.literal(10.5), z.literal(12), z.literal(14), z.literal(16)]),
  lineHeight: z.union([z.literal(1.15), z.literal(1.5), z.literal(2)]),
});
export type DocumentTypography = z.infer<typeof documentTypographySchema>;

export const DOCUMENT_FONTS = {
  song: { label: '宋体', css: 'SimSun, "Songti SC", serif', word: '宋体' },
  hei: { label: '黑体', css: 'SimHei, "Heiti SC", sans-serif', word: '黑体' },
  yahei: {
    label: '微软雅黑',
    css: '"Microsoft YaHei", "PingFang SC", sans-serif',
    word: '微软雅黑',
  },
  arial: { label: 'Arial', css: 'Arial, sans-serif', word: 'Arial' },
  times: { label: 'Times New Roman', css: '"Times New Roman", serif', word: 'Times New Roman' },
} as const;

export const DEFAULT_TYPOGRAPHY: DocumentTypography = { font: 'song', size: 12, lineHeight: 1.5 };
