export class AppError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    message: string,
    opts: { status: number; code: string; details?: unknown }
  ) {
    super(message);
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
  }
}

export function isAppError(e: unknown): e is AppError {
  return (
    typeof e === "object" &&
    e !== null &&
    "status" in e &&
    "code" in e &&
    typeof (e as any).status === "number"
  );
}

export const Errors = {
  unauthorized: (message = "Unauthorized") =>
    new AppError(message, { status: 401, code: "UNAUTHORIZED" }),
  forbidden: (message = "Forbidden") =>
    new AppError(message, { status: 403, code: "FORBIDDEN" }),
  badRequest: (message = "Bad request", details?: unknown) =>
    new AppError(message, { status: 400, code: "BAD_REQUEST", details }),
  notFound: (message = "Not found") =>
    new AppError(message, { status: 404, code: "NOT_FOUND" }),
  conflict: (message = "Conflict") =>
    new AppError(message, { status: 409, code: "CONFLICT" }),
  tooManyRequests: (message = "Too many requests") =>
    new AppError(message, { status: 429, code: "TOO_MANY_REQUESTS" })
};

