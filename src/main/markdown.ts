import path from 'path'
import iconv from "iconv-lite";

export const LINE_ENDING_REG = /(?:\r\n|\n)/g;
export const LF_LINE_ENDING_REG = /(?:[^\r]\n)|(?:^\n$)/;
export const CRLF_LINE_ENDING_REG = /\r\n/;
const MARKDOWN_EXTENSIONS = Object.freeze([
  "markdown",
  "mdown",
  "mkdn",
  "md",
  "mkd",
  "mdwn",
  "mdtxt",
  "mdtext",
  "text",
  "txt",
]);


export const hasMarkdownExtension = (filename) => {
  if (!filename || typeof filename !== "string") return false;
  return MARKDOWN_EXTENSIONS.some((ext) =>
    filename.toLowerCase().endsWith(`.${ext}`)
  );
};