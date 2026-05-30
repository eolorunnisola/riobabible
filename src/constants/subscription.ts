/** Free-tier limits — tune as the business model evolves. */
export const FREE_TIER_LIMITS = {
  /** Guidance chats a free user may start per day. */
  dailyChatLimit: 3,
  /** How many days of journal history a free user can browse. */
  journalHistoryDays: 7,
  /** Max saved verses, prayers, and guidance responses combined. */
  savedReflectionsLimit: 10,
  /** Only color palette available on the free plan. */
  freeColorTheme: 'sage' as const,
} as const;

/** Length of the introductory premium trial, in days. */
export const PREMIUM_TRIAL_DAYS = 7;
