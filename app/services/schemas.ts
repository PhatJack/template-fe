import { z } from "zod";

const idSchema = z.string().min(1);
const dateStringSchema = z.string().min(1);

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string().optional(),
});

export const createApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  });

export const userSchema = z.object({
  _id: idSchema,
  email: z.email(),
  name: z.string().nullable().optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
});

export const conversationSchema = z.object({
  _id: idSchema,
  title: z.string().nullable().optional(),
  userId: idSchema.nullable().optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const createConversationSchema = z.object({
  userId: idSchema,
  prompt: z.string().min(1),
});

export const updateConversationSchema = z
  .object({
    userId: idSchema.nullable().optional(),
    title: z.string().nullable().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one conversation field is required",
  });

export const messageRoleSchema = z.enum(["USER", "ASSISTANT", "SYSTEM"]);

export const messageSchema = z.object({
  id: idSchema,
  conversationId: idSchema,
  role: messageRoleSchema,
  content: z.string(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema.optional(),
});

export const createMessageSchema = z.object({
  conversationId: idSchema,
  role: messageRoleSchema,
  content: z.string().min(1),
});

export const generateMessageSchema = z.object({
  messageId: idSchema,
});

export const generatedMessageSchema = z.object({
  model: z.string(),
  sourceMessage: messageSchema,
  assistantMessage: messageSchema,
});

export const fileSchema = z.object({
  _id: idSchema,
  conversationId: idSchema,
  messageId: idSchema.nullable().optional(),
  originalName: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string().min(1),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const createFileSchema = z.object({
  conversationId: idSchema,
  messageId: idSchema.nullable().optional(),
  originalName: z.string().optional(),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().nonnegative(),
  url: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type MessageRole = z.infer<typeof messageRoleSchema>;
export type Message = z.infer<typeof messageSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type GenerateMessageInput = z.infer<typeof generateMessageSchema>;
export type GeneratedMessage = z.infer<typeof generatedMessageSchema>;
export type FileRecord = z.infer<typeof fileSchema>;
export type CreateFileInput = z.infer<typeof createFileSchema>;
