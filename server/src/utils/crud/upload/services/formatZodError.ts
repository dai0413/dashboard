import { ZodError } from "zod";

export function formatZodError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join(", ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "unknown error";
}
