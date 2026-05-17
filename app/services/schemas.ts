import { z } from "zod";

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
  id: z.string(),
  email: z.email(),
  name: z.string().nullable().optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(1),
});

export const authLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const flatAuthResponseSchema = userSchema.extend({
  accessToken: z.string().min(1),
});

const nestedAuthResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string().min(1),
});

export const authResponseSchema = z
  .union([nestedAuthResponseSchema, flatAuthResponseSchema])
  .transform((data) => {
    if ("user" in data) {
      return data;
    }

    const { accessToken, ...user } = data;
    return { user, accessToken };
  });

export const authRegisterSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(1),
});

export const authSignUpFormSchema = authRegisterSchema.extend({
  confirmPassword: z.string().min(1),
});

export const authSignInFormSchema = authLoginSchema.extend({
  rememberMe: z.boolean().optional(),
});

export const conversationSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  userId: z.string().nullable().optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const createConversationSchema = z.object({
  userId: z.string().nullable().optional(),
  prompt: z.string().min(1),
});

export const updateConversationSchema = z
  .object({
    userId: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one conversation field is required",
  });

export const messageRoleSchema = z.enum(["USER", "ASSISTANT", "SYSTEM"]);

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema.optional(),
});

export const createMessageSchema = z.object({
  conversationId: z.string(),
  role: messageRoleSchema,
  content: z.string().min(1),
});

export const generateMessageSchema = z.object({
  messageId: z.string(),
});

export const generatedMessageSchema = z.object({
  model: z.string(),
  sourceMessage: messageSchema,
  assistantMessage: messageSchema,
});

export const fileSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  messageId: z.string().nullable().optional(),
  originalName: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string().min(1),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const createFileSchema = z.object({
  conversationId: z.string(),
  messageId: z.string().nullable().optional(),
  originalName: z.string().optional(),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().nonnegative(),
  url: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type AuthLoginInput = z.infer<typeof authLoginSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;
export type AuthSignUpFormInput = z.infer<typeof authSignUpFormSchema>;
export type AuthSignInFormInput = z.infer<typeof authSignInFormSchema>;
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
