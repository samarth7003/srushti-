# PostgreSQL Database Creation & Configuration Guide

Follow these steps to set up your PostgreSQL database for the Srushti Jewellery application.

---

## Step 1: Create the Database

Open your PostgreSQL command line (psql) or use a GUI database management client (like pgAdmin or DBeaver) and run the following command to create a new database:

```sql
CREATE DATABASE srushti_jewellery;
```

---

## Step 2: Initialize Tables & Seed Data

Execute the SQL script located in `backend/db/schema.sql`. You can do this in two ways:

### Option A: Using the command line (psql)
Run this command from your terminal (replace `postgres` with your username if it is different):

```bash
psql -U postgres -d srushti_jewellery -f backend/db/schema.sql
```

### Option B: Using pgAdmin or any SQL Editor
1. Connect to the `srushti_jewellery` database.
2. Open a new **Query Tool / SQL Editor**.
3. Copy the entire contents of the `backend/db/schema.sql` file.
4. Paste it into the query editor and click **Execute / Play**.

This script will automatically:
- Drop existing tables (if any).
- Create tables: `categories`, `products`, `orders`, `order_items`, and `reviews`.
- Seed initial jewelry product collections and product categories.

---

## Step 3: Configure environment variables

In the `backend` folder, check the `.env` file and adjust the connection parameters to match your local PostgreSQL configuration:

```env
PORT=5000
PGUSER=your_postgres_username      # default is usually: postgres
PGHOST=localhost
PGDATABASE=srushti_jewellery       # your created database name
PGPASSWORD=your_postgres_password  # your password here
PGPORT=5432                        # default is: 5432
```

---

## Step 4: Run the Backend & Frontend

### 1. Run the Backend
Navigate to the `backend` folder, install dependencies, and start the development server:
```bash
cd backend
npm install
npm run dev
```
The server will start listening on `http://localhost:5000`.

### 2. Run the Frontend
Navigate to the `frontend` folder, install dependencies, and start the Vite server:
```bash
cd ../frontend
npm install
npm run dev
```
The React frontend will start and will automatically consume APIs from the Node server.
