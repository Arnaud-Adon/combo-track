type InsertNotationOptions = {
  cursorOffset?: number;
  closeZone?: boolean;
  maxLength: number;
};

type InsertNotationResult = {
  value: string;
  cursor: number;
};

function isInsideInlineCode(before: string): boolean {
  const line = before.slice(before.lastIndexOf("\n") + 1);
  let backticks = 0;
  for (const char of line) {
    if (char === "`") backticks += 1;
  }
  return backticks % 2 === 1;
}

export function insertNotationToken(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  token: string,
  options: InsertNotationOptions,
): InsertNotationResult {
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const inside = isInsideInlineCode(before);

  if (options.closeZone) {
    let head: string;
    let tail: string;

    if (inside) {
      const closeIndex = after.indexOf("`");
      if (closeIndex !== -1) {
        head = before + token + after.slice(0, closeIndex + 1) + " ";
        tail = after.slice(closeIndex + 1);
      } else {
        head = before + token + "` ";
        tail = after;
      }
    } else {
      head = before + `\`${token}\` `;
      tail = after;
    }

    const nextValue = (head + tail).slice(0, options.maxLength);
    return {
      value: nextValue,
      cursor: Math.min(head.length, nextValue.length),
    };
  }

  const insertText = inside ? token : `\`${token}\``;
  const wrapOpen = inside ? 0 : 1;

  const nextValue = (before + insertText + after).slice(0, options.maxLength);
  const offset = options.cursorOffset ?? token.length;
  const cursor = Math.min(selectionStart + wrapOpen + offset, nextValue.length);

  return { value: nextValue, cursor };
}
