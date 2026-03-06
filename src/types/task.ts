import type { User } from "./project";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface TaskAssignee {
  user: User
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  createdDate: string;
  dueDate: Date | null;
  status: TaskStatus;
  projectId: string;
  projectName: string;
  assigneeId: string | null;
  assigneeName: string | null;
  creatorId: string;
  creatorName: string;
  taskAssignees: TaskAssignee[];
}
