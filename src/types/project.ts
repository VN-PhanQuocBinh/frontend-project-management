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

export interface ProjectStore {
  currentActiveProject: Project | null;
  setCurrentActiveProject: (project: Project | null) => void;
  updateCardInProject: (updatedCard: Card) => void;
  fetchProjectDetailsAPI: (projectId: UniqueIdentifier) => Promise<void>;
}
