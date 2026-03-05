export interface UserProfile {
  id: string;
  username: string;
  role: string;
  email: string;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
