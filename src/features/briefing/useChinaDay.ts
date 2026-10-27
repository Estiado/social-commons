import { useEffect, useState } from 'react';
import { chinaDay, untilChinaMidnight } from './calendar';

export function useChinaDay() {
  const [day, setDay] = useState(chinaDay);
  useEffect(() => {
    const refresh = () => setDay(chinaDay());
    const timer = window.setTimeout(refresh, untilChinaMidnight());
    // A suspended phone tab may miss midnight; refresh when the reader returns.
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, [day]);
  return day;
}
