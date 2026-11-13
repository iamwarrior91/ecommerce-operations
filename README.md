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

**Order Event Intake** records new orders and cancellations from the form, then requests a stock reservation or release.

**Process Inventory Movement** checks the event ID for duplicates before logging the stock change in the **Movements** tab.

## Order form

| Choose an event | Place an order | Cancel an order |
| --- | --- | --- |
| ![Event type dropdown](images/form-record-event.png) | ![SKU and quantity fields](images/form-place-reservation.png) | ![Order ID dropdown](images/form-cancel-reservation.png) |

## Inventory tracker

### Inventory

![Google Sheets inventory overview](images/sheets-inventory-overview.png)

### Movements

![Google Sheets stock movements](images/sheets-inventory-movements.png)

**Inventory** shows on-hand, reserved, and available stock for each SKU.

**Movements** logs stock changes. The Inventory tab uses those entries to update its counts.
