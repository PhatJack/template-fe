import { z } from "zod";
import { api, requestData, requestEmpty } from "~/lib/api";
import {
  conversationSchema,
  createConversationSchema,
  updateConversationSchema,
  type CreateConversationInput,
  type UpdateConversationInput,
} from "./schemas";

const conversationListSchema = z.array(conversationSchema);
const idParamSchema = z.string().min(1);

export const conversationService = {
  listConversations(userId?: string) {
    const parsedUserId = userId ? idParamSchema.parse(userId) : undefined;

    return requestData(
      api.get("/conversations", {
        params: parsedUserId ? { userId: parsedUserId } : undefined,
      }),
      conversationListSchema,
    );
  },

  createConversation(input: CreateConversationInput) {
    const payload = createConversationSchema.parse(input);
    return requestData(api.post("/conversations", payload), conversationSchema);
  },

  getConversation(id: string) {
    const parsedId = idParamSchema.parse(id);
    return requestData(api.get(`/conversations/${parsedId}`), conversationSchema);
  },

  updateConversation(id: string, input: UpdateConversationInput) {
    const parsedId = idParamSchema.parse(id);
    const payload = updateConversationSchema.parse(input);

    return requestData(
      api.patch(`/conversations/${parsedId}`, payload),
      conversationSchema,
    );
  },

  deleteConversation(id: string) {
    const parsedId = idParamSchema.parse(id);
    return requestEmpty(api.delete(`/conversations/${parsedId}`));
  },
};
