import { AuthState } from "~/types/auth";
import { useAppStore } from "~/store";
import type { LoginResult, SignupForm,forgotPasswordForm } from "~/types/misc";
import { nextTick } from "vue";
import { useAuthState } from "./useAuthState";
import { usePublicRoutes } from '~/composables/usePublicRoutes'

const login = async (identifier: string, password: string): Promise<void> => {
  const { session, status, currentUser } = useAuthState();
 
  const { login } = useAuthRepository();

  status.value = AuthState.loading;
  const auth_session = await login(identifier, password);
  console.log("auth_session", auth_session);
  
  session.value = {
    access_token: auth_session.access_token,
    refresh_token: auth_session.refresh_token,
  };
  
  // Set user data from login response if available, otherwise fetch it
  if (auth_session.user) {
    currentUser.value = auth_session.user;
    status.value = AuthState.authenticated;
  } else {
    // Fetch user data after successful login
    await getCurrentUser();
  }
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
  const { currentUser, status, session } = useAuthState();
  const { getCurrentUser: fetchUser } = useAuthRepository();

  try {
    status.value = AuthState.loading;
    
    // Check if we have a valid session
    if (!session.value?.access_token) {
      status.value = AuthState.unauthenticated;
      currentUser.value = undefined;
      return Promise.resolve();
    }

    // Fetch current user from API
    const userData = await fetchUser();
    currentUser.value = userData;
    status.value = AuthState.authenticated;
    
    console.log("Current user fetched:", userData);
    return Promise.resolve();
  } catch (error) {
    console.log("GET USER ERROR: ", error);
    
    // If it's a 404 error (endpoint doesn't exist), use mock user
    if (error?.response?.status === 404) {
      const mockUser = await fetchUser(); // This will return mock user
      currentUser.value = mockUser;
      status.value = AuthState.authenticated;
      console.log("Using mock user due to missing endpoint:", mockUser);
      return Promise.resolve();
    }
    
    status.value = AuthState.unauthenticated;
    currentUser.value = undefined;
    
    // Clear invalid tokens
    if (process.client) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    session.value = undefined;
    
    return Promise.resolve();
  }
};

const logout = async (): Promise<void> => {
  const { session, status, currentUser } = useAuthState();
  const router = useRouter();

  try {
    // Clear session data
    session.value = undefined;
    currentUser.value = undefined;
    status.value = AuthState.unauthenticated;

    // Clear localStorage
    if (process.client) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }

    // Navigate to login page
    await router.push('/login');
    
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    // Even if there's an error, clear the session
    session.value = undefined;
    currentUser.value = undefined;
    status.value = AuthState.unauthenticated;
    
    if (process.client) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    
    await router.push('/login');
  }
};

const initializeAuth = async (): Promise<void> => {
  const { session, status } = useAuthState();
  
  // Check if we have stored tokens
  if (process.client) {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (accessToken && refreshToken) {
      session.value = {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
      
      // Try to fetch current user
      await getCurrentUser();
    } else {
      status.value = AuthState.unauthenticated;
    }
  }
};

export const useAuth = () => {
  return {
    getCurrentUser,
    login,
    signup,
    onRefreshToken,
    resetPassword,
    logout,
    initializeAuth
  };
};
