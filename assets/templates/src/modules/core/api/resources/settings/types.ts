export type AppSettings = {
  accentColor: string;
  locale: string;
  reducedMotion: boolean;
};

export type UpdateAppSettingsInput = Partial<AppSettings>;
