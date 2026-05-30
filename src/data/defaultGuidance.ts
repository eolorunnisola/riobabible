import { GuidanceResponse } from '@/src/types';

/** Standalone default guidance — kept separate from mock.ts to avoid circular imports at startup */
export const DEFAULT_GUIDANCE: GuidanceResponse = {
  id: 'guidance-1',
  issueSummary: 'Feeling weary and overwhelmed by ongoing burdens.',
  empathy:
    'What you are carrying sounds heavy, and it makes sense that you feel worn down. You are not failing for needing rest and reassurance right now.',
  biblicalPerspective:
    'Scripture speaks to weariness by inviting us to come near to Christ honestly, without pretending we have it all together.',
  verses: [
    {
      reference: 'Matthew 11:28 (NIV)',
      text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    },
    {
      reference: 'Psalm 55:22 (NIV)',
      text: 'Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.',
    },
  ],
  explanation:
    'Jesus invites the weary—not the perfectly composed—to come near. These verses remind us that burdens can be handed over in honest prayer, one step at a time, without pretending the weight is not real.',
  prayer:
    'Lord, You see how tired I am. Teach me to bring You what I cannot carry alone. Give me rest for my soul and courage for the next faithful step. Amen.',
  nextStep:
    'Choose one small act of rest today—ten quiet minutes, a walk, or telling one trusted person how you feel—and offer it to God in prayer.',
  journalPrompts: [
    'What burden am I most afraid to name before God?',
    'Where have I seen His faithfulness in past seasons of weariness?',
    'What would "rest" look like in my body and schedule this week?',
  ],
  disclaimer:
    'This is spiritual encouragement rooted in Scripture, not professional counseling, medical, or mental health treatment.',
  category: 'weariness',
  createdAt: Date.now(),
};
