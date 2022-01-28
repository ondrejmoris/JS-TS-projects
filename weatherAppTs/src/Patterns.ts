export const citySchema = {
  properties: {
    city: {
      pattern: /^[a-zA-Z\s-]+$/,
      message: "City must be only letters, spaces, or dashes!",
      required: true,
    },
  },
};

export const typeSchema = {
  properties: {
    type: {
      pattern: /^[c+h-]+$/,
      message: 'Type must be only "c" as current or "h" as history!',
      required: true,
    },
  },
};

export const dateSchema = {
  properties: {
    date: {
      pattern: /^[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/,
      message: "Type must be date in YYYY-MM-DD",
      required: true,
    },
  },
};
