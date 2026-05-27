export type TerminalTextParts = {
  readonly key: string;
  readonly value: string;
};

export function parseTerminalText(text: string): TerminalTextParts | null {
  const match = text.match(/^(\S+)\s{2,}(.+)$/);

  if (!match) {
    return null;
  }

  return {
    key: match[1],
    value: match[2],
  };
}
