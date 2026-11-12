# Ecommerce operations

This project uses n8n and Google Sheets to track inventory. When someone places an order through the form, n8n logs the order and reserves the requested quantity. Cancelling the order releases those units back into available stock. Both stock changes are recorded in the **Movements** tab.

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

## Workflows

### Order Event Intake

![Order Event Intake workflow](images/order-event-intake.png)

### Process Inventory Movement

![Process Inventory Movement workflow](images/process-inventory-movement.png)

## Inventory tracker

### Inventory

![Google Sheets inventory overview](images/sheets-inventory-overview.png)

### Movements

![Google Sheets stock movements](images/sheets-inventory-movements.png)
