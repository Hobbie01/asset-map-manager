export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AssetOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  address: string;
  map_url: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  owner?: AssetOwner;
}

export interface AssetFile {
  id: string;
  asset_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  asset?: Asset;
}

export type ActivityDetails = {
  before?: Partial<Asset | AssetOwner | AssetFile>;
  after?: Partial<Asset | AssetOwner | AssetFile>;
  changes?: Record<string, { from: unknown; to: unknown }>;
};

export interface ActivityLog {
  id: string;
  user_id: string;
  action: "create" | "update" | "delete" | "restore";
  entity_type: "asset" | "owner" | "file";
  entity_id: string;
  details: ActivityDetails;
  created_at: string;
  user?: User;
}
