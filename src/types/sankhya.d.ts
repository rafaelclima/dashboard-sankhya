declare function executeQuery(
  query: string | object | [] | undefined,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  parameters: any[],
  onSuccess: (response: string) => void,
  onError: (error: string) => void,
): void
