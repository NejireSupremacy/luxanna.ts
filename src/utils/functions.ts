const Strings = Object.freeze({
  BOLD: '**',
  CODEBLOCK: '```',
  CODESTRING: '`',
  CODESTRING_DOUBLE: '``',
  ESCAPE: '\\',
  ITALICS: '_',
  SPOILER: '||',
  STRIKE: '~~',
  UNDERLINE: '__'
});

export function codeBlock(text: string): string {
  return `${Strings.CODEBLOCK}\n${text}\n${Strings.CODEBLOCK}`;
}

export function codeString(text: string): string {
  return `${Strings.CODESTRING}${text}${Strings.CODESTRING}`;
}

export function codeStringDouble(text: string): string {
  return `${Strings.CODESTRING_DOUBLE}${text}${Strings.CODESTRING_DOUBLE}`;
}

export function bold(text: string): string {
  return `${Strings.BOLD}${text}${Strings.BOLD}`;
}

export function italic(text: string): string {
  return `${Strings.ITALICS}${text}${Strings.ITALICS}`;
}

export function underline(text: string): string {
  return `${Strings.UNDERLINE}${text}${Strings.UNDERLINE}`;
}

export function strike(text: string): string {
  return `${Strings.STRIKE}${text}${Strings.STRIKE}`;
}

export function spoiler(text: string): string {
  return `${Strings.SPOILER}${text}${Strings.SPOILER}`;
}
