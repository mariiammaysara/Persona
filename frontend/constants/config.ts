const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return url.replace(/\/$/, "");
};

export const API_BASE_URL = getApiBaseUrl();

export const ENDPOINTS = {
  chat: `${API_BASE_URL}/api/v1/chat`,
} as const;

export const STORAGE_KEY = "persona_sessions";
export const STORAGE_VERSION = 1;
export const TOAST_DURATION_MS = 3000;
export const FOCUS_DELAY_MS = 100;
