import type { PropertyOwner, Property, ActivityLog, AdminUser } from "./types";

// Mock data for demonstration - in a real app, this would be a database
const propertyOwners: PropertyOwner[] = [];
let properties: Property[] = [];
const activityLogs: ActivityLog[] = [];

// Admin user (in production, this should be encrypted)
const adminUser: AdminUser = {
  username: "admin",
  password: "admin123", // In production, use proper hashing
};

// Property Owners
export const getPropertyOwners = (): PropertyOwner[] => {
  return propertyOwners;
};

export const getPropertyOwnerById = (id: string): PropertyOwner | undefined => {
  return propertyOwners.find((owner) => owner.id === id);
};

export const createPropertyOwner = (
  owner: Omit<PropertyOwner, "id" | "createdAt" | "updatedAt">
): PropertyOwner => {
  const newOwner: PropertyOwner = {
    ...owner,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  propertyOwners.push(newOwner);
  return newOwner;
};

export const updatePropertyOwner = (
  id: string,
  updates: Partial<PropertyOwner>
): PropertyOwner | null => {
  const index = propertyOwners.findIndex((owner) => owner.id === id);
  if (index === -1) return null;

  const oldOwner = propertyOwners[index];
  const changes = Object.entries(updates)
    .filter(([key, value]) => value !== oldOwner[key as keyof PropertyOwner])
    .map(([key, value]) => ({
      field: key,
      oldValue: String(oldOwner[key as keyof PropertyOwner]),
      newValue: String(value),
    }));

  propertyOwners[index] = {
    ...oldOwner,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Create activity log only once
  createActivityLog({
    action: "UPDATE",
    entityType: "OWNER",
    entityId: id,
    entityName: propertyOwners[index].name,
    adminUser: "admin", // This will be overridden by the actual admin user
    changes: changes.length > 0 ? changes : undefined,
  });

  return propertyOwners[index];
};

export const deletePropertyOwner = (id: string): boolean => {
  const index = propertyOwners.findIndex((owner) => owner.id === id);
  if (index === -1) return false;

  propertyOwners.splice(index, 1);
  // Also delete all properties belonging to this owner
  properties = properties.filter((property) => property.ownerId !== id);
  return true;
};

// Properties
export const getProperties = (): Property[] => {
  return properties;
};

export const getPropertiesByOwnerId = (ownerId: string): Property[] => {
  return properties.filter((property) => property.ownerId === ownerId);
};

export const getPropertyById = (id: string): Property | undefined => {
  return properties.find((property) => property.id === id);
};

export const createProperty = (
  property: Omit<Property, "id" | "createdAt" | "updatedAt">
): Property => {
  const newProperty: Property = {
    ...property,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  properties.push(newProperty);
  return newProperty;
};

export const updateProperty = (
  id: string,
  updates: Partial<Property>
): Property | null => {
  const index = properties.findIndex((property) => property.id === id);
  if (index === -1) return null;

  const oldProperty = properties[index];
  const changes = Object.entries(updates)
    .filter(([key, value]) => {
      if (key === "files") return false; // Skip files comparison
      return value !== oldProperty[key as keyof Property];
    })
    .map(([key, value]) => {
      // Special handling for ownerId to show owner name
      if (key === "ownerId") {
        const oldOwner = getPropertyOwnerById(oldProperty.ownerId);
        const newOwner = getPropertyOwnerById(value as string);
        return {
          field: key,
          oldValue: oldOwner?.name || oldProperty.ownerId,
          newValue: newOwner?.name || value,
        };
      }
      return {
        field: key,
        oldValue: String(oldProperty[key as keyof Property]),
        newValue: String(value),
      };
    });

  // Update the property
  properties[index] = {
    ...oldProperty,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Create activity log only once
  createActivityLog({
    action: "UPDATE",
    entityType: "PROPERTY",
    entityId: id,
    entityName: properties[index].title,
    adminUser: "admin", // This will be overridden by the actual admin user
    changes: changes.length > 0 ? changes : undefined,
  });

  return properties[index];
};

export const deleteProperty = (id: string): boolean => {
  const index = properties.findIndex((property) => property.id === id);
  if (index === -1) return false;

  properties.splice(index, 1);
  return true;
};

// Activity Logs
export const getActivityLogs = (): ActivityLog[] => {
  return activityLogs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const createActivityLog = (
  log: Omit<ActivityLog, "id" | "timestamp">
): ActivityLog => {
  const newLog: ActivityLog = {
    ...log,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  activityLogs.push(newLog);
  return newLog;
};

// Authentication
export const validateAdmin = (username: string, password: string): boolean => {
  return username === adminUser.username && password === adminUser.password;
};

// Utility functions
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Initialize with some sample data
export const initializeSampleData = () => {
  if (propertyOwners.length === 0) {
    const owner1 = createPropertyOwner({
      name: "สมชาย ใจดี",
      address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110",
      phone: "081-234-5678",
      email: "somchai@email.com",
    });

    const owner2 = createPropertyOwner({
      name: "สมหญิง ทรัพย์มาก",
      address: "456 ถนนเพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพมหานคร 10400",
      phone: "082-345-6789",
      email: "somying@email.com",
    });

    createProperty({
      ownerId: owner1.id,
      title: "บ้านเดี่ยว 2 ชั้น",
      description: "บ้านเดี่ยว 2 ชั้น 4 ห้องนอน 3 ห้องน้ำ",
      address:
        "789 ซอยลาดพร้าว 15 แขวงจันทรเกษม เขตจตุจักร กรุงเทพมหานคร 10900",
      mapLink:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5064686244827!2d100.5497633!3d13.7456928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ0JzQ0LjUiTiAxMDDCsDMyJzU5LjIiRQ!5e0!3m2!1sth!2sth!4v1644894952143!5m2!1sth!2sth",
      files: [],
    });

    createProperty({
      ownerId: owner2.id,
      title: "คอนโดมิเนียม",
      description: "คอนโด 1 ห้องนอน 1 ห้องน้ำ ชั้น 15",
      address: "321 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพมหานคร 10400",
      mapLink:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.6507934986166!2d100.5367845!3d13.7680556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ2JzA1LjAiTiAxMDDCsDMyJzEyLjQiRQ!5e0!3m2!1sth!2sth!4v1644894952143!5m2!1sth!2sth",
      files: [],
    });

    createProperty({
      ownerId: owner1.id,
      title: "Land for Loan - Nice 2 Building",
      description:
        "อาคารสำนักงาน/พาณิชย์ ให้บริการสินเชื่อโฉนดที่ดิน พื้นที่ใช้สอยดี ที่จอดรถสะดวก",
      address: "Nice 2 Building, หนองจอก กรุงเทพมหานคร",
      mapLink:
        "https://maps.app.goo.gl/cUV8KdZZrVLZjMCLcUV8KdZZrVLZjMCL8cUV8KdZZrVLZjMCL8cUV8KdZZrVLZjMCL8cUV8KdZZrVLZjMCL8cUV8KdZZrVLZjMCL8cUV8KdZZrVLZjMCL8cUV8KdZZrVLZjMCL88",
      files: [
        {
          id: "land-for-loan-img",
          name: "Land for Loan Logo.jpg",
          url: "/api/placeholder/400/400",
          type: "image/jpeg",
          size: 125000,
          uploadedAt: new Date().toISOString(),
        },
      ],
    });
  }
};
