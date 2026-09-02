export const SITE_NAME = "Shana";
export const SITE_DESCRIPTION =
  "Shana is a searchable, domain-organized directory of APIs — how to get a key, pricing, rate limits, and use cases.";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
