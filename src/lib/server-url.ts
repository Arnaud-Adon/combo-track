export const getServerUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;

  if (process.env.PLAYWRIGHT_TEST_BASE_URL)
    return process.env.PLAYWRIGHT_TEST_BASE_URL;

  if (process.env.VERCEL_ENV === "production")
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
};
