export const TOUR_SEEN_KEY = 'social-commons:guided-tour-v1';
export function shouldOfferTour(storage: Pick<Storage, 'getItem'>) {
  try {
    return storage.getItem(TOUR_SEEN_KEY) !== 'seen';
  } catch {
    return false;
  }
}
export function markTourSeen(storage: Pick<Storage, 'setItem'>) {
  try {
    storage.setItem(TOUR_SEEN_KEY, 'seen');
  } catch {
    /* The manual guide remains available. */
  }
}
