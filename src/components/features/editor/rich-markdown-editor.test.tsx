import { describe, expect, it } from "vitest";
import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";

import { renderWithIntl } from "@/test/render-with-intl";
import { RichMarkdownEditor } from "./rich-markdown-editor";

function Harness({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <RichMarkdownEditor
      value={value}
      onChange={setValue}
      maxLength={2000}
      ariaLabel="Note"
    />
  );
}

describe("RichMarkdownEditor", () => {
  it("renders an accessible formatting toolbar", () => {
    renderWithIntl(<Harness />);
    expect(
      screen.getByRole("toolbar", { name: "Mise en forme du texte" }),
    ).toBeInTheDocument();
  });

  it("wraps the current selection when clicking bold", () => {
    renderWithIntl(<Harness initial="abc" />);
    const textarea = screen.getByLabelText("Note") as HTMLTextAreaElement;
    textarea.setSelectionRange(0, 3);

    fireEvent.click(screen.getByRole("button", { name: "Gras" }));

    expect(textarea.value).toBe("**abc**");
  });

  it("shows the character counter", () => {
    renderWithIntl(<Harness initial="hello" />);
    expect(screen.getByText("5 / 2000")).toBeInTheDocument();
  });

  it("renders markdown in preview mode and hides the textarea", () => {
    renderWithIntl(<Harness initial="**bold**" />);

    fireEvent.click(screen.getByRole("button", { name: "Aperçu" }));

    expect(screen.getByText("bold").tagName).toBe("STRONG");
    expect(screen.queryByLabelText("Note")).not.toBeInTheDocument();
  });
});
