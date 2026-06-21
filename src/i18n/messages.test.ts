import { describe, expect, it } from "vitest";

import { frMessages } from "./messages";

describe("fr message catalog", () => {
  it("exposes the seeded namespaces", () => {
    expect(Object.keys(frMessages)).toEqual(
      expect.arrayContaining(["common", "meta"]),
    );
  });

  it("provides shared button labels", () => {
    expect(frMessages.common.buttons.save).toBe("Enregistrer");
  });

  it("provides the root metadata strings", () => {
    expect(frMessages.meta.app.title).toMatch(/ComboTrack/);
    expect(frMessages.meta.app.description.length).toBeGreaterThan(0);
  });
});
