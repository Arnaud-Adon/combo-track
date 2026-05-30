import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { SearchCommandDialog } from "./search-command-dialog";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SearchCommandDialog", () => {
  it("renders trigger button", () => {
    render(<SearchCommandDialog />);
    expect(
      screen.getByRole("button", { name: /ouvrir la recherche/i }),
    ).toBeInTheDocument();
  });

  it("opens dialog on trigger click", async () => {
    const user = userEvent.setup();
    render(<SearchCommandDialog />);
    await user.click(
      screen.getByRole("button", { name: /ouvrir la recherche/i }),
    );
    expect(
      screen.getByRole("dialog", { name: /recherche sémantique/i }),
    ).toBeInTheDocument();
  });

  it("opens dialog on Cmd+K shortcut", () => {
    render(<SearchCommandDialog />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(
      screen.getByRole("dialog", { name: /recherche sémantique/i }),
    ).toBeInTheDocument();
  });

  it("opens dialog on Ctrl+K shortcut", () => {
    render(<SearchCommandDialog />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(
      screen.getByRole("dialog", { name: /recherche sémantique/i }),
    ).toBeInTheDocument();
  });
});
