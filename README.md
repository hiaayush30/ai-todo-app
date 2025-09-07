In your **docker-compose.yml**, you defined:

```yaml
volumes:
  postgres_data:
```

and mounted it into the container:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

---

## 🔹 What this does

* **`/var/lib/postgresql/data`** inside the container is where Postgres stores its database files (tables, indexes, WAL logs, etc.).
* By mounting a **named volume** (`postgres_data`) there, Docker ensures your data is stored **outside the container’s ephemeral filesystem**.
* This means:

  * If the Postgres container is stopped, removed, or recreated → your database data persists.
  * Without this volume, all data would be lost when the container is removed.

---

## 🔹 Example

1. Start container with volume → create some tables and insert data.
2. Stop and remove the container:

   ```bash
   docker compose down
   ```
3. Start again:

   ```bash
   docker compose up -d
   ```

👉 Your database and tables are **still there** because they live in the `postgres_data` volume.

---

## 🔹 Types of volumes

* **Named volumes** (like `postgres_data`) → managed by Docker, stored in `/var/lib/docker/volumes/` on your host.
* **Bind mounts** (e.g., `./data:/var/lib/postgresql/data`) → maps a host directory to container path, giving you direct access to files.

---

## 🔹 Why use volumes with Postgres?

* **Persistence** → your DB survives container restarts.
* **Isolation** → data is separate from container lifecycle.
* **Portability** → you can easily backup/restore volumes.

---

⚡ In short: `postgres_data` is where your actual database files live, and it makes sure your data doesn’t vanish when the container is rebuilt.

Do you want me to also show you **how to inspect this volume on your host machine** to actually see where Postgres files are being stored?
