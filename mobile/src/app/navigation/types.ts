import type { NavigatorScreenParams } from '@react-navigation/native';
import type { UserRole } from '../../types';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  RegisterRole: undefined;
  RegisterRetailer: undefined;
  RegisterSupplier: undefined;
  ForgotPassword: undefined;
  DevPreview: undefined;
};

export type RetailerTabParamList = {
  Home: undefined;
  Products: undefined;
  GroupBuying: undefined;
  Orders: undefined;
  Account: undefined;
};

export type RetailerStackParamList = {
  RetailerTabs: NavigatorScreenParams<RetailerTabParamList>;
  ProductDetails: { productId: string };
  ProductSearch: { query?: string; categoryId?: string } | undefined;
  RfqList: undefined;
  RfqCreate: { productId?: string } | undefined;
  RfqDetails: { rfqId: string };
  QuotationCompare: { rfqId: string };
  QuotationDetails: { quotationId: string };
  GroupBuyDetails: { campaignId: string };
  Cart: undefined;
  OrderDetails: { orderId: string };
  Notifications: undefined;
  Addresses: undefined;
  Support: undefined;
  Preferences: undefined;
  BusinessProfile: undefined;
  Kyc: undefined;
  BusinessVerification: undefined;
  ChangePassword: undefined;
  VerifyMobile: undefined;
  Privacy: undefined;
};

export type SupplierTabParamList = {
  Dashboard: undefined;
  Rfqs: undefined;
  Orders: undefined;
  Products: undefined;
  Account: undefined;
};

export type SupplierStackParamList = {
  SupplierTabs: NavigatorScreenParams<SupplierTabParamList>;
  SupplierRfqDetails: { rfqId: string };
  SupplierQuotationForm: { rfqId: string; quotationId?: string };
  SupplierOrderDetails: { orderId: string };
  SupplierProductDetails: { productId: string };
  Notifications: undefined;
  Support: undefined;
  Preferences: undefined;
  BusinessProfile: undefined;
  Kyc: undefined;
  BusinessVerification: undefined;
  ChangePassword: undefined;
  VerifyMobile: undefined;
  Privacy: undefined;
};

export type SalesTabParamList = {
  Dashboard: undefined;
  Accounts: undefined;
  Account: undefined;
};

export type SalesStackParamList = {
  SalesTabs: NavigatorScreenParams<SalesTabParamList>;
  OnboardRetailer: undefined;
  OnboardWholesaler: undefined;
  ChangePassword: undefined;
  VerifyMobile: undefined;
  Support: undefined;
  Preferences: undefined;
  Privacy: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Overview: undefined;
  Orders: undefined;
  Quotations: undefined;
  Account: undefined;
};

export type AdminStackParamList = {
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
  ChangePassword: undefined;
  Support: undefined;
  SupportQueries: undefined;
  Preferences: undefined;
  Privacy: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Retailer: NavigatorScreenParams<RetailerStackParamList>;
  Supplier: NavigatorScreenParams<SupplierStackParamList>;
  Sales: NavigatorScreenParams<SalesStackParamList>;
  Admin: NavigatorScreenParams<AdminStackParamList>;
};

export type AppRoleRoute = UserRole;
