const MAX_LENGTH = 5000;

export const validateFormatInput = (body) => {
  const text = body?.text;
  if (typeof text !== "string" || text.trim().length === 0) {
    const err = new Error("Список источников не может быть пустым");
    err.status = 400;
    throw err;
  }
  if (text.length > MAX_LENGTH) {
    const err = new Error(
      `Превышен лимит: максимум ${MAX_LENGTH} символов, получено ${text.length}`,
    );
    err.status = 400;
    throw err;
  }
  return { text };
};
