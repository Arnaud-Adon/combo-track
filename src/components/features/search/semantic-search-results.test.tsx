import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SemanticSearchResults } from "./semantic-search-results";

describe("SemanticSearchResults", () => {
  it("prompts when query too short", () => {
    render(
      <SemanticSearchResults
        query=""
        isPending={false}
        notes={[]}
        glossary={[]}
      />,
    );
    expect(screen.getByText(/au moins 2 caractères/i)).toBeInTheDocument();
  });

  it("shows pending state", () => {
    render(
      <SemanticSearchResults
        query="punish"
        isPending
        notes={[]}
        glossary={[]}
      />,
    );
    expect(screen.getByText(/recherche en cours/i)).toBeInTheDocument();
  });

  it("renders notes and glossary results", () => {
    render(
      <SemanticSearchResults
        query="punish"
        isPending={false}
        notes={[
          {
            id: "n1",
            matchId: "m1",
            matchTitle: "Ranked vs Ken",
            timestamp: 42,
            content: "punish DP whiff",
            similarity: 0.87,
          },
        ]}
        glossary={[
          {
            id: "a1",
            slug: "punish",
            title: "Punish",
            excerpt: "Reaction to a recovery frame",
            category: "Neutral",
            similarity: 0.91,
          },
        ]}
      />,
    );

    expect(screen.getByText("punish DP whiff")).toBeInTheDocument();
    expect(screen.getByText("Punish")).toBeInTheDocument();
    expect(screen.getByText("87%")).toBeInTheDocument();
    expect(screen.getByText("91%")).toBeInTheDocument();
  });

  it("shows empty state when no results", () => {
    render(
      <SemanticSearchResults
        query="nothing"
        isPending={false}
        notes={[]}
        glossary={[]}
      />,
    );
    expect(screen.getByText(/aucun résultat/i)).toBeInTheDocument();
  });
});
