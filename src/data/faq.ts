export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: 'How’s the project onboarding process?',
    answer:
      'Send us your template link and a short brief. Within one business day we reply with a scope, a timeline and a fixed quote. Once you approve it, we start with a 30-minute kickoff call.',
  },
  {
    question: 'What template can I request customization for?',
    answer:
      'Any Webflow template: one of our selected templates, one from the Webflow Marketplace or one from a third-party seller. Not sure a template fits your project? Ask us before you buy it.',
  },
  {
    question: 'What if I don’t use all the hours available?',
    answer:
      'Unused hours stay on your account for 60 days. Use them for later tweaks, new pages or content updates.',
  },
  {
    question: 'How does payment work?',
    answer:
      'Starter is paid 50% upfront and 50% on delivery. Premium is billed monthly and you can cancel at any time. We accept cards and bank transfers.',
  },
  {
    question: 'What are the delivery steps?',
    answer:
      'You get a staging link to review progress during the sprint. After your final approval we transfer the project to your Webflow account and help you publish it.',
  },
  {
    question: 'Can I hire more hours than the basic pack offers?',
    answer:
      'Yes. Extra hours are billed at the Starter rate, and you can add them at any point during the project.',
  },
];
