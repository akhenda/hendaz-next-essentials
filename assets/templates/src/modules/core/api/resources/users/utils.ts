export const usersQueryKeys = {
  all: () => ["users"] as const,
  current: () => ["users", "current"] as const,
  summaries: () => ["users", "summaries"] as const,
};
