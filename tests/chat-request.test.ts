import assert from "node:assert/strict";
import { test } from "node:test";
import { runChatRequest, CHAT_TIMEOUT_MS } from "../src/lib/chat-request.ts";
import { getChatSnapshot, getSessionId } from "../src/lib/chat-session.ts";
import { CHAT_COPY } from "../src/lib/chat-response.ts";

test("request transport preserves the n8n contract and owns one shared pending operation", async () => {
  const key = "request-contract";
  let resolve!: (reply: { ok: boolean; status: number; body: string }) => void;
  const operation = runChatRequest(
    " A question ",
    async (data, signal) => {
      assert.deepEqual(data, {
        message: "A question",
        chatInput: "A question",
        action: "sendMessage",
        sessionId: getSessionId(key),
      });
      assert.equal(signal.aborted, false);
      return new Promise((done) => {
        resolve = done;
      });
    },
    key,
  );
  await Promise.resolve();
  assert.equal(getChatSnapshot(key).pending, true);
  assert.equal(typeof getChatSnapshot(key).pendingSince, "number");
  assert.equal(
    await runChatRequest(
      "Duplicate",
      async () => {
        throw new Error("Must not send");
      },
      key,
    ),
    false,
  );
  resolve({ ok: true, status: 200, body: '{"output":"An answer"}' });
  await operation;
  assert.equal(getChatSnapshot(key).pending, false);
  assert.equal(getChatSnapshot(key).pendingSince, null);
  assert.equal(getChatSnapshot(key).messages.at(-1)?.text, "An answer");
});

test("network rejection becomes a friendly assistant error and unlocks retry", async () => {
  const key = "request-failure";
  await runChatRequest(
    "Question",
    async () => {
      throw new Error("Private network details");
    },
    key,
  );
  assert.equal(getChatSnapshot(key).pending, false);
  assert.equal(getChatSnapshot(key).messages.at(-1)?.text, CHAT_COPY.failure);
  assert.equal(getChatSnapshot(key).messages.at(-1)?.error, true);
  await runChatRequest("Retry", async () => ({ ok: true, status: 200, body: "It worked" }), key);
  assert.equal(getChatSnapshot(key).messages.at(-1)?.text, "It worked");
});

test("30-second deadline unlocks retry, aborts transport and ignores a late answer", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 1000 });
  const key = "request-deadline";
  let resolveLate!: (reply: { ok: boolean; status: number; body: string }) => void;
  let requestSignal!: AbortSignal;
  const operation = runChatRequest(
    "Slow question",
    async (_, signal) => {
      requestSignal = signal;
      return new Promise((done) => {
        resolveLate = done;
      });
    },
    key,
  );
  await Promise.resolve();
  t.mock.timers.tick(CHAT_TIMEOUT_MS - 1);
  assert.equal(getChatSnapshot(key).pending, true);
  t.mock.timers.tick(1);
  await operation;
  assert.equal(requestSignal.aborted, true);
  assert.equal(getChatSnapshot(key).pending, false);
  assert.equal(getChatSnapshot(key).messages.at(-1)?.text, CHAT_COPY.failure);
  await runChatRequest("Retry", async () => ({ ok: true, status: 200, body: "New answer" }), key);
  resolveLate({ ok: true, status: 200, body: "Late old answer" });
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(getChatSnapshot(key).messages.length, 4);
  assert.equal(getChatSnapshot(key).messages.at(-1)?.text, "New answer");
});

test("a completed reply clears its deadline so no later timeout is appended", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
  const key = "request-cleared-deadline";
  await runChatRequest("Question", async () => ({ ok: true, status: 200, body: "Answer" }), key);
  t.mock.timers.tick(CHAT_TIMEOUT_MS + 1);
  await Promise.resolve();
  assert.equal(getChatSnapshot(key).messages.length, 2);
  assert.equal(getChatSnapshot(key).messages.at(-1)?.text, "Answer");
});

test("elapsed time rejects an overdue answer even when a background tab delays its timer", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 1000 });
  const key = "request-throttled-timer";
  let resolve!: (reply: { ok: boolean; status: number; body: string }) => void;
  const operation = runChatRequest(
    "Question",
    async () =>
      new Promise((done) => {
        resolve = done;
      }),
    key,
  );
  await Promise.resolve();
  t.mock.timers.setTime(1000 + CHAT_TIMEOUT_MS + 1);
  resolve({ ok: true, status: 200, body: "Overdue answer" });
  await operation;
  assert.equal(getChatSnapshot(key).pending, false);
  assert.equal(getChatSnapshot(key).messages.at(-1)?.text, CHAT_COPY.failure);
});
