# Ecommerce operations

An n8n order form backed by Google Sheets. Placing an order reserves stock. Cancelling it releases the reservation.

## Run locally

Start Docker Desktop and run these commands from the repo folder.

```powershell
docker compose up -d
docker compose ps
```

Open [n8n](http://localhost:5679). Run `docker compose down` to stop it and keep your saved workflows and credentials.

## Project files

- [Inventory tracker](https://docs.google.com/spreadsheets/d/14tQW_PhDiIsmKy9FvRWwH2zJrzleN0PjWConfEcOP-c/edit)
- [Workflow exports](workflows/) for order intake, inventory movements, and manual testing.
- [Workbook template and generator](inventory-tracker/)
