import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

type Redirect = {
  source: string;
  has: { type: string; value: string }[];
  destination: string;
  permanent: boolean;
};
const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const redirects: Redirect[] = config.redirects;
const outreach = redirects.filter((rule) => rule.destination === "https://pinehourai.com/verify");

test("PineHour outreach redirects match exactly the two root hostnames and are permanent", () => {
  assert.equal(outreach.length, 2);
  for (const host of ["hellopinehourai.com", "www.hellopinehourai.com"]) {
    const matching = outreach.filter((rule) =>
      rule.has.every(
        ({ type, value }) => type === "host" && new RegExp(`^(?:${value})$`).test(host),
      ),
    );
    assert.equal(matching.length, 1);
    const rule = matching[0]!;
    assert.equal(rule.source, "/");
    assert.equal(rule.permanent, true); // Vercel uses HTTP 308.
    assert.deepEqual(Object.keys(rule).sort(), ["destination", "has", "permanent", "source"]);
    assert.equal(rule.has.length, 1);
    // No destination query replaces the incoming parameters Vercel forwards.
    assert.equal(new URL(rule.destination).search, "");
  }
});

test("PineHour outreach rules do not redirect other hostnames or non-root paths", () => {
  const matches = (host: string, path: string) =>
    outreach.some(
      (rule) =>
        rule.source === path &&
        rule.has.every(
          ({ type, value }) => type === "host" && new RegExp(`^(?:${value})$`).test(host),
        ),
    );
  for (const host of [
    "pinehourai.com",
    "www.pinehourai.com",
    "trykotaai.com",
    "www.trykotaai.com",
    "hellokotaai.com",
    "www.hellokotaai.com",
    "preview.vercel.app",
    "hellopinehouraiXcom",
    "wwwXhellopinehouraiXcom",
    "hellopinehourai.com.evil.example",
    "nothellopinehourai.com",
    "extra.hellopinehourai.com",
  ]) {
    assert.equal(matches(host, "/"), false, host);
  }
  for (const host of ["hellopinehourai.com", "www.hellopinehourai.com", "pinehourai.com"]) {
    for (const path of ["/verify", "/verify/", "/contact", "/nested/path"]) {
      assert.equal(matches(host, path), false, `${host}${path}`);
    }
  }
});

test("the existing Kota outreach redirects remain unchanged alongside the two new rules", () => {
  const legacy = ["hellokotaai.com", "www.hellokotaai.com"].map((host) => ({
    source: "/(.*)",
    has: [{ type: "host", value: host }],
    destination: "https://trykotaai.com/verify",
    permanent: true,
  }));
  assert.equal(redirects.length, 4);
  assert.deepEqual(
    redirects.filter((rule) => !outreach.includes(rule)),
    legacy,
  );
});
