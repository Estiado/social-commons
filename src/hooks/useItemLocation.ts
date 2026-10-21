import { useEffect } from 'react';

/** 搜索深链接展开并定位条目，避免用户跳转后还要从长列表重新寻找。 */
export function useItemLocation(id: string | null, prefix: string) {
  useEffect(() => {
    if (id) document.getElementById(`${prefix}-${id}`)?.scrollIntoView({ block: 'start' });
  }, [id, prefix]);
}
