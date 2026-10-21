import test from 'node:test';
import assert from 'node:assert/strict';
import { matchTopics } from '../src/data/topics.ts';
import { matchHotTopic } from '../src/data/hotTopics.ts';

test('自动话题沿用两次命中阈值，支持重复词和大小写', () => {
  assert.ok(!matchTopics('AI').includes('科技与AI'));
  assert.ok(matchTopics('ai AI').includes('科技与AI'));
  assert.ok(matchTopics('教育与学生').includes('教育与成长'));
});
test('手动话题全名优先于其他话题的交叉关键词', () => {
  assert.equal(matchHotTopic(['科技伦理', '人工智能'])?.id, 'tech-ethics');
  assert.equal(matchHotTopic(['']) , null);
});
