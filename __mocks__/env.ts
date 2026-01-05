export const envMock = {
  env: {
    // Server-side variables
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    OPEN_AI_API_KEY: "test-openai-key",
    GOOGLE_CLIENT_SECRET: "test-google-secret",
    AWS_S3_BUCKET_NAME: "test-bucket",
    AWS_S3_API_URL: "https://test.s3.amazonaws.com",
    AWS_ACCESS_KEY_ID: "test-access-key",
    AWS_SECRET_ACCESS_KEY_ID: "test-secret-key",
    R2_URL: "https://test.r2.cloudflarestorage.com",
    // Client-side variables
    PUBLIC_CLERK_PUBLISHABLE_KEY: "test-clerk-key",
    PUBLIC_GOOGLE_CLIENT_ID: "test-google-client-id",
  },
};
