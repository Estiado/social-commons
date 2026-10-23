import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { createFeedbackSubmitter } from '../src/features/feedback/submit.ts';

const fields = {
  kind: '使用问题',
  description: '手机搜索后看不见结果',
  expected: '定位结果',
  page: '/essay?token=private#anchor',
};

test('在线反馈仅在收到对应回执后成功，超时重试沿用同一编号且去除查询信息', async () => {
  const id = crypto.randomUUID();
  const requests: Record<string, string>[] = [];
  const submit = createFeedbackSubmitter(async (parameters, signal) => {
    assert.ok(signal instanceof AbortSignal);
    requests.push(parameters);
    if (requests.length === 1) throw new Error('timeout');
    return { data: id, error: null };
  });
  await assert.rejects(submit(fields, id), /网络未确认/u);
  assert.equal(await submit(fields, id), id);
  assert.deepEqual(requests[0], requests[1]);
  assert.equal(requests[0].p_page, '/essay');
  assert.doesNotMatch(JSON.stringify(requests), /token|private|anchor/u);
  await assert.rejects(
    createFeedbackSubmitter(async () => ({ data: null, error: null }))(fields, id),
    /有效回执/u,
  );
  await assert.rejects(
    createFeedbackSubmitter(async () => ({ data: null, error: { code: 'PT429' } }))(fields, id),
    /稍后重试/u,
  );
  let called = false;
  await assert.rejects(
    createFeedbackSubmitter(async () => {
      called = true;
      return { data: id, error: null };
    })({ ...fields, description: '短' }, id),
  );
  assert.equal(called, false);
});

test('后台反馈只有受限提交入口，访客无法读写收件表；重复请求不覆盖内容或处理状态', async () => {
  const database = new PGlite();
  try {
    await database.exec('create role anon; create role authenticated;');
    const sql = await readFile(
      new URL('../supabase/migrations/202610230002_beta_feedback.sql', import.meta.url),
      'utf8',
    );
    await database.exec(sql);
    await database.exec(sql);
    const id = crypto.randomUUID();
    const parameters = [id, fields.kind, '/essay', fields.description, fields.expected, ''];
    for (const role of ['anon', 'authenticated']) {
      await database.exec(`reset role; set role ${role};`);
      for (const query of [
        'select * from beta_feedback',
        "insert into beta_feedback(id,kind,description) values(gen_random_uuid(),'使用问题','无法直接插入反馈')",
        "update beta_feedback set status='resolved'",
        'delete from beta_feedback',
        'truncate beta_feedback',
      ])
        await assert.rejects(database.exec(query), /permission denied/u);
      assert.equal(
        (
          await database.query(
            'select public.submit_beta_feedback($1,$2,$3,$4,$5,$6) as id',
            parameters,
          )
        ).rows[0].id,
        id,
      );
    }
    await database.exec(`reset role; update beta_feedback set status='resolved'; set role anon;`);
    await database.query('select public.submit_beta_feedback($1,$2,$3,$4,$5,$6)', parameters);
    await assert.rejects(
      database.query('select public.submit_beta_feedback($1,$2,$3,$4,$5,$6)', [
        id,
        fields.kind,
        '/essay',
        '不能覆盖已经提交的反馈',
        '',
        '',
      ]),
      /feedback_receipt_conflict/u,
    );
    for (const invalid of [
      [null, fields.kind, '', fields.description, '', ''],
      [crypto.randomUUID(), '未知类型', '', fields.description, '', ''],
      [crypto.randomUUID(), fields.kind, '/essay?secret=x', fields.description, '', ''],
      [crypto.randomUUID(), fields.kind, '', '短', '', ''],
      [crypto.randomUUID(), fields.kind, '', fields.description, '', 'spam'],
    ])
      await assert.rejects(
        database.query('select public.submit_beta_feedback($1,$2,$3,$4,$5,$6)', invalid),
        /invalid_feedback/u,
      );
    await database.exec('reset role');
    assert.deepEqual((await database.query('select description,status from beta_feedback')).rows, [
      { description: fields.description, status: 'resolved' },
    ]);
  } finally {
    await database.close();
  }
});

test('直接调用数据库函数仍受共享分钟及24小时上限约束，失败不留下半条反馈', async () => {
  const database = new PGlite();
  try {
    await database.exec('create role anon; create role authenticated;');
    await database.exec(
      await readFile(
        new URL('../supabase/migrations/202610230002_beta_feedback.sql', import.meta.url),
        'utf8',
      ),
    );
    await database.exec(
      "insert into beta_feedback(id,kind,description) select gen_random_uuid(),'使用问题','限流合成测试资料' from generate_series(1,20); set role anon;",
    );
    const submit = () =>
      database.query('select public.submit_beta_feedback($1,$2,$3,$4,$5,$6)', [
        crypto.randomUUID(),
        fields.kind,
        '',
        fields.description,
        '',
        '',
      ]);
    await assert.rejects(submit(), /feedback_rate_limited/u);
    await database.exec(
      "reset role; update beta_feedback set created_at=now()-interval '2 hours'; insert into beta_feedback(id,kind,description,created_at) select gen_random_uuid(),'使用问题','每日限流合成测试',now()-interval '2 hours' from generate_series(1,180); set role anon;",
    );
    await assert.rejects(submit(), /feedback_rate_limited/u);
    await database.exec('reset role');
    assert.equal(
      (await database.query('select count(*)::int as count from beta_feedback')).rows[0].count,
      200,
    );
  } finally {
    await database.close();
  }
});
