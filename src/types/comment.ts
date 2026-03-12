import type { User } from "./user";

export interface Comment {
  id: string;
  content: string;
  createdDate: string;
  user: User;
  taskId: string;
  taskTitle: string;
}
