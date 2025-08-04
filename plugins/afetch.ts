import { useAuthState } from "../composables/auth/useAuthState";

export default defineNuxtPlugin(() => {
  const router = useRouter();
  const { public: config } = useRuntimeConfig();
  const { session } = useAuthState();
  const { onRefreshToken } = useAuth();

  const apiFetch = $fetch.create({
    baseURL: config.baseURL,
    retryStatusCodes: [401],
    retry: 1,
    onRequest: ({ options }) => {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${session.value?.access_token}`,
        "Content-Type": "application/json",
      };
    },
    onResponseError: async ({ response }) => {
      if (response.status === 401) {
        try {
            router.push('/login')
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    },
  });

  const authFetch = $fetch.create({
    baseURL: config.authURL,
    retryStatusCodes: [401],
    retry: 1,
    onRequest: ({ options }) => {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${session.value?.access_token}`,
        "Content-Type": "application/json",
      };
    },
    onResponseError: async ({ response }) => {
      if (response.status === 401) {
        try {
          router.push('/login')
          // await onRefreshToken();
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    },
  });
  

  return {
    provide: {
      apiFetch,
      authFetch
    },
  };
});
