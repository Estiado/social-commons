import { useLoadEffect } from '@/hooks/useLoadEffect';
import { requireSuccess } from '@/lib/database';
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useUserSession } from '@/hooks/useUserId';
import { DatabaseNotice } from '@/components/DatabaseNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  paragraph_count?: number;
}

export default function CollectionsPage() {
  const { userId, loading: userLoading, error: authError } = useUserSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 获取素材包列表（同时统计每个包的段落数）
  const fetchCollections = useCallback(async () => {
    if (!supabase || !userId) return;
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*, collection_paragraphs(count), collection_highlights(count)')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCollections(
        (data || []).map((c: any) => ({
          ...c,
          paragraph_count: (c.collection_paragraphs?.[0]?.count || 0) + (c.collection_highlights?.[0]?.count || 0),
        })),
      );
    } catch (err) {
      console.error('获取素材包失败:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useLoadEffect(fetchCollections);

  // 创建素材包
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !userId || !newName.trim()) return;
    setCreating(true);
    try {
      const { error } = await supabase.from('collections').insert({
        user_id: userId,
        name: newName.trim(),
        description: newDesc.trim() || null,
      });
      if (error) throw error;
      setNewName('');
      setNewDesc('');
      setShowCreateForm(false);
      fetchCollections();
    } catch (err) {
      console.error('创建素材包失败:', err);
    } finally {
      setCreating(false);
    }
  };

  // 删除素材包
  const handleDelete = async (id: string) => {
    if (!supabase || !userId) return;
    if (!confirm('确定删除这个素材包吗？里面的段落关联也会被删除。')) return;
    setDeletingId(id);
    try {
      await requireSuccess(supabase.from('collections').delete().eq('id', id).eq('user_id', userId));
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('删除素材包失败:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  if (!supabase || userLoading || authError) {
    return <DatabaseNotice loading={userLoading} error={authError} />;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-600 opacity-70" />
        <p className="text-muted-foreground">素材包需要配置Supabase数据库后使用</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Collections</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">我的素材包</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          把收藏的段落按作文主题整理成素材包。写作文前打开对应素材包，逐段参考，一键导出。
        </p>
      </div>

      {/* 创建按钮 */}
      <div className="mb-8">
        {!showCreateForm ? (
          <Button variant="outline" onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            新建素材包
          </Button>
        ) : (
          <form onSubmit={handleCreate} className="p-5 border border-accent/30 bg-accent/5 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-semibold">新建素材包</h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs mb-1 block">素材包名称 *</Label>
                <Input
                  placeholder="如：科技创新、文化自信、青年担当..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">描述（可选）</Label>
                <Textarea
                  placeholder="这个素材包用于什么主题的作文..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowCreateForm(false)}>
                  取消
                </Button>
                <Button type="submit" disabled={creating || !newName.trim()}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : '创建'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* 素材包列表 */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="mb-2">还没有素材包</p>
          <p className="text-xs">
            先去<Link to="/paragraphs" className="text-accent hover:underline">段落库</Link>
            收藏段落，然后创建素材包整理它们
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {collections.map((col) => (
            <div
              key={col.id}
              className="group border border-border/60 bg-card rounded-sm p-6 hover:border-accent/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <Link to={`/collections/${col.id}`} className="flex-1">
                  <h2 className="font-serif text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {col.name}
                  </h2>
                  {col.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{col.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {col.paragraph_count} 条素材
                    </span>
                    <span>更新于 {formatDate(col.updated_at)}</span>
                  </div>
                </Link>
                <button
                  onClick={() => handleDelete(col.id)}
                  disabled={deletingId === col.id}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  title="删除素材包"
                >
                  {deletingId === col.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-12 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          素材包与你的浏览器绑定（匿名用户ID）。清除浏览器数据或换设备会丢失。
          第三期将接入注册登录，实现跨设备同步。
        </p>
      </div>
    </div>
  );
}
