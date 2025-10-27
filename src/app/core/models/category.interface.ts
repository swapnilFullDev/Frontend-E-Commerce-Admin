export interface Category {
  id: number;
  name: string;
  image: string | null;
  icon: string | null;
  parentId: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
