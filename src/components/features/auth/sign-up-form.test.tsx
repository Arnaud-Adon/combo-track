import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { frMessages } from "@/i18n/messages";

// Mock upload avatar action
vi.mock("@/lib/actions/upload-avatar", () => ({
  uploadAvatarAction: vi.fn(),
}));

import { SignUpForm } from "./sign-up-form";

describe("SignUpForm", () => {
  it("should render the form", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={frMessages}>
        <SignUpForm />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Créer un compte")).toBeInTheDocument();
  });
});
