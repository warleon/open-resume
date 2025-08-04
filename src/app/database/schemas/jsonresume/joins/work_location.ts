import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { work } from "@database/schemas/jsonresume/work";
import { location } from "@database/schemas/jsonresume/location";

export const work_location = sqliteTable(
  "work_location",
  {
    work: cuid2("work")
      .references(() => work.id)
      .unique(),
    location: cuid2("location").references(() => location.id),
  },
  (table) => [primaryKey({ columns: [table.work, table.location] })]
);
