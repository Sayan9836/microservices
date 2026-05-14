# 🚀 PostgreSQL & Prisma: Production Learning Guide

### 1. The "Drift" Issue (Syncing Code & DB)
**Scenario:** Your database has tables/columns that your code (migration history) doesn't know about.
**The "Production" Fix (Baselining):**
1.  **Introspect**: `npx prisma db pull` (Update your code to match the real DB).
2.  **Baseline**: 
    *   `mkdir -p prisma/migrations/0_init`
    *   `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql`
3.  **Resolve**: `npx prisma migrate resolve --applied 0_init`

---

### 2. Field Renaming (Avoiding Data Loss)
**Scenario:** Renaming `name` to `title`. Prisma defaults to deleting the old and creating the new.
**The Fix:**
1.  **Draft**: `npx prisma migrate dev --create-only --name rename_field`
2.  **Intercept**: Open the `.sql` file and change `DROP/ADD` to:
    ```sql
    ALTER TABLE "TableName" RENAME COLUMN "oldName" TO "newName";
    ```
3.  **Apply**: `npx prisma migrate dev`

---

### 3. Data Transformation (Splitting/Merging)
**Scenario:** Splitting `name` into `firstName` and `lastName`.
**The Pattern (Add -> Update -> Drop):**
1.  **Add**: `ALTER TABLE "Table" ADD COLUMN "newCol" TEXT;` (Make it nullable first).
2.  **Update**: 
    *   *Split*: `UPDATE "Table" SET "firstName" = split_part("name", ' ', 1);`
    *   *Merge*: `UPDATE "Table" SET "name" = TRIM(CONCAT_WS(' ', "firstName", "lastName"));`
3.  **Drop**: `ALTER TABLE "Table" DROP COLUMN "oldCol";`
4.  **Lock**: `ALTER TABLE "Table" ALTER COLUMN "newCol" SET NOT NULL;`

---

### 4. Handling Database Locks (P1002 Error)
**Scenario:** Prisma times out because a "Ghost" session is holding a lock on the database.
**The Fix (In TablePlus):**
1.  **Find the Ghost**: 
    ```sql
    SELECT pid, state, query FROM pg_stat_activity WHERE datname = 'your_db';
    ```
2.  **The Nuke**: Kill all connections to clear the lock:
    ```sql
    SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
    WHERE datname = 'your_db' AND pid <> pg_backend_pid();
    ```

---

### 5. Environment Hazards
*   **The .env File**: Your `DATABASE_URL` is your steering wheel. If it points to RDS, your local commands will change your cloud database.
*   **Zero Downtime**: In large apps, we use a multi-step deploy (Expand -> Migrate -> Contract) to ensure the site never crashes while the DB is changing.
