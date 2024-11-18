const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const gameApi = {
  create: async () => {
    const response = await fetch(`${API_URL}/games`, {
      method: "POST",
    });
    return response.json();
  },

  get: async (gameId: string) => {
    const response = await fetch(`${API_URL}/games/${gameId}`);
    return response.json();
  },
};
