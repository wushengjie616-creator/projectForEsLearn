export const DEEPSEEK_TOP_UP_URL = "https://platform.deepseek.com/top_up";
export const DEEPSEEK_INSUFFICIENT_BALANCE_CODE = "deepseek_insufficient_balance";

export class DeepSeekHttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`DeepSeek request failed with status ${status}`);
    this.name = "DeepSeekHttpError";
    this.status = status;
  }
}

export function ensureDeepSeekResponseOk(response: Response) {
  if (!response.ok) throw new DeepSeekHttpError(response.status);
}

export function deepSeekFailureResponse(
  error: unknown,
  messages: { timeout: string; fallback: string },
): Response {
  if (error instanceof DeepSeekHttpError && error.status === 402) {
    return Response.json(
      {
        error:
          "DeepSeek API 余额不足。平台账户管理员充值后即可恢复 AI 功能；若你不是管理员，请联系管理员。",
        code: DEEPSEEK_INSUFFICIENT_BALANCE_CODE,
        rechargeUrl: DEEPSEEK_TOP_UP_URL,
      },
      { status: 402, headers: { "cache-control": "no-store" } },
    );
  }
  if (error instanceof Error && error.name === "AbortError") {
    return Response.json(
      { error: messages.timeout },
      { status: 504, headers: { "cache-control": "no-store" } },
    );
  }
  return Response.json(
    { error: messages.fallback },
    { status: 502, headers: { "cache-control": "no-store" } },
  );
}
