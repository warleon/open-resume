import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { project } from "database/schemas/jsonresume/project";
import { role } from "database/schemas/jsonresume/role";

export const project_role = sqliteTable(
  "project_role",
  {
    project: cuid2("project").references(() => project.id),
    role: cuid2("role").references(() => role.id),
  },
  (table) => [primaryKey({ columns: [table.project, table.role] })]
);
