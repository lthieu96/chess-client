export interface BoardSettings {
  theme: string;
  showCoordinates: boolean;
}

const BOARD_SETTINGS_KEY = "board_settings";

const defaultSettings: BoardSettings = {
  theme: "classic",
  showCoordinates: true,
};

export const getBoardSettings = (): BoardSettings => {
  if (typeof window === "undefined") return defaultSettings;

  const settings = localStorage.getItem(BOARD_SETTINGS_KEY);
  if (!settings) return defaultSettings;

  try {
    return JSON.parse(settings);
  } catch {
    return defaultSettings;
  }
};

export const saveBoardSettings = (settings: BoardSettings): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOARD_SETTINGS_KEY, JSON.stringify(settings));
};
