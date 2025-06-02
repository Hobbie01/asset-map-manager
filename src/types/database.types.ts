export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin" | "user";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "admin" | "user";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "admin" | "user";
          created_at?: string;
          updated_at?: string;
        };
      };
      owners: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          email: string | null;
          address: string | null;
          tax_id: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          tax_id?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          tax_id?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
      };
      assets: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          location: string | null;
          coordinates: [number, number] | null;
          status: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          location?: string | null;
          coordinates?: [number, number] | null;
          status: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          location?: string | null;
          coordinates?: [number, number] | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
      };
      asset_owners: {
        Row: {
          id: string;
          asset_id: string;
          owner_id: string;
          ownership_type: string;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          asset_id: string;
          owner_id: string;
          ownership_type: string;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          asset_id?: string;
          owner_id?: string;
          ownership_type?: string;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
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
          created_by: string | null;
        };
        Insert: {
          id?: string;
          asset_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          asset_id?: string;
          file_name?: string;
          file_path?: string;
          file_type?: string;
          file_size?: number;
          created_at?: string;
          created_by?: string | null;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          table_name: string;
          record_id: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          table_name: string;
          record_id: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          table_name?: string;
          record_id?: string;
          details?: Json | null;
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
      user_role: "admin" | "user";
    };
  };
};
