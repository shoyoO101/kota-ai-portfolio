import assert from "node:assert/strict";
import { test } from "node:test";
import { prepareContactSubmission } from "../src/lib/contact-message.ts";

test("new contact details reach the existing three-field delivery contract", () => {
  const result = prepareContactSubmission({
    name: " Test ",
    email: "test@example.com",
    message: " Connect my booking tools. ",
    company: " Example ",
    projectType: "Integration",
  });
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.deepEqual(result.data, {
    name: "Test",
    email: "test@example.com",
    message: "Connect my booking tools.\n\nCompany: Example\n\nProject type: Integration",
  });
});

test("optional details cannot bypass required message validation or the delivery limit", () => {
  const base = {
    name: "Test",
    email: "test@example.com",
    company: "Example",
    projectType: "Integration",
  };
  assert.equal(prepareContactSubmission({ ...base, message: " " }).success, false);
  assert.equal(prepareContactSubmission({ ...base, message: "x".repeat(5000) }).success, false);
  const result = prepareContactSubmission({
    ...base,
    company: "",
    projectType: "unexpected",
    message: "A task",
  });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.message, "A task\n\nProject type: Not sure yet");
});
