import assert from "node:assert/strict";
import { test } from "node:test";
import { CHAT_COPY, extractReply, interpretChatResponse } from "../src/lib/chat-response.ts";
import {
  beginChatMessage,
  finishChatMessage,
  getChatSnapshot,
  getSessionId,
} from "../src/lib/chat-session.ts";
import { contactSchema } from "../src/lib/contact-schema.ts";

test("understands n8n response formats without accepting empty or unreadable bodies", () => {
  for (const key of ["output", "text", "message", "reply", "answer"]) {
    assert.equal(extractReply([{ [key]: "A store answer" }]), "A store answer");
  }
  assert.equal(extractReply(" Plain reply "), "Plain reply");
  assert.equal(extractReply([{}, { output: "Second result" }]), "Second result");
  assert.equal(extractReply({ output: "  " }), null);
  for (const body of ["", "{}", "[]", "<html>Gateway error</html>"]) {
    assert.deepEqual(interpretChatResponse({ ok: true, status: 200, body }), {
      text: CHAT_COPY.failure,
      error: true,
    });
  }
});

test("never displays failed HTTP bodies as assistant answers", () => {
  assert.deepEqual(
    interpretChatResponse({ ok: false, status: 429, body: "Internal quota details" }),
    { text: CHAT_COPY.rateLimit, error: true },
  );
  assert.deepEqual(
    interpretChatResponse({
      ok: false,
      status: 500,
      body: '{"output":"Sensitive upstream details"}',
    }),
    { text: CHAT_COPY.failure, error: true },
  );
  assert.deepEqual(interpretChatResponse({ ok: false, status: 503, body: "" }), {
    text: CHAT_COPY.failure,
    error: true,
  });
  assert.deepEqual(
    interpretChatResponse({ ok: true, status: 200, body: '[{"output":"**Store answer**"}]' }),
    { text: "**Store answer**", error: false },
  );
});

test("one session preserves context and prevents concurrent sends across presentations", () => {
  const key = "shared-panel-test";
  const id = getSessionId(key);
  assert.ok(beginChatMessage("Question", key));
  assert.equal(beginChatMessage("Duplicate from another panel", key), false);
  assert.equal(getChatSnapshot(key).messages.length, 1);
  assert.equal(getChatSnapshot(key).pending, true);
  finishChatMessage("Answer", false, key);
  assert.equal(getSessionId(key), id);
  assert.equal(getChatSnapshot(key).messages.length, 2);
  assert.equal(getChatSnapshot(key).pending, false);
  assert.ok(beginChatMessage("Follow-up", key));
  finishChatMessage(CHAT_COPY.rateLimit, true, key);
  assert.equal(getChatSnapshot(key).messages.length, 4);
  assert.equal(getChatSnapshot(key).messages.at(-1)?.error, true);
  assert.notEqual(getSessionId("another-tab-simulation"), id);
});

test("contact validation rejects blanks and oversized fields and preserves the backend fields", () => {
  assert.equal(contactSchema.safeParse({ name: " ", email: "bad", message: " " }).success, false);
  for (const [field, value] of [
    ["name", "x".repeat(121)],
    ["email", `${"x".repeat(200)}@example.com`],
    ["message", "x".repeat(5001)],
  ]) {
    assert.equal(
      contactSchema.safeParse({
        name: "Test",
        email: "test@example.com",
        message: "Test only",
        [field!]: value,
      }).success,
      false,
    );
  }
  assert.deepEqual(
    contactSchema.parse({ name: " Test ", email: "test@example.com", message: " Test only " }),
    { name: "Test", email: "test@example.com", message: "Test only" },
  );
});
