# Walmart Scintilla ETL files (azure-to-mongodb-etl)

Added 2026-07-14. Source path: `sanity_data/retail/` in Azure container `thrive-client-ecosoulhome`.

Collection names match the CSV file name (without `.csv`).

| Blob | MongoDB collection |
|---|---|
| walmart_scintilla_inventory.csv | walmart_scintilla_inventory |
| walmart_scintilla_order_forecast.csv | walmart_scintilla_order_forecast |
| walmart_scintilla_sales.csv | walmart_scintilla_sales |
| walmart_scintilla_sku.csv | walmart_scintilla_sku |
| walmart_scintilla_store_sales.csv | walmart_scintilla_store_sales |

## Date columns validated

- inventory: `report_date` (M/D/YYYY, MM/DD/YYYY)
- order_forecast: `sugg_order_dt`, `order_place_dt`, `sched_arvl_dt`
- sales: `business_date`
- sku: none
- store_sales: `business_date`

## Schema updates (2026-07-14)

- inventory: added `year`, `month`
- order_forecast: added `item_number`
- sales: added `unnamed_12`–`unnamed_15`, `walmart_calendar_year_1`–`3`, `item_number`
- sku: `upc_1` replaced by `ecomm_upc_number` (headers `WalMart SKU` / `EcoSoul SKU` / `Pack` / `Unit Cost` normalize)
- store_sales: added `walmart_calendar_quarter`, `item_number` (trailing duplicate `walmart_sku`/`ecosoul_sku`/`year`/`month` headers collapse on normalize)

## Notes

- Headers with spaces / mixed case (e.g. `WalMart SKU`, `EcoSoul SKU`) are normalized via `normalizeColumnName` to `walmart_sku`, `ecosoul_sku`.
- Walmart Scintilla CSVs include a UTF-8 BOM on the first column. `normalizeColumnName` strips `\uFEFF` before normalizing; otherwise the first header becomes `_walmart_calendar_year` (etc.) and validation fails.
- `walmart_scintilla_store_sales.csv` is large (~179 MiB). ETL downloads to a temp file first (avoids Azure stream AbortError during slow parse), then validates, then uploads in batches of 2000.
- Schemas live in `azure-to-mongodb-etl/src/utils/columnSchemas.ts`; wiring in `mapping.ts`.
