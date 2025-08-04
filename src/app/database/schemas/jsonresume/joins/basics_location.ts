import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { basics } from "@database/schemas/jsonresume/basics";
import { location } from "@database/schemas/jsonresume/location";

export const basics_location = sqliteTable(
  "basics_location",
  {
    basics: cuid2("basics").references(() => basics.id),
    location: cuid2("location")
      .references(() => location.id)
      .unique(),
    default: integer("default", { mode: "boolean" }),
  },
  (table) => [primaryKey({ columns: [table.basics, table.location] })]
);
