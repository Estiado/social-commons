import type { IEvent } from './types';
import { HISTORY_EVENTS } from './history/index.ts';

export const EVENTS: IEvent[] = HISTORY_EVENTS;

export function getEventById(id: string): IEvent | undefined {
  return EVENTS.find((event) => event.id === id);
}
