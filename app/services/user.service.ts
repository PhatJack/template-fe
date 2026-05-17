import { z } from "zod";
import { api, requestData } from "~/lib/api";
import { createUserSchema, userSchema, type CreateUserInput } from "./schemas";

const userListSchema = z.array(userSchema);

export const userService = {
  listUsers() {
    return requestData(api.get("/users"), userListSchema);
  },

  createUser(input: CreateUserInput) {
    const payload = createUserSchema.parse(input);
    return requestData(api.post("/users", payload), userSchema);
  },
};
