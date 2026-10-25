import type { GuanlanEvent } from './types';

const loaders: Record<string, () => Promise<{ default: GuanlanEvent }>> = {
  'heritage-short-video': () => import('./heritage.ts'),
  'ai-at-work': () => import('./aiAtWork.ts'),
  'academic-bars': () => import('./academicBars.ts'),
};

export async function getGuanlanEvent(id: string): Promise<GuanlanEvent | undefined> {
  const load = Object.hasOwn(loaders, id) ? loaders[id] : undefined;
  return load ? (await load()).default : undefined;
}
