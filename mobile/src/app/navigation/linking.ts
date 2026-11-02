import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/**
 * Deep link map for KDS Connect.
 *
 * Validation note: production URLs must be allow-listed on the backend and matched here
 * before navigation proceeds. Unrecognized paths should fall back to Auth/SignIn until
 * token + role validation is confirmed server-side.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['kdsconnect://', 'https://app.kdsconnect.example'],
  config: {
    screens: {
      Auth: {
        screens: {
          SignIn: 'sign-in',
          RegisterRole: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Retailer: {
        screens: {
          RetailerTabs: {
            screens: {
              Home: 'retailer/home',
              Products: 'retailer/products',
              Orders: 'retailer/orders',
            },
          },
          ProductDetails: 'retailer/product/:productId',
          OrderDetails: 'retailer/order/:orderId',
        },
      },
      Supplier: {
        screens: {
          SupplierTabs: {
            screens: {
              Dashboard: 'supplier/dashboard',
              Rfqs: 'supplier/rfqs',
            },
          },
          SupplierRfqDetails: 'supplier/rfq/:rfqId',
        },
      },
    },
  },
};
