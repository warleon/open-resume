import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { skill } from "database/schemas/jsonresume/skill";
import { keyword } from "database/schemas/jsonresume/keyword";

export const skill_keyword = sqliteTable(
  "skill_keyword",
  {
    skill: cuid2("skill").references(() => skill.id),
    keyword: cuid2("keyword").references(() => keyword.id),
  },
  (table) => [primaryKey({ columns: [table.skill, table.keyword] })]
);
