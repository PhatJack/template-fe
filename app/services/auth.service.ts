import { z } from "zod";
import { api, requestData } from "~/lib/api";
import {
  authResponseSchema,
  authLoginSchema,
  authRegisterSchema,
  userSchema,
  type AuthLoginInput,
  type AuthRegisterInput,
} from "./schemas";

export const authService = {
  register(input: AuthRegisterInput) {
    const payload = authRegisterSchema.parse(input);
    return requestData(api.post("/auth/register", payload), authResponseSchema);
  },

  login(input: AuthLoginInput) {
    const payload = authLoginSchema.parse(input);
    return requestData(api.post("/auth/login", payload), authResponseSchema);
  },

  me() {
    return requestData(api.get("/auth/me"), userSchema);
  },
};

export type AuthUser = z.infer<typeof userSchema>;
