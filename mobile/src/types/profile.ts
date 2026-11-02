import type { Address, Id } from './common';
import type { UserRole } from './auth';

export interface DeliveryAddress extends Address {
  id: Id;
  label: string;
  isDefault: boolean;
}

export interface BusinessProfile {
  userId: Id;
  role: UserRole;
  businessName: string;
  contactEmail: string;
  contactPhone?: string;
  billingAddress?: Address;
  deliveryAddresses: DeliveryAddress[];
  taxId?: string;
}
