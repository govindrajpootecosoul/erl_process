import {
  SPROUT_INVENTORY_COLUMNS,
  SPROUT_CHAIN_STORE_COLUMNS,
  WAITROSE_COMMERCE_COLUMNS,
  SPS_COMMERCE_COLUMNS,
  WALMART_SCINTILLA_INVENTORY_COLUMNS,
  WALMART_SCINTILLA_ORDER_FORECAST_COLUMNS,
  WALMART_SCINTILLA_SALES_COLUMNS,
  WALMART_SCINTILLA_SKU_COLUMNS,
  WALMART_SCINTILLA_STORE_SALES_COLUMNS,
} from './columnSchemas';
import type { DateFormat } from './validators';

export interface EtlConfig {
  blobName: string;
  collectionName: string;
  requiredColumns: readonly string[];
  dateColumns: readonly { name: string; formats: readonly DateFormat[] }[];
}

export const etlConfigs: EtlConfig[] = [
  {
    blobName: 'sanity_data/retail/sprout_inventory.csv',
    collectionName: 'sprouts_inventory',
    requiredColumns: SPROUT_INVENTORY_COLUMNS,
    dateColumns: [
      { name: 'downloaded_on', formats: ['DD-MMM-YY', 'DD-MMM-YYYY'] },
      { name: 'sellbydate', formats: ['M/D/YYYY', 'MM/DD/YYYY'] },
    ],
  },
  {
    blobName: 'sanity_data/retail/sprout_chain_store.csv',
    collectionName: 'sprouts_chain_store',
    requiredColumns: SPROUT_CHAIN_STORE_COLUMNS,
    dateColumns: [{ name: 'file_month', formats: ['MMM-YY', 'MMM-YYYY'] }],
  },
  {
    blobName: 'sanity_data/retail/kehe_inventory.csv',
    collectionName: 'kehe_inventory',
    requiredColumns: SPROUT_INVENTORY_COLUMNS,
    dateColumns: [
      { name: 'downloaded_on', formats: ['DD-MMM-YY', 'DD-MMM-YYYY'] },
      { name: 'sellbydate', formats: ['M/D/YYYY', 'MM/DD/YYYY'] },
    ],
  },
  {
    blobName: 'sanity_data/retail/kehe_chain_store.csv',
    collectionName: 'kehe_chain_store',
    requiredColumns: SPROUT_CHAIN_STORE_COLUMNS,
    dateColumns: [{ name: 'file_month', formats: ['MMM-YY', 'MMM-YYYY'] }],
  },
  {
    blobName: 'sanity_data/retail/waitrose_commerece.csv',
    collectionName: 'purchase_orders_waitrose',
    requiredColumns: WAITROSE_COMMERCE_COLUMNS,
    dateColumns: [
      { name: 'po_date', formats: ['M/D/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { name: 'po_requested_delivery_date', formats: ['M/D/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { name: 'actual_fulfillment_date', formats: ['M/D/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { name: 'invoice_date', formats: ['M/D/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { name: 'common_po_date', formats: ['MMM-YY', 'MMM-YYYY'] },
      { name: 'common_invoice_date', formats: ['MMM-YY', 'MMM-YYYY'] },
      { name: 'year_month_po', formats: ['YYYY-M', 'YYYY-MM'] },
    ],
  },
  {
    blobName: 'sanity_data/retail/sps_commerce.csv',
    collectionName: 'purchase_orders_sps',
    requiredColumns: SPS_COMMERCE_COLUMNS,
    dateColumns: [
      { name: 'po_date', formats: ['M/D/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { name: 'po_requested_delivery_date', formats: ['M/D/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { name: 'actual_fulfillment_date', formats: ['M/D/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { name: 'invoice_date', formats: ['M/D/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { name: 'common_po_date', formats: ['MMM-YY', 'MMM-YYYY'] },
      { name: 'common_invoice_date', formats: ['MMM-YY', 'MMM-YYYY'] },
      { name: 'year_month_po', formats: ['YYYY-M', 'YYYY-MM'] },
    ],
  },
  {
    blobName: 'sanity_data/retail/walmart_scintilla_inventory.csv',
    collectionName: 'walmart_scintilla_inventory',
    requiredColumns: WALMART_SCINTILLA_INVENTORY_COLUMNS,
    dateColumns: [{ name: 'report_date', formats: ['YYYY-MM-DD', 'M/D/YYYY', 'MM/DD/YYYY'] }],
  },
  {
    blobName: 'sanity_data/retail/walmart_scintilla_order_forecast.csv',
    collectionName: 'walmart_scintilla_order_forecast',
    requiredColumns: WALMART_SCINTILLA_ORDER_FORECAST_COLUMNS,
    dateColumns: [
      { name: 'sugg_order_dt', formats: ['YYYY-MM-DD', 'M/D/YYYY', 'MM/DD/YYYY'] },
      { name: 'order_place_dt', formats: ['YYYY-MM-DD', 'M/D/YYYY', 'MM/DD/YYYY'] },
      { name: 'sched_arvl_dt', formats: ['YYYY-MM-DD', 'M/D/YYYY', 'MM/DD/YYYY'] },
    ],
  },
  {
    blobName: 'sanity_data/retail/walmart_scintilla_sales.csv',
    collectionName: 'walmart_scintilla_sales',
    requiredColumns: WALMART_SCINTILLA_SALES_COLUMNS,
    dateColumns: [{ name: 'business_date', formats: ['YYYY-MM-DD', 'M/D/YYYY', 'MM/DD/YYYY'] }],
  },
  {
    blobName: 'sanity_data/retail/walmart_scintilla_sku.csv',
    collectionName: 'walmart_scintilla_sku',
    requiredColumns: WALMART_SCINTILLA_SKU_COLUMNS,
    dateColumns: [],
  },
  {
    blobName: 'sanity_data/retail/walmart_scintilla_store_sales.csv',
    collectionName: 'walmart_scintilla_store_sales',
    requiredColumns: WALMART_SCINTILLA_STORE_SALES_COLUMNS,
    dateColumns: [{ name: 'business_date', formats: ['YYYY-MM-DD', 'M/D/YYYY', 'MM/DD/YYYY'] }],
  },
];
