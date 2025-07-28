// stores/app.ts
import { defineStore } from "pinia";
import { AuthState, type User } from "~/types/auth";

interface AppState {
  phoneNumber: string | null;
  otp: string | null;
  resource: object;
  authState: AuthState;
  currentUser: User | null;
  timeLeft: number;
  initialTime: number;
  quizAnswer: object;
  currentQuestion: object;
    isUnsavedChanges: boolean; 
  showConfirmationDialog: boolean; 
  confirmDialogMessage: string;
    confirmCallback: () => void; // Callback for confirmation
  cancelCallback: () => void; // Callback for cancellation
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    phoneNumber: null,
    otp:null,
    authState: AuthState.loading,
    currentUser: null, // timeLeft: process.client? parseInt(localStorage.getItem('timeLeft') || '0'):null,
    timeLeft: 0,
    initialTime: 0,
    resource: {},
    quizAnswer: {},
    currentQuestion: {},
      isUnsavedChanges: false, 
    showConfirmationDialog: false,
    confirmDialogMessage: '',
     confirmCallback: () => {}, // Initialize empty callbacks
    cancelCallback: () => {},
  }),
  actions: {
    setPhoneNumber(phone: string) {
      this.phoneNumber = phone;
    },

    
    getPhoneNumber() {
      return this.phoneNumber;
    },
         setOtp(otp: string) {
      this.otp = otp;
    },
        getOtp() {
      return this.otp;
    },
    setResourceData(resource: object) {
      this.resource = resource;
    },

    setQuizAnswer(answer: object) {
      this.quizAnswer = answer;
    },

    setCurrentQuestion(question: object) {
      this.currentQuestion = question;
    },

    getResourceData() {
      return this.resource;
    },

    getQuizAnswer() {
      return this.quizAnswer;
    },

    getCurrentQuestion() {
      return this.currentQuestion;
    },

    setAuthState(state: AuthState) {
      this.authState = state;
    },
    getAuthState() {
      return this.authState;
    },
    setCurrentUser(user: User | null) {
      this.currentUser = user;
    },
    getCurrentUser() {
      return this.currentUser;
    },
    setInitialTime(time: number) {
      this.initialTime = time;
      this.timeLeft = time;
      if (process.client) {
        localStorage.setItem("timeLeft", time.toString());
      }
    },
    decrementTimeLeft() {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        if (process.client) {
          localStorage.setItem("timeLeft", this.timeLeft.toString());
        }
      }
    },
    resetTimeLeft() {
      this.timeLeft = this.initialTime;
      if (process.client) {
        localStorage.setItem("timeLeft", this.initialTime.toString());
      }
    },
   setUnsavedChanges(hasUnsavedChanges: boolean) {
      this.isUnsavedChanges = hasUnsavedChanges;
    },
    showConfirmDialog(message: string, onConfirm: () => void, onCancel: () => void) {
      this.confirmDialogMessage = message;
      this.showConfirmationDialog = true;
      this.confirmCallback = onConfirm;
      this.cancelCallback = onCancel;
    },
    hideConfirmDialog() {
      this.showConfirmationDialog = false;
      this.confirmDialogMessage = '';
    },
  },
});
