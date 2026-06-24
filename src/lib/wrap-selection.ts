type SelectionOptions = {
  maxLength?: number;
};

export type SelectionResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

function clampSelection(
  value: string,
  start: number,
  end: number,
): SelectionResult {
  const length = value.length;
  return {
    value,
    selectionStart: Math.min(start, length),
    selectionEnd: Math.min(end, length),
  };
}

export function wrapSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  before: string,
  after: string,
  options: SelectionOptions = {},
): SelectionResult {
  const head = value.slice(0, selectionStart);
  const selected = value.slice(selectionStart, selectionEnd);
  const tail = value.slice(selectionEnd);

  const nextValue = (head + before + selected + after + tail).slice(
    0,
    options.maxLength,
  );

  return clampSelection(
    nextValue,
    selectionStart + before.length,
    selectionStart + before.length + selected.length,
  );
}

export function replaceSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  replacement: string,
  options: SelectionOptions = {},
): SelectionResult {
  const head = value.slice(0, selectionStart);
  const tail = value.slice(selectionEnd);

  const nextValue = (head + replacement + tail).slice(0, options.maxLength);

  return clampSelection(
    nextValue,
    selectionStart + replacement.length,
    selectionStart + replacement.length,
  );
}

export function prefixLines(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  prefix: string | ((index: number) => string),
  options: SelectionOptions = {},
): SelectionResult {
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const newlineAfter = value.indexOf("\n", selectionEnd);
  const lineEnd = newlineAfter === -1 ? value.length : newlineAfter;

  const head = value.slice(0, lineStart);
  const block = value.slice(lineStart, lineEnd);
  const tail = value.slice(lineEnd);

  const resolvePrefix = (index: number) =>
    typeof prefix === "function" ? prefix(index) : prefix;

  const nextBlock = block
    .split("\n")
    .map((line, index) => `${resolvePrefix(index)}${line}`)
    .join("\n");

  const nextValue = (head + nextBlock + tail).slice(0, options.maxLength);

  return clampSelection(nextValue, lineStart, lineStart + nextBlock.length);
}
