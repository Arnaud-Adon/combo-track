import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithIntl } from "@/test/render-with-intl";

// Mock upload avatar action
vi.mock("@/lib/actions/upload-avatar", () => ({
  uploadAvatarAction: vi.fn(),
}));

import { SignUpForm } from "./sign-up-form";

describe("SignUpForm", () => {
  it("should render the form", () => {
    renderWithIntl(<SignUpForm />);
    expect(screen.getByText("Créer un compte")).toBeInTheDocument();
  });
});
