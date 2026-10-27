import type { WorldStory } from './types';

const loaders: Record<string, () => Promise<{ default: WorldStory }>> = {
  ukraine: () => import('./ukraine.ts'),
  palestine: () => import('./palestine.ts'),
  'un-2030': () => import('./un2030.ts'),
};

/** The public catalogue never downloads all timelines or private reading data. */
export async function getWorldStory(id: string): Promise<WorldStory | undefined> {
  return Object.hasOwn(loaders, id) ? (await loaders[id]()).default : undefined;
}
