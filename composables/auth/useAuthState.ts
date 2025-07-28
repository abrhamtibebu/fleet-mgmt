import { AuthState, type User } from '../../types/auth'
import type { AuthSession } from "../../types/misc";

const getDefaultSession = (): AuthSession | undefined => {
  if (process.client) {
    return {
      access_token: localStorage.getItem("access_token") || "",
      refresh_token: localStorage.getItem("refresh_token") || "",
    };
  }
  return undefined;
};
export const useAuthState = () => {
  const status = useState<AuthState>("authState", () => AuthState.loading);
  const org_id = "80f2321c-d8de-11ef-b1f0-005056a825ac";
  const mediaSession = useState<MediaSession | undefined>("mediaSession", () => undefined);
  const currentUser = useState<User | undefined>(
    "currentUser",
    () => undefined
  );
  const session = useState<AuthSession | undefined>("session", () =>
    getDefaultSession()
  );
  watch(
    session,
    (session) => {
      if (process.client) {
        localStorage.setItem("access_token", session?.access_token || "");
        localStorage.setItem("refresh_token", session?.refresh_token || "");
      }
    },
    { deep: true }
  );
  return { status, session, currentUser, mediaSession, org_id };
};
