import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('旧目录禁止客户端写入，私有段落仅明确收藏者可读；迁移可重跑', async () => {
  const database = new PGlite();
  try {
    await database.exec(`
      create role anon; create role authenticated; create schema auth;
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.uid',true),'')::uuid $$;
      grant usage on schema auth to anon,authenticated;
      create table articles(id int primary key,is_public boolean);
      create table article_paragraphs(id int primary key,article_id int references articles(id),content text);
      create table saved_paragraphs(paragraph_id int,user_id uuid);
      create table collections(id int primary key,user_id uuid,is_public boolean);
      create table collection_paragraphs(collection_id int,paragraph_id int);
      insert into articles values (1,true),(2,false);
      insert into article_paragraphs values (1,1,'公共'),(2,2,'私有');
      insert into saved_paragraphs values (2,'00000000-0000-4000-8000-000000000001');
      alter table articles enable row level security;
      alter table article_paragraphs enable row level security;
      create policy legacy_all on articles for all using(true) with check(true);
      create policy legacy_all on article_paragraphs for all using(true) with check(true);
      grant all on all tables in schema public to public,anon,authenticated;
    `);
    const sql = await readFile(
      new URL(
        '../supabase/migrations/202610230001_legacy_catalogue_permissions.sql',
        import.meta.url,
      ),
      'utf8',
    );
    await database.exec(sql);
    await database.exec(sql);
    for (const role of ['anon', 'authenticated']) {
      await database.exec(`reset role; set role ${role};`);
      assert.deepEqual((await database.query('select id from articles')).rows, [{ id: 1 }]);
      assert.deepEqual((await database.query('select id from article_paragraphs')).rows, [
        { id: 1 },
      ]);
      await assert.rejects(database.exec('insert into articles values (3,true)'));
      await assert.rejects(database.exec('update articles set is_public=true'));
      await assert.rejects(database.exec('delete from article_paragraphs'));
    }
    await database.exec(
      `reset role; select set_config('request.uid','00000000-0000-4000-8000-000000000001',false); set role authenticated;`,
    );
    assert.equal((await database.query('select * from article_paragraphs')).rows.length, 2);
    await database.exec(
      `reset role; select set_config('request.uid','00000000-0000-4000-8000-000000000002',false); set role authenticated;`,
    );
    assert.equal((await database.query('select * from article_paragraphs')).rows.length, 1);
  } finally {
    await database.close();
  }
});
