export const SITE_NAME = "API Reference Directory";
export const SITE_DESCRIPTION =
  "A searchable, domain-organized directory of APIs — how to get a key, pricing, rate limits, and use cases.";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
