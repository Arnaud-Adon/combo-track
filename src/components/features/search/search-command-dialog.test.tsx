import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { frMessages } from "@/i18n/messages";

vi.mock("next-safe-action/hooks", () => ({
  useAction: () => ({
    execute: vi.fn(),
    result: { data: undefined, serverError: undefined },
    isPending: false,
  }),
}));

vi.mock("./semantic-search-action", () => ({
  semanticSearchAction: vi.fn(),
}));

import { useSearchDialogStore } from "@/stores/search-dialog";
import { SearchCommandDialog } from "./search-command-dialog";
import { SearchTriggerButton } from "./search-trigger-button";

function renderWithIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="fr" messages={frMessages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useSearchDialogStore.setState({ open: false });
});

describe("SearchCommandDialog", () => {
  it("opens dialog on trigger button click", async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <>
        <SearchTriggerButton />
        <SearchCommandDialog />
      </>,
    );
    await user.click(
      screen.getByRole("button", { name: /ouvrir la recherche/i }),
    );
    expect(
      screen.getByRole("dialog", { name: /recherche sémantique/i }),
    ).toBeInTheDocument();
  });

  it("opens dialog on Cmd+K shortcut", () => {
    renderWithIntl(<SearchCommandDialog />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(
      screen.getByRole("dialog", { name: /recherche sémantique/i }),
    ).toBeInTheDocument();
  });

  it("opens dialog on Ctrl+K shortcut", () => {
    renderWithIntl(<SearchCommandDialog />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(
      screen.getByRole("dialog", { name: /recherche sémantique/i }),
    ).toBeInTheDocument();
  });
});
