export type PurchaseEntitlement = {
  isPremium: boolean;
  isTrial: boolean;
  expiresAt?: number;
  productId?: string;
};

export type PurchasePackage = {
  identifier: string;
  title: string;
  /** Localized price label, e.g. "$4.99/month" */
  priceString: string;
  billingPeriod: 'monthly';
  /** Introductory free-trial length in days (store intro offer). */
  trialDays: number;
};

export type PurchaseOfferings = {
  packages: PurchasePackage[];
};
