import { writeFile } from 'node:fs/promises';
import { ESSAY_EXAMPLES } from '../src/data/essayExamples.ts';

const quote = (value) => `'${value.replaceAll("'", "''")}'`;
const rows = ESSAY_EXAMPLES.map((item) => `(${[item.id, item.conceptId, item.title, item.content, item.source, item.sourceUrl, item.usageHint].map(quote).join(',')})`);
await writeFile('supabase/seeds/essay_examples.sql', `-- Reviewed source-based site examples. No reader's private data.\nbegin;\ninsert into public.essay_examples (id,concept_id,title,content,source,source_url,usage_hint) values\n${rows.join(',\n')}\non conflict(id) do update set concept_id=excluded.concept_id,title=excluded.title,content=excluded.content,source=excluded.source,source_url=excluded.source_url,usage_hint=excluded.usage_hint;\ncommit;\n`);
console.log(`Generated ${rows.length} site examples.`);
