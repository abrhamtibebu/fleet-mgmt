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
  };
};
