import type { GuanlanEvent } from './types';

const loaders: Record<string, () => Promise<{ default: GuanlanEvent }>> = {
  'heritage-short-video': () => import('./heritage.ts'),
  'ai-at-work': () => import('./aiAtWork.ts'),
  'academic-bars': () => import('./academicBars.ts'),
  'online-personas': () => import('./onlinePersonas.ts'),
  'freshman-belonging': () => import('./freshmanBelonging.ts'),
  'xibei-trust': () => import('./xibeiTrust.ts'),
  'concert-cities': () => import('./concertCities.ts'),
  'reverse-tourism': () => import('./reverseTourism.ts'),
  'labubu-collecting': () => import('./labubuCollecting.ts'),
  'wuzhen-theatre': () => import('./wuzhenTheatre.ts'),
  'facebook-emotion': () => import('./facebookEmotion.ts'),
  'gpt-sycophancy': () => import('./gptSycophancy.ts'),
};

export async function getGuanlanEvent(id: string): Promise<GuanlanEvent | undefined> {
  const load = Object.hasOwn(loaders, id) ? loaders[id] : undefined;
  return load ? (await load()).default : undefined;
}
