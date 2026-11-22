export type PlanId = 'free' | 'sprint_7d' | 'starter_monthly' | 'pro_monthly';

export interface PlanConfig {
  id: PlanId;
  name: string;
  badge?: string;
  description: string;
  priceInr: number; // Base price or all-inclusive display
  period: 'monthly' | '7_days' | 'lifetime_free';
  includedTailorRuns: number;
  features: string[];
  recommended?: boolean;
}

export interface PlanEconomicsBreakdown {
  planId: PlanId;
  planName: string;
  grossPriceInr: number;
  basePriceInr: number;
  gstInr: number; // 18% GST
  gatewayFeeInr: number; // 2% + 18% GST on fee = 2.36% of gross
  netRevenueInr: number;
  runsAllocated: number;
  expectedRunUsageRate: number; // e.g. 70% of runs actually consumed
  expectedRunsUsed: number;
  geminiModel: string;
  aiCostPerRunInr: number;
  totalAiCogsInr: number;
  infraCogsPerUserInr: number; // Hosting, DB, storage, exports
  totalCogsInr: number;
  netContributionMarginInr: number;
  grossMarginPercent: number;
  breakEvenUsersForFixedCosts: number; // Assuming ₹10,000/mo fixed costs
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number; // In paise
  currency: 'INR';
  keyId: string;
  planId: PlanId;
  planName: string;
}

export interface WebhookEventPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        method: string;
        email: string;
        contact: string;
        notes?: Record<string, string>;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        status: string;
        receipt?: string;
        notes?: Record<string, string>;
      };
    };
  };
}
