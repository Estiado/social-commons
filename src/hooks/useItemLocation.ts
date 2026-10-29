import { useEffect } from 'react';
import { revealReadingTarget } from '@/features/reading/hierarchy';

/** 搜索深链接展开并定位条目，避免用户跳转后还要从长列表重新寻找。 */
export function useItemLocation(id: string | null, prefix: string) {
  useEffect(() => {
    const target = id ? document.getElementById(`${prefix}-${id}`) : null;
    if (target) {
      revealReadingTarget(target);
      target.scrollIntoView({ block: 'start' });
    }
  }, [id, prefix]);
}
