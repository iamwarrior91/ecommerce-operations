# Ecommerce operations

Project files for the ecommerce operations system.

## Run ecommerce n8n

Open Docker Desktop, then run in PowerShell:

```powershell
cd C:\Users\mario\Desktop\code\CODEX\ecommerce-operations
docker compose up -d
docker compose ps
```

Open http://localhost:5679 and create a separate owner account on first launch.
This project has its own Compose project, Docker network, n8n storage volume,
SQLite database, credentials and workflows. It does not use the quality-monitor
project or its PostgreSQL database. Both instances can run at the same time.
n8n generates and persists its encryption key in this project's data volume.
The container listens on 5678 internally; only host port 5679 is exposed,
bound to this computer. Local webhook URLs are for local testing, not external stores.

```powershell
# Stop this project while retaining its workflows and credentials:
docker compose down
# View this project's logs:
docker compose logs --tail 50 n8n
```

Do not add `-v` to the stop command unless you intend to delete the saved n8n data.
The `stable` image tag can change. Pin a tested version before relying on a
repeatable production deployment.

## Inventory tracker

- Live Google Sheet: https://docs.google.com/spreadsheets/d/14tQW_PhDiIsmKy9FvRWwH2zJrzleN0PjWConfEcOP-c/edit
- inventory-tracker/Inventory Tracker.xlsx: local workbook used to create the Google Sheet. Later online edits are not automatically synced to this file.
- inventory-tracker/build.mjs: workbook generator. Running it regenerates the local blank template, not the live Google Sheet.
- inventory-tracker/*.png: verified layout previews.

Prepared for 200 SKUs and 1,000 movements. Store integration and n8n automation are not connected yet.
