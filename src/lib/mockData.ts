import { Database } from "@/types/database.types";

// Mock data for profiles
export const mockProfiles: Database["public"]["Tables"]["profiles"]["Row"][] = [
  {
    id: "1",
    email: "admin@example.com",
    full_name: "Admin User",
    role: "admin",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@example.com",
    full_name: "Regular User",
    role: "user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock data for owners
export const mockOwners: Database["public"]["Tables"]["owners"]["Row"][] = [
  {
    id: "1",
    name: "บริษัท ตัวอย่าง จำกัด",
    phone: "02-123-4567",
    email: "contact@example.com",
    address: "123 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10000",
    tax_id: "0123456789012",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "1",
    updated_by: "1",
  },
  {
    id: "2",
    name: "ห้างหุ้นส่วน ตัวอย่าง",
    phone: "02-987-6543",
    email: "info@example-partnership.com",
    address: "456 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10000",
    tax_id: "0987654321098",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "1",
    updated_by: "1",
  },
];

// Mock data for assets
export const mockAssets: Database["public"]["Tables"]["assets"]["Row"][] = [
  {
    id: "1",
    name: "อาคารสำนักงาน A",
    description: "อาคารสำนักงาน 5 ชั้น",
    location: "123 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10000",
    coordinates: [13.7563, 100.5018],
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "1",
    updated_by: "1",
  },
  {
    id: "2",
    name: "ที่ดินแปลง B",
    description: "ที่ดินว่างเปล่า 2 ไร่",
    location: "456 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10000",
    coordinates: [13.7564, 100.5019],
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "1",
    updated_by: "1",
  },
];

// Mock data for asset_owners
export const mockAssetOwners: Database["public"]["Tables"]["asset_owners"]["Row"][] =
  [
    {
      id: "1",
      asset_id: "1",
      owner_id: "1",
      ownership_type: "freehold",
      start_date: "2020-01-01",
      end_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "1",
      updated_by: "1",
    },
    {
      id: "2",
      asset_id: "2",
      owner_id: "2",
      ownership_type: "leasehold",
      start_date: "2021-01-01",
      end_date: "2031-01-01",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "1",
      updated_by: "1",
    },
  ];

// Mock data for asset_files
export const mockAssetFiles: Database["public"]["Tables"]["asset_files"]["Row"][] =
  [
    {
      id: "1",
      asset_id: "1",
      file_name: "building_a_blueprint.pdf",
      file_path: "/files/building_a_blueprint.pdf",
      file_type: "application/pdf",
      file_size: 1024000,
      created_at: new Date().toISOString(),
      created_by: "1",
    },
    {
      id: "2",
      asset_id: "2",
      file_name: "land_survey.pdf",
      file_path: "/files/land_survey.pdf",
      file_type: "application/pdf",
      file_size: 2048000,
      created_at: new Date().toISOString(),
      created_by: "1",
    },
  ];

// Mock data for activities
export const mockActivities: Database["public"]["Tables"]["activities"]["Row"][] =
  [
    {
      id: "1",
      user_id: "1",
      action: "create",
      table_name: "assets",
      record_id: "1",
      details: { name: "อาคารสำนักงาน A" },
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "1",
      action: "update",
      table_name: "owners",
      record_id: "1",
      details: { name: "บริษัท ตัวอย่าง จำกัด" },
      created_at: new Date().toISOString(),
    },
  ];

// Mock database object that can be used to simulate database queries
export const mockDb = {
  profiles: mockProfiles,
  owners: mockOwners,
  assets: mockAssets,
  asset_owners: mockAssetOwners,
  asset_files: mockAssetFiles,
  activities: mockActivities,
};
