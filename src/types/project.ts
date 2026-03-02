import type { UniqueIdentifier } from "@dnd-kit/core";

export interface Card {
  id: string;
  projectId?: string;
  columnId: string;
  title?: string;
  description?: string | null;
  cover?: string | null;
  memberIds?: string[];
  comments?: string[];
  attachments?: string[];
  FE_PlaceholderCard?: boolean;
}

export interface Column {
  id: string;
  projectId: string;
  // title: string;
  name: string;
  taskOrderIds: string[];
  tasks: Card[];
}

export interface Project {
  id: string;
  // title?: string;
  name?: string;
  description: string;
  type: 'public' | 'private';
  ownerIds: string[];
  memberIds: string[];
  columnOrderIds: string[];
  boardColumns: Column[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  status: string;
  members: string[] | null;
  owner: string;
}

export interface ProjectStore {
  currentActiveProject: Project | null;
  projects: ProjectItem[];
  setCurrentActiveProject: (project: Project | null) => void;
  setProjects: (projects: ProjectItem[]) => void;
  updateCardInProject: (updatedCard: Card) => void;
  fetchProjectDetailsAPI: (projectId: UniqueIdentifier) => Promise<void>;
}
