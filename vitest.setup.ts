import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { authClientMock } from "./__mocks__/auth-client";
import { nextNavigationMock } from "./__mocks__/next-navigation";
import { storeResetFns } from "./__mocks__/zustand";

vi.mock("next/navigation", () => nextNavigationMock);

vi.mock("@/lib/auth-client", () => authClientMock);

afterEach(() => {
  cleanup();
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
});
