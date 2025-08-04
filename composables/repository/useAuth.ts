import { AuthState, type OtpSign, type User } from "~/types/auth";
import type { LoginResult, SignupForm, SignupResult,forgotPasswordForm } from "~/types/misc";
import { useAuthState } from "~/composables/auth/useAuthState";

export const useAuthRepository = () => {
  const { $authFetch, $apiFetch } = useNuxtApp();
  return {
    login: async (
      identifier: string,
      password: string
    ): Promise<LoginResult> => {
      return await $authFetch<LoginResult>("/auth/login", {
        method: "POST",
        body: {
          email: identifier,
          password: password,
        },
      });
    },
    // Since /auth/me doesn't exist, we'll create a mock user or skip this
    getCurrentUser: async (): Promise<User> => {
      // For now, return a mock user since the endpoint doesn't exist
      // You can implement this when the backend provides the endpoint
      return {
        id: "1",
        phone: "",
        username: "admin",
        first_name: "Admin",
        last_name: "User",
        role: "Fleet Manager",
        parent_id: ""
      };
    },
  };
};
