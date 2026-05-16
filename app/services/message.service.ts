import { z } from "zod";
import { api, requestData } from "~/lib/api";
import {
  createMessageSchema,
  generateMessageSchema,
  generatedMessageSchema,
  messageSchema,
  type CreateMessageInput,
  type GenerateMessageInput,
} from "./schemas";

const messageListSchema = z.array(messageSchema);
const idParamSchema = z.string().min(1);

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
};
