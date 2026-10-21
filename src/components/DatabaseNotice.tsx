import { supabase } from '@/lib/supabase';

/** 仅放在依赖云端个人数据的页面；静态阅读页面不需要数据库。 */
export function DatabaseNotice({ loading, error }: { loading: boolean; error: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center" role={error ? 'alert' : 'status'}>
      <p className="text-muted-foreground">
        {!supabase ? '当前为静态阅读模式，云端收藏和素材包尚未配置。' : error ? `暂时无法连接素材库：${error}` : loading ? '正在连接你的素材库…' : '暂时无法读取数据'}
      </p>
      {error && <button className="mt-4 text-accent underline" onClick={() => window.location.reload()}>重新连接</button>}
    </div>
  );
}
