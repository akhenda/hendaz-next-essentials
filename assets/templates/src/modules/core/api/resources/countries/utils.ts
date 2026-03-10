export type RESTCountriesApiErrorResponse = {
  message: string;
  status: number;
};

export const countriesQueryKeys = {
  all: () => ["countries"] as const,
  africa: () => ["countries", "africa"] as const,
};
