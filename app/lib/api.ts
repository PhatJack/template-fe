import axios from "axios";
import { z } from "zod";
import { apiErrorResponseSchema } from "~/services";

const DEFAULT_API_BASE_URL = "http://localhost:3000/api/v1";
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
const apiSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.unknown(),
  message: z.string().optional(),
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ApiServiceError";
  }
}

function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Unexpected API request failure";
  }

  const parsedError = apiErrorResponseSchema.safeParse(error.response?.data);

  return parsedError.success && parsedError.data.message
    ? parsedError.data.message
    : error.message;
}

export async function requestData<TSchema extends z.ZodType>(
  request: Promise<{ data: unknown }>,
  schema: TSchema,
): Promise<z.infer<TSchema>> {
  try {
    const response = await request;
    const envelope = apiSuccessResponseSchema.safeParse(response.data);

    if (!envelope.success) {
      throw new ApiServiceError("API response validation failed", envelope.error);
    }

    const parsedData = schema.safeParse(envelope.data.data);

    if (!parsedData.success) {
      throw new ApiServiceError("API response data validation failed", parsedData.error);
    }

    return parsedData.data;
  } catch (error) {
    if (error instanceof ApiServiceError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      throw new ApiServiceError(getApiErrorMessage(error), error);
    }

    throw new ApiServiceError("Unexpected API request failure", error);
  }
}

export async function requestEmpty(request: Promise<unknown>): Promise<void> {
  try {
    await request;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiServiceError(getApiErrorMessage(error), error);
    }

    throw new ApiServiceError("Unexpected API request failure", error);
  }
}
