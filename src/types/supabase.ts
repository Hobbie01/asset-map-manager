export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "admin" | "user";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: "admin" | "user";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "admin" | "user";
          created_at?: string;
          updated_at?: string;
        };
      };
      asset_owners: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      assets: {
        Row: {
          id: string;
          name: string;
          description: string;
          address: string;
          map_url: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          address: string;
          map_url: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          address?: string;
          map_url?: string;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      asset_files: {
        Row: {
          id: string;
          asset_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          asset_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          asset_id?: string;
          file_name?: string;
          file_path?: string;
          file_type?: string;
          file_size?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: "create" | "update" | "delete" | "restore";
          entity_type: "asset" | "owner" | "file";
          entity_id: string;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: "create" | "update" | "delete" | "restore";
          entity_type: "asset" | "owner" | "file";
          entity_id: string;
          details: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: "create" | "update" | "delete" | "restore";
          entity_type?: "asset" | "owner" | "file";
          entity_id?: string;
          details?: Json;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
