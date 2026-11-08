import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import worker from '../server/inquiry-retention-worker.mjs';
import {sendNotification} from '../server/inquiries.mjs';

test('scheduled cleanup deletes only inquiries at least 30 days old and stale rate-limit windows',async()=>{
  const db=new DatabaseSync(':memory:');
  try {
    for(const file of ['0001_inquiries.sql','0002_inquiry_retention.sql'])
      db.exec(readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
    const now=Date.parse('2026-11-08T00:17:00Z'), expiry=now-30*86_400_000;
    const insert=db.prepare("INSERT INTO inquiries (inquiry_id,submission_id,payload,created_at,next_retry_at) VALUES (?,?,'{}',?,?)");
    for(const [id,when] of [['older',expiry-1],['at-boundary',expiry],['still-active',expiry+1]]) {
      const iso=new Date(when).toISOString();insert.run(id,id,iso,iso);
    }
    const window=Math.floor(now/600_000);
    db.prepare("INSERT INTO inquiry_limits VALUES ('old', ?, 1), ('recent', ?, 1)").run(window-7,window-6);
    const binding={
      prepare(sql){return {bind(...args){return {sql,args};}};},
      async batch(statements){return statements.map(({sql,args})=>({success:true,meta:{changes:db.prepare(sql).run(...args).changes}}));},
    };
    await worker.scheduled({scheduledTime:now},{DB:binding});
    assert.deepEqual(db.prepare('SELECT inquiry_id FROM inquiries').all().map(r=>r.inquiry_id),['still-active']);
    assert.deepEqual(db.prepare('SELECT client_hash FROM inquiry_limits').all().map(r=>r.client_hash),['recent']);
    await worker.scheduled({scheduledTime:now},{DB:binding});
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM inquiries').get().n,1);
  } finally {db.close();}
});

test('notification sends the reference without receiving or serializing the inquiry payload',async()=>{
  let body;
  await sendNotification({RESEND_API_KEY:'fake',FROM_EMAIL:'sender@example.com',INQUIRY_EMAIL:'receiver@example.com'},'TB-example',async (_url,req)=>{
    body=JSON.parse(req.body);
    return new Response('{}');
  });
  assert.match(body.text,/Reference: TB-example/);
  assert.deepEqual(Object.keys(body).sort(),['from','subject','text','to']);
  assert.doesNotMatch(body.text,/payload|contactName|message|@/);
});
