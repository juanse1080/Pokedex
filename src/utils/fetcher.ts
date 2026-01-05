const handleResponse = async (response: Response) => {
  if (response.headers.get("Content-Type")?.includes("application/json")) {
    const data = await response.json();
    return data;
  }

  const text = await response.text();
  return text;
};

export const fetcher = async <T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<T> => {
  const response = await fetch(input, init);
  const data = await handleResponse(response);

  if (!response.ok) throw new FetcherError(data.message, response.status, data);

  return data;
};

export class FetcherError extends Error {
  status: number;
  metadata?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    metadata?: Record<string, unknown>
  ) {
    super(message);
    this.status = status;
    this.metadata = metadata;
  }
}
