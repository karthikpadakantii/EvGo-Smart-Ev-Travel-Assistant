export const isRequired = (value: string) => value.trim().length > 0;

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isPositiveNumber = (value: string) => {
  const n = Number(value);
  return !Number.isNaN(n) && n > 0;
};

export const minLength = (value: string, len: number) => value.length >= len;
