/** Offline / fallback daily entries — one rotation slot per calendar day. */
export type DailyPoolEntry = {
  theme: string;
  reference: string;
  prayer: string;
  reflectionQuestion: string;
};

export const DAILY_POOL: DailyPoolEntry[] = [
  {
    theme: 'Peace in uncertainty',
    reference: 'PHP 4:6-7',
    prayer:
      'Father, quiet my racing thoughts. Help me bring each worry to You with thanksgiving, trusting Your peace to guard my heart.',
    reflectionQuestion: 'What worry can you name honestly before God today?',
  },
  {
    theme: 'Strength for today',
    reference: 'ISA 41:10',
    prayer: 'God, I do not need strength for every tomorrow—only for today. Walk with me in this hour.',
    reflectionQuestion: 'Where do you need God’s help most right now?',
  },
  {
    theme: 'Gentle hope',
    reference: 'LAM 3:22-23',
    prayer: 'Lord, thank You that Your mercies meet me again today. Renew my hope as I begin.',
    reflectionQuestion: 'What mercy from God can you thank Him for this morning?',
  },
  {
    theme: 'Rest for the weary',
    reference: 'MAT 11:28-30',
    prayer: 'Jesus, I come to You tired. Teach me Your gentleness and give rest to my soul.',
    reflectionQuestion: 'What burden can you honestly lay down at His feet today?',
  },
  {
    theme: 'Courage over fear',
    reference: 'JOS 1:9',
    prayer: 'Lord, when I feel small, remind me You go before me. Steady my heart to trust You.',
    reflectionQuestion: 'What step of obedience feels scary but right?',
  },
  {
    theme: 'Held in grief',
    reference: 'PSA 34:18',
    prayer: 'God of the brokenhearted, draw near. Let me feel Your nearness in this pain.',
    reflectionQuestion: 'Who or what are you grieving—and how can you bring it to God?',
  },
  {
    theme: 'Not alone',
    reference: 'HEB 13:5',
    prayer: 'Father, when I feel unseen, anchor me in Your promise never to leave me.',
    reflectionQuestion: 'Where do you need to remember God is with you?',
  },
  {
    theme: 'Fresh start',
    reference: '1JN 1:9',
    prayer: 'Lord, I receive Your forgiveness. Help me walk in freedom, not shame.',
    reflectionQuestion: 'Is there anything you need to confess and release today?',
  },
  {
    theme: 'Patient love',
    reference: '1CO 13:4-7',
    prayer: 'Spirit, grow patience and kindness in me toward the people You’ve placed in my life.',
    reflectionQuestion: 'Who needs a gentler word or action from you today?',
  },
  {
    theme: 'Work with purpose',
    reference: 'COL 3:23',
    prayer: 'God, let my work today honor You—even in small, unseen tasks.',
    reflectionQuestion: 'How can you serve well in one area today?',
  },
  {
    theme: 'Trust in provision',
    reference: 'MAT 6:33',
    prayer: 'Father, reorder my desires toward You. Provide what I need as I seek Your kingdom.',
    reflectionQuestion: 'What anxiety about money or future can you surrender?',
  },
  {
    theme: 'Renewed strength',
    reference: 'ISA 40:31',
    prayer: 'Lord, I wait on You. Lift me when I am faint and guide my next step.',
    reflectionQuestion: 'Where are you running ahead of God instead of waiting?',
  },
  {
    theme: 'Joy in hope',
    reference: 'ROM 15:13',
    prayer: 'God of hope, fill me with peace and joy by the power of Your Spirit today.',
    reflectionQuestion: 'What truth about God’s character can you cling to today?',
  },
  {
    theme: 'Forgiven and free',
    reference: 'EPH 4:32',
    prayer: 'Help me receive Your mercy and extend it to others as You have to me.',
    reflectionQuestion: 'Is there someone you need to forgive—or ask forgiveness from?',
  },
  {
    theme: 'Strength in temptation',
    reference: '1CO 10:13',
    prayer: 'Lord, You know my weakness. Give a way out and courage to take it.',
    reflectionQuestion: 'What temptation needs honesty and accountability today?',
  },
  {
    theme: 'Made on purpose',
    reference: 'EPH 2:10',
    prayer: 'Creator, thank You that my life has meaning in Christ. Show me good works for today.',
    reflectionQuestion: 'How might God want to use you in one ordinary moment?',
  },
  {
    theme: 'Cast your cares',
    reference: '1PE 5:7',
    prayer: 'Father, I cast what weighs on me onto You, because You care for me.',
    reflectionQuestion: 'What care have you been carrying alone that belongs to God?',
  },
  {
    theme: 'When afraid',
    reference: 'PSA 56:3',
    prayer: 'When I am afraid, I will trust in You. Steady my heart in Your Word.',
    reflectionQuestion: 'What fear is loudest—and what Scripture truth answers it?',
  },
  {
    theme: 'Comfort in sorrow',
    reference: 'MAT 5:4',
    prayer: 'Lord, bless those who mourn. Comfort me and teach me to comfort others.',
    reflectionQuestion: 'How can you mourn honestly without despair?',
  },
  {
    theme: 'Slow to anger',
    reference: 'JAS 1:19-20',
    prayer: 'Spirit, help me be quick to listen, slow to speak, and slow to anger today.',
    reflectionQuestion: 'Where might you pause before reacting?',
  },
  {
    theme: 'New creation',
    reference: '2CO 5:17',
    prayer: 'Thank You that in Christ I am made new. Lead me in who I am becoming.',
    reflectionQuestion: 'What old pattern is God inviting you to leave behind?',
  },
  {
    theme: 'God fights for you',
    reference: 'EXO 14:14',
    prayer: 'Lord, when the battle feels mine alone, remind me You are fighting. Help me be still.',
    reflectionQuestion: 'Where do you need to stop striving and trust God?',
  },
  {
    theme: 'Light in darkness',
    reference: 'JHN 8:12',
    prayer: 'Jesus, Light of the world, guide my steps and dispel the shadows I walk in.',
    reflectionQuestion: 'What darkness needs the light of Christ spoken over it?',
  },
  {
    theme: 'Abundant life',
    reference: 'JHN 10:10',
    prayer: 'Father, protect me from empty pursuits. Lead me into the full life You give.',
    reflectionQuestion: 'What is one life-giving choice you can make today?',
  },
  {
    theme: 'Rooted in love',
    reference: 'EPH 3:17-19',
    prayer: 'Root me deep in Your love so I may grasp how wide and long it is.',
    reflectionQuestion: 'How have you experienced God’s love recently?',
  },
  {
    theme: 'Do not worry',
    reference: 'MAT 6:34',
    prayer: 'Lord, enough for today is enough. Keep my mind on today’s grace, not tomorrow’s fears.',
    reflectionQuestion: 'What “tomorrow” worry can you set aside for now?',
  },
  {
    theme: 'The Lord is my shepherd',
    reference: 'PSA 23:1-3',
    prayer: 'Shepherd, lead me beside quiet waters and restore my soul.',
    reflectionQuestion: 'Where do you need guidance or rest from the Good Shepherd?',
  },
  {
    theme: 'Be still',
    reference: 'PSA 46:10',
    prayer: 'God, in the noise, teach me stillness. Help me know You are God.',
    reflectionQuestion: 'When can you be still for five minutes with God today?',
  },
  {
    theme: 'All things work together',
    reference: 'ROM 8:28',
    prayer: 'Father, I do not see the whole picture. Help me trust You love me and are at work.',
    reflectionQuestion: 'What hard situation might God still redeem?',
  },
  {
    theme: 'I can do all things',
    reference: 'PHP 4:13',
    prayer: 'Lord, strengthen me for what You call me to—not my own pride, but Your purpose.',
    reflectionQuestion: 'What is Christ calling you to that needs His strength, not yours alone?',
  },
  {
    theme: 'Delight in the Lord',
    reference: 'PSA 37:4',
    prayer: 'Align my desires with Yours. Let my heart find joy in You above outcomes.',
    reflectionQuestion: 'What would it look like to delight in God today, not just outcomes?',
  },
];
