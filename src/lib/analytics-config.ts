// Public tracker settings, not credentials. No analytics runs on preview domains.
export const ANALYTICS = {
  scriptUrl: "https://cloud.umami.is/script.js",
  websiteId: "c6bd0ec2-8eb9-48fc-9d83-0c790acd4bc6",
  domain: "pinehourai.com",
  domains: ["pinehourai.com", "www.pinehourai.com", "trykotaai.com", "www.trykotaai.com"],
} as const;
