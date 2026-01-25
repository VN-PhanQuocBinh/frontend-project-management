export interface Card {
  _id: string;
  projectId: string;
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
