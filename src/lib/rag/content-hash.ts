import { createHash } from "node:crypto";

export function hashContent(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}
