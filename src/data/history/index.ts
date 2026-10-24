import type { IEvent } from '../types';
import { PUBLIC_LIFE_EVENTS } from './publicLife.ts';
import { MAYFLOWER_EVENT } from './colonial.ts';
import { ENLIGHTENMENT_EVENT } from './enlightenment.ts';
import { INDUSTRIAL_EVENT } from './industry.ts';
import { SILK_ROAD_EVENT } from './silkRoad.ts';
import { RIGHTS_EVENTS } from './rights.ts';
import { NATURAL_SELECTION_EVENT } from './naturalSelection.ts';

export const HISTORY_EVENTS: IEvent[] = [
  NATURAL_SELECTION_EVENT,
  ...RIGHTS_EVENTS,
  ...PUBLIC_LIFE_EVENTS,
  MAYFLOWER_EVENT,
  ENLIGHTENMENT_EVENT,
  INDUSTRIAL_EVENT,
  SILK_ROAD_EVENT,
];
