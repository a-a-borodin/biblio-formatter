export const TAG_TYPES = {
  TEXT: "text",
  SOURCE: "source",
  MISSING: "missing",
};

const TAG_REGEX = /(<@>[\s\S]*?<@\/>|<\?>[\s\S]*?<\?\/?>)/g;

export const parseTags = (text) => {
  if (!text) return [];

  return text
    .split(TAG_REGEX)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("<@>")) {
        return { type: TAG_TYPES.SOURCE, content: part.replace(/<@\/?>/g, "") };
      }
      if (part.startsWith("<?>")) {
        return {
          type: TAG_TYPES.MISSING,
          content: part.replace(/<\?\/?>/g, ""),
        };
      }
      return { type: TAG_TYPES.TEXT, content: part };
    });
};

export const countTags = (text) => ({
  sourceTypes: (text.match(/<@>/g) || []).length,
  missing: (text.match(/<\?>/g) || []).length,
});


