import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { frMessages } from "@/i18n/messages";

const executeMock = vi.fn();
const useActionMock = vi.fn(() => ({
  execute: executeMock,
  result: { data: undefined, serverError: undefined },
  isPending: false,
}));

vi.mock("next-safe-action/hooks", () => ({
  useAction: () => useActionMock(),
}));

vi.mock("./semantic-search-action", () => ({
  semanticSearchAction: vi.fn(),
}));

import { SemanticSearchBar } from "./semantic-search-bar";

function renderWithIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="fr" messages={frMessages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

beforeEach(() => {
  executeMock.mockClear();
  useActionMock.mockClear();
});

describe("SemanticSearchBar", () => {
  it("renders search input", () => {
    renderWithIntl(<SemanticSearchBar />);
    expect(screen.getByLabelText(/recherche sémantique/i)).toBeInTheDocument();
  });

  it("triggers debounced action for valid query", async () => {
    renderWithIntl(<SemanticSearchBar />);

    const input = screen.getByLabelText(/recherche sémantique/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: "punish" } });
    });

    await waitFor(
      () => {
        expect(executeMock).toHaveBeenCalledWith({
          query: "punish",
          scope: "all",
          limit: 10,
        });
      },
      { timeout: 1000 },
    );
  });

  it("does not trigger for query shorter than 2 chars", async () => {
    renderWithIntl(<SemanticSearchBar />);

    const input = screen.getByLabelText(/recherche sémantique/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: "p" } });
    });

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(executeMock).not.toHaveBeenCalled();
  });
});
