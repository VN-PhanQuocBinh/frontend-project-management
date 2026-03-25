export interface Notification {
    id: string;
    content: string;
    createdDate: string | null;
    userId: string;
    username: string;
    isRead: boolean;
    taskId: string;
    taskTitle: string;
    projectName?: string;
}