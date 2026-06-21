export type NoteTemplate = {
  id: string;
  name: string;
  content?: string;
  category: string;
};

export const NOTE_TEMPLATE_CATEGORIES = [
  "Offense",
  "Defense",
  "Neutral",
  "Mental",
  "Execution",
  "Okizeme",
] as const;

// `content` is translated and stored in the catalog under `video.noteTemplates.<id>`
// (key = template `id`). It is resolved at selection time in `note-template-selector.tsx`
// via `useTranslations`. `name` and `category` stay English (FGC labels / structural keys).
export const NOTE_TEMPLATES: NoteTemplate[] = [
  // Offense
  {
    id: "dropped-combo",
    name: "Dropped Combo",
    category: "Offense",
  },
  {
    id: "missed-punish",
    name: "Missed Punish",
    category: "Offense",
  },
  {
    id: "reset-opportunity",
    name: "Reset Opportunity",
    category: "Offense",
  },
  {
    id: "frame-trap-failed",
    name: "Frame Trap Failed",
    category: "Offense",
  },
  {
    id: "whiff-punish",
    name: "Whiff Punish",
    category: "Offense",
  },

  // Defense
  {
    id: "failed-anti-air",
    name: "Failed Anti-Air",
    category: "Defense",
  },
  {
    id: "bad-wakeup",
    name: "Bad Wakeup Choice",
    category: "Defense",
  },
  {
    id: "throw-tech-missed",
    name: "Throw Tech Missed",
    category: "Defense",
  },
  {
    id: "wrong-block",
    name: "Wrong Block",
    category: "Defense",
  },
  {
    id: "got-crossed-up",
    name: "Got Crossed Up",
    category: "Defense",
  },

  // Neutral
  {
    id: "spacing-control-lost",
    name: "Spacing Control Lost",
    category: "Neutral",
  },
  {
    id: "footsies-read",
    name: "Footsies Read",
    category: "Neutral",
  },
  {
    id: "backdash-timing",
    name: "Backdash Timing",
    category: "Neutral",
  },

  // Mental
  {
    id: "downloaded-opponent",
    name: "Downloaded Opponent",
    category: "Mental",
  },
  {
    id: "need-to-adapt",
    name: "Need to Adapt",
    category: "Mental",
  },
  {
    id: "good-adaptation",
    name: "Good Adaptation",
    category: "Mental",
  },

  // Execution
  {
    id: "input-error",
    name: "Input Error",
    category: "Execution",
  },
  {
    id: "timing-issue",
    name: "Timing Issue",
    category: "Execution",
  },
  {
    id: "combo-route-choice",
    name: "Combo Route Choice",
    category: "Execution",
  },

  // Okizeme
  {
    id: "oki-setup-missed",
    name: "Oki Setup Missed",
    category: "Okizeme",
  },
  {
    id: "pressure-gap",
    name: "Pressure Gap",
    category: "Okizeme",
  },
];
