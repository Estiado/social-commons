import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useItemLocation } from '@/hooks/useItemLocation';
import {
  PenTool,
  Tag,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  X,
  Trash2,
} from 'lucide-react';
import { ESSAY_MATERIALS } from '@/data/essay';
import { ConceptMaterials } from '@/features/essay/ConceptMaterials';
import type { IEssayMaterial } from '@/data/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function EssayPage() {
  const [activePrimary, setActivePrimary] = useState<string>('全部');
  const [activeSub, setActiveSub] = useState<string>('全部');
  const [searchParams] = useSearchParams();
  useItemLocation(searchParams.get('id'), 'essay');
  const [expandedId, setExpandedId] = useState<string | null>(searchParams.get('id'));
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);

  // 用户自定义词条和标签（存在localStorage）
  const [customMaterials, setCustomMaterials] = useLocalStorage<IEssayMaterial[]>('custom-essay-materials', []);
  const [customCategories, setCustomCategories] = useLocalStorage<string[]>('custom-categories', []);

  // 新词条表单状态
  const [newConcept, setNewConcept] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTopics, setNewTopics] = useState('');
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialContent, setNewMaterialContent] = useState('');
  const [newMaterialSource, setNewMaterialSource] = useState('');

  // 新标签表单状态
  const [newTag, setNewTag] = useState('');

  // 合并内置+自定义词条
  const allMaterials = useMemo(() => [...ESSAY_MATERIALS, ...customMaterials], [customMaterials]);

  // 一级分类
  const primaryCategories = useMemo(() => {
    const primaries = new Set<string>();
    allMaterials.forEach((m) => primaries.add(m.category.split(' · ')[0]));
    customCategories.forEach((c) => primaries.add(c.split(' · ')[0]));
    return ['全部', ...Array.from(primaries)];
  }, [allMaterials, customCategories]);

  // 二级分类
  const subCategories = useMemo(() => {
    if (activePrimary === '全部') return [];
    const subs = new Set<string>();
    allMaterials
      .filter((m) => m.category.startsWith(activePrimary))
      .forEach((m) => {
        const parts = m.category.split(' · ');
        if (parts[1]) subs.add(parts[1]);
      });
    customCategories
      .filter((c) => c.startsWith(activePrimary))
      .forEach((c) => {
        const parts = c.split(' · ');
        if (parts[1]) subs.add(parts[1]);
      });
    return ['全部', ...Array.from(subs)];
  }, [activePrimary, allMaterials, customCategories]);

  // 筛选+搜索
  const filtered = useMemo(() => {
    return allMaterials.filter((m) => {
      // 分类筛选
      if (activePrimary !== '全部') {
        if (!m.category.startsWith(activePrimary)) return false;
        if (activeSub !== '全部' && m.category !== `${activePrimary} · ${activeSub}`) return false;
      }
      // 搜索
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchable = [
          m.concept,
          m.description,
          m.category,
          ...m.applicableTopics,
          ...m.materials.map((mat) => `${mat.title} ${mat.content} ${mat.source}`),
        ]
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [allMaterials, activePrimary, activeSub, searchQuery]);

  const handlePrimaryChange = (cat: string) => {
    setActivePrimary(cat);
    setActiveSub('全部');
  };

  const handleAddMaterial = () => {
    if (!newConcept.trim() || !newCategory.trim()) return;
    const newMaterial: IEssayMaterial = {
      id: `custom-${Date.now()}`,
      concept: newConcept.trim(),
      category: newCategory.trim(),
      description: newDescription.trim() || '（用户自定义词条，待补充描述）',
      applicableTopics: newTopics
        .split(/[,，、]/)
        .map((t) => t.trim())
        .filter(Boolean),
      materials: newMaterialContent.trim()
        ? [
            {
              title: newMaterialTitle.trim() || '素材1',
              content: newMaterialContent.trim(),
              source: newMaterialSource.trim() || '用户整理',
            },
          ]
        : [],
    };
    try { setCustomMaterials((prev) => [...prev, newMaterial]); }
    catch { alert('浏览器存储不可用或空间不足，词条未保存。请先备份现有内容。'); return; }
    // 重置表单
    setNewConcept('');
    setNewCategory('');
    setNewDescription('');
    setNewTopics('');
    setNewMaterialTitle('');
    setNewMaterialContent('');
    setNewMaterialSource('');
    setShowAddForm(false);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!customCategories.includes(newTag.trim())) {
      try { setCustomCategories((prev) => [...prev, newTag.trim()]); }
      catch { alert('浏览器存储不可用，标签未保存'); return; }
    }
    setNewTag('');
    setShowTagForm(false);
  };

  const handleDeleteCustom = (id: string) => {
    try { setCustomMaterials((prev) => prev.filter((m) => m.id !== id)); }
    catch { alert('浏览器存储不可用，删除未保存'); }
  };

  const isCustom = (id: string) => id.startsWith('custom-');

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <PenTool className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Essay · 议论文素材</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">高考议论文素材库</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          每个通识概念都可以成为议论文的优质素材。你可以从网上摘抄优秀文段填入，也可以添加自己的词条和分类，积累属于自己的素材库。
        </p>
      </div>

      {/* 搜索 + 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索概念、素材、适用话题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowTagForm(false);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          添加词条
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowTagForm(!showTagForm);
            setShowAddForm(false);
          }}
          className="gap-2"
        >
          <Tag className="h-4 w-4" />
          添加标签
        </Button>
      </div>

      {/* 添加词条表单 */}
      {showAddForm && (
        <div className="mb-6 p-5 border border-accent/30 bg-accent/5 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold">添加自定义词条</h3>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs mb-1 block">概念名称 *</Label>
              <Input placeholder="如：沉默的螺旋" value={newConcept} onChange={(e) => setNewConcept(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs mb-1 block">分类 *（格式：一级 · 二级，如"传播学 · 舆论学"）</Label>
              <Input placeholder="传播学 · 舆论学" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-xs mb-1 block">概念描述</Label>
            <Textarea
              placeholder="简要说明这个概念的含义和适用场景..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="mt-4">
            <Label className="text-xs mb-1 block">适用话题（用逗号分隔）</Label>
            <Input
              placeholder="如：舆论力量, 群体心理, 独立思考"
              value={newTopics}
              onChange={(e) => setNewTopics(e.target.value)}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs mb-1 block">素材标题</Label>
              <Input
                placeholder="如：示例：某事件中的沉默螺旋"
                value={newMaterialTitle}
                onChange={(e) => setNewMaterialTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">素材来源</Label>
              <Input
                placeholder="如：人民日报评论"
                value={newMaterialSource}
                onChange={(e) => setNewMaterialSource(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-xs mb-1 block">素材正文（可从网上摘抄优秀文段）</Label>
            <Textarea
              placeholder="粘贴你摘抄的文段..."
              value={newMaterialContent}
              onChange={(e) => setNewMaterialContent(e.target.value)}
              rows={4}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAddForm(false)}>
              取消
            </Button>
            <Button onClick={handleAddMaterial} disabled={!newConcept.trim() || !newCategory.trim()}>
              保存词条
            </Button>
          </div>
        </div>
      )}

      {/* 添加标签表单 */}
      {showTagForm && (
        <div className="mb-6 p-5 border border-accent/30 bg-accent/5 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold">添加自定义分类标签</h3>
            <button onClick={() => setShowTagForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="格式：一级 · 二级，如：传播学 · 舆论学"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} disabled={!newTag.trim()}>
              添加
            </Button>
          </div>
          {customCategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {customCategories.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted/60 rounded-sm">
                  {cat}
                  <button
                    onClick={() => setCustomCategories((prev) => prev.filter((c) => c !== cat))}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 一级分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {primaryCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handlePrimaryChange(cat)}
            className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${
              activePrimary === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 二级分类筛选 */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 pl-2 border-l-2 border-accent/20">
          <span className="text-xs text-muted-foreground mr-1">细分：</span>
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                activeSub === sub
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
      {subCategories.length === 0 && <div className="mb-8" />}

      {/* 词条列表 */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <article
              key={item.id}
              id={`essay-${item.id}`}
              className="scroll-mt-24 border border-border/60 bg-card rounded-sm overflow-hidden"
            >
              <button
                aria-expanded={isExpanded}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left p-6 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge variant="outline" className="border-accent/30 text-accent">
                        <Tag className="h-3 w-3 mr-1" />
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">可添加个人素材</span>
                      {isCustom(item.id) && (
                        <span className="text-xs px-1.5 py-0.5 bg-accent/10 text-accent rounded-sm">自定义</span>
                      )}
                    </div>
                    <h2 className="font-serif text-xl font-semibold mb-2">{item.concept}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.applicableTopics.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted/60 text-muted-foreground rounded-sm"
                        >
                          <Lightbulb className="h-3 w-3" />
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-1">
                    {isCustom(item.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustom(item.id);
                        }}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        title="删除此词条"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </button>

              {/* 展开的素材列表 */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-border/40 pt-5">
                  <ConceptMaterials conceptId={item.id} legacy={item.id.startsWith('custom-') ? item.materials.map((material) => ({ ...material, sourceUrl: '', usageHint: material.usageHint || '' })) : []} />
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <PenTool className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>没有找到匹配的词条</p>
          <p className="text-xs mt-1">试试其他关键词，或点击"添加词条"创建新的素材</p>
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-12 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          自定义词条、素材和标签保存在当前浏览器中，换设备或清除浏览器数据会丢失。
          请在素材区使用“备份我的全部素材”保存个人摘录。站方推荐由具有编辑权限的账号维护。
          <Link className="ml-2 text-accent underline" to="/editor/materials">站方推荐管理</Link>
        </p>
      </div>
    </div>
  );
}
