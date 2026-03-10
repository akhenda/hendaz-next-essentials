export const settingsQueryKeys = {
  all: () => ["settings"] as const,
  app: () => ["settings", "app"] as const,
};
