# Data Migration from Supabase to MongoDB

This document outlines the steps to migrate your data from your Supabase (PostgreSQL) database to your new MongoDB database.

## 1. Export Data from Supabase

You will need to export your data from each table in your Supabase database to a CSV file. You can do this from the Supabase dashboard:

1.  Go to the "Table Editor" in your Supabase project.
2.  Select the table you want to export (e.g., `menu_items`, `reservations`, `admin_users`).
3.  Click the "Export" button and choose "CSV".
4.  Repeat this for all the tables you need to migrate.

## 2. Import Data into MongoDB

Once you have your data in CSV files, you can import it into your MongoDB database. You can use the `mongoimport` command-line tool for this.

Here's an example of how to import the `menu_items` data:

```bash
mongoimport --uri "your-mongodb-uri" --collection menu_items --type csv --file path/to/your/menu_items.csv --headerline
```

You will need to do this for each of your tables, mapping them to the correct collections in MongoDB.

**Important Considerations:**

*   **Relationships:** Your `reservation_items` table has foreign keys to `reservations` and `menu_items`. When you import this data, you will need to ensure that the relationships are correctly established in your new MongoDB documents. You may need to write a script to handle this, as a direct CSV import will not preserve these relationships.
*   **Data Transformation:** You may need to transform some of the data to match the new schemas defined in your FastAPI application. For example, you may need to convert date strings to a format that MongoDB can understand.
*   **Admin Users:** You will need to create a new admin user in your MongoDB database. You can use the temporary `/create_admin` endpoint for this. Remember to remove this endpoint after you have created your admin user.

This is a manual process and may require some scripting to get right. Please be sure to back up your data before you begin.
