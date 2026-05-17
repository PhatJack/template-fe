import { z } from "zod";
import { api, requestData, requestEmpty } from "~/lib/api";
import { createFileSchema, fileSchema, type CreateFileInput } from "./schemas";

const fileListSchema = z.array(fileSchema);
const idParamSchema = z.string().min(1);

export const fileService = {
  listFiles(conversationId: string) {
    const parsedConversationId = idParamSchema.parse(conversationId);

    return requestData(
      api.get("/files", { params: { conversationId: parsedConversationId } }),
      fileListSchema,
    );
  },

  createFile(input: CreateFileInput) {
    const payload = createFileSchema.parse(input);
    return requestData(api.post("/files", payload), fileSchema);
  },

  deleteFile(id: string) {
    const parsedId = idParamSchema.parse(id);
    return requestEmpty(api.delete(`/files/${parsedId}`));
  },
};
