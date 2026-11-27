import { Chef } from '../types';

export const TEXT_LIMITS = {
  USER_NAME: 60,
  BRAND_NAME: 80,
  PHONE: 25,
  CHEF_BIO: 400,
  ADDRESS_STREET: 120,
  ADDRESS_CITY: 80,
  ADDRESS_ZIP: 5,
  ORDER_NOTE: 250,
  CHAT_MESSAGE: 500,
  REVIEW_COMMENT: 250,
  DISH_NAME: 80,
  DISH_DESC: 300,
  DISH_PREP: 250,
  DISH_TAGS: 120,
  DISH_INGREDIENTS: 250,
} as const;

const CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const ANGLE_BRACKETS_RE = /[<>]/g;

/**
 * Live input sanitizer suitable for controlled onChange handlers.
 * Removes control characters and angle brackets while preserving spaces while typing.
 */
export const sanitizeInputLive = (value: unknown, maxLen: number): string => {
  const str = typeof value === 'string' ? value : String(value ?? '');
  return str
    .replace(CONTROL_CHARS_RE, '')
    .replace(ANGLE_BRACKETS_RE, '')
    .slice(0, maxLen);
};

/**
 * Full text sanitizer for submission and persistence.
 * Removes unsafe characters, trims whitespace, and clamps strictly to maxLen.
 */
export const sanitizeText = (value: unknown, maxLen: number): string =>
  sanitizeInputLive(value, maxLen * 2)
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLen);

/**
 * Strips private credentials before exposing Chef data to public views or catalog state.
 */
export const stripSensitiveChefFields = (chef: Chef): Chef => {
  const { password: _removedPassword, ...safeChef } = chef;
  return safeChef as Chef;
};
