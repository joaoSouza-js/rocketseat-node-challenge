/*
  Warnings:

  - Made the column `userId` on table `Meals` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "isInDiet" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Meals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Meals" ("createdAt", "date", "description", "id", "isInDiet", "name", "updatedAt", "userId") SELECT "createdAt", "date", "description", "id", "isInDiet", "name", "updatedAt", "userId" FROM "Meals";
DROP TABLE "Meals";
ALTER TABLE "new_Meals" RENAME TO "Meals";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
