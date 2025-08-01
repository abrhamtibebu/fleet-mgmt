import { AuthState } from "~/types/auth";
import { useAppStore } from "~/store";
import type { LoginResult, SignupForm,forgotPasswordForm } from "~/types/misc";
import { nextTick } from "vue";
import { useAuthState } from "./useAuthState";
import { usePublicRoutes } from '~/composables/usePublicRoutes'

const login = async (identifier: string, password: string): Promise<void> => {
  const { session, status } = useAuthState();
 
  const { login } = useAuthRepository();
  // const appStore = useAppStore();

  // appStore.setAuthState(AuthState.loading);
  status.value = AuthState.loading;
  const auth_session = await login(identifier, password);
  console.log("auth_session", auth_session);
  session.value = {
    access_token: auth_session.access_token,
    refresh_token: auth_session.refresh_token,
  };
  await nextTick(getCurrentUser);
  Promise.resolve();
};

const signup = async (form: SignupForm): Promise<void> => {
  console.log("Form to be submitted: ", form);
  const { signup } = useAuthRepository();
  const { currentUser, status, session } = useAuthState();
  // const appStore = useAppStore();
  // appStore.setAuthState(AuthState.loading);
  status.value = AuthState.loading;
  const auth_session = await signup(form);
  session.value = {
    access_token: auth_session.result.access_token,
    refresh_token: auth_session.result.refresh_token,
  };
  currentUser.value = auth_session.user;
  status.value = AuthState.authenticated;
   await nextTick(getCurrentUser);
  Promise.resolve();
};


const resetPassword = async (form: forgotPasswordForm): Promise<void> => {

  const { resetPass } = useAuthRepository();
  const {  status } = useAuthState();

  status.value = AuthState.loading;
  const val = await resetPass(form);
 
  Promise.resolve();
};

const onRefreshToken = async (): Promise<void> => {
  const { refreshToken } = useAuthRepository();
   const { isPublicRoute } = usePublicRoutes();
  const { session } = useAuthState();
  try {
    const auth_session = await refreshToken();
    session.value = {
      access_token: auth_session.access_token,
      refresh_token: auth_session.refresh_token,
    };

  } catch (error) {
    if ((!isPublicRoute(window.location.pathname) && error.response.status === 401)) {
        console.log("Current path name",window.location.pathname)
          window.location.href = '/login';
      }

      console.error('An unexpected error occurred:', error);
  
  }
  Promise.resolve();
};

const getCurrentUser = async (): Promise<void> => {
  const { currentUser, status } = useAuthState();

  try {
    status.value = AuthState.loading;
    // appStore.setAuthState(AuthState.authenticated);
    status.value = AuthState.authenticated;
    // console.log("AUTH SESSION: ", auth_session);
    return Promise.resolve();
  } catch (error) {
    console.log("GET USER ERROR: ", error);
    // appStore.setAuthState(AuthState.unauthenticated);
    status.value = AuthState.unauthenticated;
    currentUser.value = undefined;
    return Promise.resolve();
    // localStorage.setItem("refresh_token", "");
    // localStorage.setItem("access_token", "");
    // appStore.setCurrentUser(null);
  }
};

export const useAuth = () => {
  return {
    getCurrentUser,
    login,
    signup,
    onRefreshToken,
    resetPassword
  };
};
