import { z } from "zod";
import { API_BASE_URL, api, requestData } from "~/lib/api";
import {
  createMessageSchema,
  generateMessageSchema,
  generatedMessageSchema,
  messageSchema,
  type CreateMessageInput,
  type GenerateMessageInput,
  type Message,
} from "./schemas";

const messageListSchema = z.array(messageSchema);
const idParamSchema = z.string().min(1);
const streamChunkSchema = z.object({
  text: z.string(),
});
const streamDoneSchema = z.object({
  model: z.string(),
  assistantMessage: messageSchema,
});

type StreamCallbacks = {
  onChunk: (text: string) => void;
  onDone: (payload: { model: string; assistantMessage: Message }) => void;
  onError: (error: Error) => void;
};

function parseStreamEvent<TSchema extends z.ZodType>(
  event: MessageEvent<string>,
  schema: TSchema,
): z.infer<TSchema> {
  const parsedJson = JSON.parse(event.data);
  const parsedData = schema.safeParse(parsedJson);

  if (!parsedData.success) {
    throw new Error("Invalid stream event payload");
  }

  return parsedData.data;
}

export const messageService = {
  listMessages(conversationId: string) {
    const parsedConversationId = idParamSchema.parse(conversationId);

    return requestData(
      api.get("/messages", { params: { conversationId: parsedConversationId } }),
      messageListSchema,
    );
  },

  createMessage(input: CreateMessageInput) {
    const payload = createMessageSchema.parse(input);
    return requestData(api.post("/messages", payload), messageSchema);
  },

  generateMessage(input: GenerateMessageInput) {
    const payload = generateMessageSchema.parse(input);
    return requestData(api.post("/messages/reply", payload), generatedMessageSchema);
  },

  streamMessage(input: GenerateMessageInput, callbacks: StreamCallbacks) {
    const payload = generateMessageSchema.parse(input);
    const url = new URL(`${API_BASE_URL}/messages/reply/stream`);
    url.searchParams.set("messageId", payload.messageId);

    const eventSource = new EventSource(url.toString(), {
      withCredentials: true,
    });

    eventSource.addEventListener("chunk", (event) => {
      try {
        const payload = parseStreamEvent(event, streamChunkSchema);
        callbacks.onChunk(payload.text);
      } catch (error) {
        callbacks.onError(
          error instanceof Error ? error : new Error("Invalid stream chunk"),
        );
        eventSource.close();
      }
    });

    eventSource.addEventListener("done", (event) => {
      try {
        const payload = parseStreamEvent(event, streamDoneSchema);
        callbacks.onDone(payload);
      } catch (error) {
        callbacks.onError(
          error instanceof Error ? error : new Error("Invalid stream result"),
        );
      } finally {
        eventSource.close();
      }
    });

    eventSource.addEventListener("error", (event) => {
      if ("data" in event && typeof event.data === "string" && event.data) {
        try {
          const payload = JSON.parse(event.data) as { message?: unknown };
          callbacks.onError(
            new Error(
              typeof payload.message === "string"
                ? payload.message
                : "Message stream failed",
            ),
          );
        } catch {
          callbacks.onError(new Error("Message stream failed"));
        }
      } else {
        callbacks.onError(new Error("Message stream failed"));
      }

      eventSource.close();
    });

    return eventSource;
  },
};
