import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

beforeEach(() => {
  executeMock.mockClear();
  useActionMock.mockClear();
});

describe("SemanticSearchBar", () => {
  it("renders search input", () => {
    render(<SemanticSearchBar />);
    expect(screen.getByLabelText(/recherche sémantique/i)).toBeInTheDocument();
  });

  it("triggers debounced action for valid query", async () => {
    render(<SemanticSearchBar />);

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
    render(<SemanticSearchBar />);

    const input = screen.getByLabelText(/recherche sémantique/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: "p" } });
    });

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(executeMock).not.toHaveBeenCalled();
  });
});
