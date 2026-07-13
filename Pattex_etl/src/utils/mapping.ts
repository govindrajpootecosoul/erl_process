import {
  PATTEX_BUYBOX_COLUMNS,
  PATTEX_REVENUE_COLUMNS,
  PATTEX_INVENTORY_COLUMNS,
  PATTEX_MARKETING_COLUMNS,
  SELLER_CENTRAL_ADS_COLUMNS,
  VENDOR_CENTRAL_ADS_COLUMNS,
  NOON_MINUTES_ADS_COLUMNS,
  NOON_MINUTES_INVENTORY_COLUMNS,
  NOON_MINUTES_SALES_COLUMNS,
  NOON_CORE_ADS_COLUMNS,
  NOON_CORE_INVENTORY_COLUMNS,
  NOON_CORE_SALES_COLUMNS,
  META_ADS_UK_COLUMNS,
  GOOGLE_ADS_UK_COLUMNS,
  KINETICA_AMAZON_ADS_COLUMNS,
} from './columnSchemas';
import type { DateFormat } from './validators';

export interface EtlConfig {
  blobName: string;
  collectionName: string;
  requiredColumns: readonly string[];
  dateColumns: readonly { name: string; formats: readonly DateFormat[] }[];
  azureContainer?: string;
  mongoDbName?: string;
}

const pattexDateFormats: readonly DateFormat[] = ['DD-MMM-YYYY', 'DD-MMM-YY'];
const kineticaContainer = 'thrive-client-kinetica';
const kineticaDb = 'kinetica';
const metaAdsDateColumns = [
  { name: 'date', formats: pattexDateFormats },
  { name: 'reporting_starts', formats: pattexDateFormats },
  { name: 'reporting_ends', formats: pattexDateFormats },
  { name: 'date_raw', formats: pattexDateFormats },
  { name: 'reporting_starts_raw', formats: pattexDateFormats },
  { name: 'reporting_ends_raw', formats: pattexDateFormats },
] as const;

export const etlConfigs: EtlConfig[] = [
  {
    blobName: 'sanity_data/datahive/amazon/pattex_buybox.csv',
    collectionName: 'buyboxes',
    requiredColumns: PATTEX_BUYBOX_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/amazon/pattex_revenue.csv',
    collectionName: 'revenues',
    requiredColumns: PATTEX_REVENUE_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/amazon/pattex_inventory.csv',
    collectionName: 'inventories',
    requiredColumns: PATTEX_INVENTORY_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/amazon/pattex_marketing.csv',
    collectionName: 'marketings',
    requiredColumns: PATTEX_MARKETING_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/ads/seller_central_ads.csv',
    collectionName: 'seller_central_ads',
    requiredColumns: SELLER_CENTRAL_ADS_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/ads/vendor_central_ads.csv',
    collectionName: 'vendor_central_ads',
    requiredColumns: VENDOR_CENTRAL_ADS_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/noon_minutes/noon_minutes_ads.csv',
    collectionName: 'noon_minutes_ads',
    requiredColumns: NOON_MINUTES_ADS_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/noon_minutes/noon_minutes_inventory.csv',
    collectionName: 'noon_minutes_inventory',
    requiredColumns: NOON_MINUTES_INVENTORY_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/noon_minutes/noon_minutes_sales.csv',
    collectionName: 'noon_minutes_sales',
    requiredColumns: NOON_MINUTES_SALES_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/noon_core/noon_core_ads.csv',
    collectionName: 'noon_core_ads',
    requiredColumns: NOON_CORE_ADS_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/noon_core/noon_core_inventory.csv',
    collectionName: 'noon_core_inventory',
    requiredColumns: NOON_CORE_INVENTORY_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/noon_core/noon_core_sales.csv',
    collectionName: 'noon_core_sales',
    requiredColumns: NOON_CORE_SALES_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
  },
  {
    blobName: 'sanity_data/datahive/meta_ads/meta_ads_master_2026.csv',
    collectionName: 'meta_ads_uk',
    requiredColumns: META_ADS_UK_COLUMNS,
    dateColumns: metaAdsDateColumns,
    azureContainer: kineticaContainer,
    mongoDbName: kineticaDb,
  },
  {
    blobName: 'sanity_data/datahive/google_ads/google_ads_master_2026.csv',
    collectionName: 'google_ads_uk',
    requiredColumns: GOOGLE_ADS_UK_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
    azureContainer: kineticaContainer,
    mongoDbName: kineticaDb,
  },
  {
    blobName: 'sanity_data/datahive/ads/ae_ads.csv',
    collectionName: 'ae_ads',
    requiredColumns: KINETICA_AMAZON_ADS_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
    azureContainer: kineticaContainer,
    mongoDbName: kineticaDb,
  },
  {
    blobName: 'sanity_data/datahive/ads/de_ads.csv',
    collectionName: 'de_ads',
    requiredColumns: KINETICA_AMAZON_ADS_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
    azureContainer: kineticaContainer,
    mongoDbName: kineticaDb,
  },
  {
    blobName: 'sanity_data/datahive/ads/uk_ads.csv',
    collectionName: 'uk_ads',
    requiredColumns: KINETICA_AMAZON_ADS_COLUMNS,
    dateColumns: [{ name: 'date', formats: pattexDateFormats }],
    azureContainer: kineticaContainer,
    mongoDbName: kineticaDb,
  },
];
