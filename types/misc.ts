import type { ConcreteComponent } from "vue";
import type { User } from "./auth";

interface LoginResult {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: Number;
}
interface AuthSession {
  access_token: string;
  refresh_token: string;
}
interface SignupResult {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: Number;
}

interface OpenDialogEvent {
  component: ConcreteComponent;
  props: object;
  data?: any;
}
interface OpenDrawerEvent {}
interface CloseDrawerEvent {}
interface SignupFormEvent {
  form: object;
  otp_sign: string;
}
interface SignupForm {
  otp_sig: string;
  first_name: string;
  last_name?: string;
  user_name?: string;
  password: string;
  password_confirmation: string;
  phone: string;
}
interface forgotPasswordForm {
  phone: string;
  otp: string;
  password: string;
  password_confirmation: string;
  
}
interface SignUpMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}
interface CloseDialogEvent {
  close: boolean;
}
interface ChangeSetError {
  errors: {
    [key: string]: string[];
  };
}

export type {
  OpenDialogEvent,
  CloseDialogEvent,
  SignupFormEvent,
  ChangeSetError,
  SignUpMessage,
  SignupForm,
  LoginResult,
  OpenDrawerEvent,
  CloseDrawerEvent,
  SignupResult,
  AuthSession,
  forgotPasswordForm
};
