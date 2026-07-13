import {
  SPROUT_INVENTORY_COLUMNS,
  SPROUT_CHAIN_STORE_COLUMNS,
  WAITROSE_COMMERCE_COLUMNS,
  SPS_COMMERCE_COLUMNS,
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
];
