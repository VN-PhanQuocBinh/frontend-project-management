import type { UniqueIdentifier } from "@dnd-kit/core";

export interface Card {
  _id: string;
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
  _id: string;
  projectId: string;
  title: string;
  cardOrderIds: string[];
  cards: Card[];
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  type: 'public' | 'private';
  ownerIds: string[];
  memberIds: string[];
  columnOrderIds: string[];
  columns: Column[];
}

export interface ProjectStore {
  currentActiveProject: Project | null;
  setCurrentActiveProject: (project: Project | null) => void;
  updateCardInProject: (updatedCard: Card) => void;
  fetchProjectDetailsAPI: (projectId: UniqueIdentifier) => Promise<void>;
}
