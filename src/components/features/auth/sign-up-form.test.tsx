import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock auth client
vi.mock("@/lib/auth-client", () => ({
  signUp: {
    email: vi.fn(),
  },
  useSession: vi.fn(() => ({
    data: null,
    isPending: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

// Mock upload avatar action
vi.mock("@/lib/actions/upload-avatar", () => ({
  uploadAvatarAction: vi.fn(),
}));

import { SignUpForm } from "./sign-up-form";

describe("SignUpForm", () => {
  it("should render the form", () => {
    render(<SignUpForm />);
    expect(screen.getByText("Créer un compte")).toBeInTheDocument();
  });
});
