import { ENDPOINTS } from "@/constants/config";
import { ChatRequest } from "@/types/chat";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: any
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

export async function streamChat(
  request: ChatRequest,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(ENDPOINTS.chat, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }
    
    const error = new ApiError(response.status, response.statusText, errorBody);
    console.error("[API_FAILURE]", {
      url: ENDPOINTS.chat,
      status: response.status,
      body: errorBody
    });
    throw error;
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}
