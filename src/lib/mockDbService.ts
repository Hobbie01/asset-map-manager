import { Database } from "@/types/database.types";
import { mockDb } from "./mockData";

type TableName = keyof Database["public"]["Tables"];
type RowType<T extends TableName> = Database["public"]["Tables"][T]["Row"];
type InsertType<T extends TableName> =
  Database["public"]["Tables"][T]["Insert"];
type UpdateType<T extends TableName> =
  Database["public"]["Tables"][T]["Update"];

class MockDbService {
  // Generic select function
  async select<T extends TableName>(
    table: T,
    options?: {
      filter?: Partial<RowType<T>>;
      limit?: number;
      offset?: number;
      orderBy?: { column: keyof RowType<T>; ascending?: boolean };
    }
  ): Promise<RowType<T>[]> {
    let results = [...mockDb[table]] as RowType<T>[];

    // Apply filters
    if (options?.filter) {
      results = results.filter((row) => {
        return Object.entries(options.filter!).every(
          ([key, value]) => row[key as keyof RowType<T>] === value
        );
      });
    }

    // Apply sorting
    if (options?.orderBy) {
      const { column, ascending = true } = options.orderBy;
      results.sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];

        // Handle undefined or null values
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        // Now we know both values are defined
        if (typeof aValue === "string" && typeof bValue === "string") {
          return ascending
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // For numbers and other types
        return ascending
          ? aValue < bValue
            ? -1
            : aValue > bValue
              ? 1
              : 0
          : aValue > bValue
            ? -1
            : aValue < bValue
              ? 1
              : 0;
      });
    }

    // Apply pagination
    if (options?.offset) {
      results = results.slice(options.offset);
    }
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  // Generic insert function
  async insert<T extends TableName>(
    table: T,
    data: InsertType<T>
  ): Promise<RowType<T>> {
    const baseRow = {
      ...data,
      id: data.id || crypto.randomUUID(),
      created_at: data.created_at || new Date().toISOString(),
    } as RowType<T>;

    // Only add updated_at if the table has that field
    const hasUpdatedAt = "updated_at" in baseRow;
    const newRow = hasUpdatedAt
      ? { ...baseRow, updated_at: new Date().toISOString() }
      : baseRow;

    (mockDb[table] as RowType<T>[]).push(newRow);
    return newRow;
  }

  // Generic update function
  async update<T extends TableName>(
    table: T,
    id: string,
    data: UpdateType<T>
  ): Promise<RowType<T> | null> {
    const index = (mockDb[table] as RowType<T>[]).findIndex(
      (row) => row.id === id
    );
    if (index === -1) return null;

    const currentRow = mockDb[table][index];
    const baseUpdate = {
      ...currentRow,
      ...data,
    } as RowType<T>;

    // Only add updated_at if the table has that field
    const hasUpdatedAt = "updated_at" in baseUpdate;
    const updatedRow = hasUpdatedAt
      ? { ...baseUpdate, updated_at: new Date().toISOString() }
      : baseUpdate;

    (mockDb[table] as RowType<T>[])[index] = updatedRow;
    return updatedRow;
  }

  // Generic delete function
  async delete<T extends TableName>(table: T, id: string): Promise<boolean> {
    const index = (mockDb[table] as RowType<T>[]).findIndex(
      (row) => row.id === id
    );
    if (index === -1) return false;

    (mockDb[table] as RowType<T>[]).splice(index, 1);
    return true;
  }

  // Helper function to get a single record by ID
  async getById<T extends TableName>(
    table: T,
    id: string
  ): Promise<RowType<T> | null> {
    const results = await this.select(table, {
      filter: { id } as Partial<RowType<T>>,
    });
    return results[0] || null;
  }

  // Helper function to count records
  async count<T extends TableName>(
    table: T,
    filter?: Partial<RowType<T>>
  ): Promise<number> {
    const results = await this.select(table, { filter });
    return results.length;
  }
}

export const mockDbService = new MockDbService();
