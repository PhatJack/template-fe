import { z } from "zod";
import { api, requestData, requestEmpty } from "~/lib/api";
import { createFileSchema, fileSchema, type CreateFileInput } from "./schemas";

const fileListSchema = z.array(fileSchema);
const uploadFileResponseSchema = z
  .union([fileSchema, fileListSchema])
  .transform((data) => (Array.isArray(data) ? data : [data]));
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

  uploadFiles(input: {
    conversationId: string;
    messageId: string;
    files: File[];
  }) {
    const parsedConversationId = idParamSchema.parse(input.conversationId);
    const parsedMessageId = idParamSchema.parse(input.messageId);
    const formData = new FormData();

    formData.append("conversationId", parsedConversationId);
    formData.append("messageId", parsedMessageId);
    input.files.forEach((file) => formData.append("files", file));

    return requestData(
      api.post("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      uploadFileResponseSchema,
    );
  },

  deleteFile(id: string) {
    const parsedId = idParamSchema.parse(id);
    return requestEmpty(api.delete(`/files/${parsedId}`));
  },
};
