import { vi } from "vitest";

export const headers = vi.fn(() => ({
  get: vi.fn((key: string) => {
    if (key === "user-agent") return "test-agent";
    if (key === "content-type") return "application/json";
    return null;
  }),
}));

export const cookies = vi.fn(() => ({
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}));
