export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  deleted: boolean;
  role: "USER" | "ADMIN";
}
