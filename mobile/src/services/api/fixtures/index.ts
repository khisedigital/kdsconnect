/** DEV ONLY fixture barrel — never used in production API factory. */

export {
  DEV_ACCESS_TOKEN,
  DEV_REFRESH_TOKEN,
  devRetailerUser,
  devSupplierUser,
  devSalesUser,
  devAdminUser,
  getCurrentDevUser,
  setCurrentDevUser,
  devSessionForUser,
  devUserForEmail,
} from './devUsers';
export { devProducts, devProductCategories } from './products';
export { devRfqs } from './rfqs';
export { devQuotations } from './quotations';
export { devGroupBuyCampaigns } from './campaigns';
export { devOrders } from './orders';
export { devSupportQueries } from './supportQueries';

const DEV_FIXTURE_DELAY_MS = 300;

export function devDelay(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, DEV_FIXTURE_DELAY_MS);
  });
}
