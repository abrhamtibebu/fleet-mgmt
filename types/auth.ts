
interface User {
  id: string;
  phone: string;
  username:string;
  first_name: string;
  last_name: string;
  role: string;
  parent_id: string;
}

interface OtpSign {
  otp_token: string;
}


enum AuthState {
  loading,
  authenticated,
  unauthenticated,
}
export { AuthState };
export type { User, OtpSign };
