export interface PropertyOwner {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: string;
  mapLink: string;
  files: PropertyFile[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface ActivityLog {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entityType: "OWNER" | "PROPERTY";
  entityId: string;
  entityName: string;
  adminUser: string;
  timestamp: string;
  changes?: {
    field: string;
    oldValue?: string;
    newValue?: string;
  }[];
  details?: string;
}

export interface AdminUser {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}
