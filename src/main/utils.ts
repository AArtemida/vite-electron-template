import { app } from "electron";
export const getPath = (name) => {
  return app.getPath(name);
};

export const getRecommendTitleFromMarkdownString = (markdown) => {
  // NOTE: We should read the title from the renderer cache because this regex matches in
  // code blocks too.
  const tokens = markdown.match(/#{1,6} {1,}(.*\S.*)(?:\n|$)/g);
  if (!tokens) return "";
  const headers = tokens.map((t) => {
    const matches = t.trim().match(/(#{1,6}) {1,}(.+)/);
    return {
      level: matches[1].length,
      content: matches[2].trim(),
    };
  });
  return headers.sort((a, b) => a.level - b.level)[0].content;
};
