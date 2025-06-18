export const DEFAULT_PAGINATION_LIMIT = 10; // Default limit for pagination
export const MAX_PINNED_NOTES = 10;
export const MAX_LABELS_PER_USER = 20;
export const MAX_LABELS_PER_NOTE = 5;

export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
];
