export type NoteTemplate = {
  id: string;
  name: string;
  content: string;
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

export const NOTE_TEMPLATES: NoteTemplate[] = [
  // Offense
  {
    id: "dropped-combo",
    name: "Dropped Combo",
    content:
      "Dropped combo. Need to practice [specific input] execution.",
    category: "Offense",
  },
  {
    id: "missed-punish",
    name: "Missed Punish",
    content:
      "Opponent was minus/unsafe. Should have punished with [move].",
    category: "Offense",
  },
  {
    id: "reset-opportunity",
    name: "Reset Opportunity",
    content:
      "Had reset potential here. Could have extended pressure instead of letting them recover.",
    category: "Offense",
  },
  {
    id: "frame-trap-failed",
    name: "Frame Trap Failed",
    content:
      "Frame trap gap too big. Need tighter sequencing with [move A] into [move B].",
    category: "Offense",
  },
  {
    id: "whiff-punish",
    name: "Whiff Punish",
    content:
      "Opponent whiffed [move]. Should have punished from this range.",
    category: "Offense",
  },

  // Defense
  {
    id: "failed-anti-air",
    name: "Failed Anti-Air",
    content:
      "Got jumped in on. Didn't anti-air in time or picked wrong option.",
    category: "Defense",
  },
  {
    id: "bad-wakeup",
    name: "Bad Wakeup Choice",
    content:
      "Wakeup reversal got baited. Should block on wakeup most of the time.",
    category: "Defense",
  },
  {
    id: "throw-tech-missed",
    name: "Throw Tech Missed",
    content:
      "Got thrown. Need to stay alert and tech during pressure.",
    category: "Defense",
  },
  {
    id: "wrong-block",
    name: "Wrong Block",
    content:
      "Got hit low/overhead. Need to adjust blocking during mixup strings.",
    category: "Defense",
  },
  {
    id: "got-crossed-up",
    name: "Got Crossed Up",
    content:
      "Didn't adjust block direction on crossup fast enough.",
    category: "Defense",
  },

  // Neutral
  {
    id: "spacing-control-lost",
    name: "Spacing Control Lost",
    content:
      "Got pushed into corner too easily. Need better footsies to control space.",
    category: "Neutral",
  },
  {
    id: "footsies-read",
    name: "Footsies Read",
    content:
      "Good read on opponent's poke pattern. Capitalize on this spacing next time.",
    category: "Neutral",
  },
  {
    id: "backdash-timing",
    name: "Backdash Timing",
    content:
      "Backdash too slow to escape pressure. Either backdash earlier or find safer option.",
    category: "Neutral",
  },

  // Mental
  {
    id: "downloaded-opponent",
    name: "Downloaded Opponent",
    content:
      "Opponent keeps using [pattern]. Counter with [strategy] next time.",
    category: "Mental",
  },
  {
    id: "need-to-adapt",
    name: "Need to Adapt",
    content:
      "They figured out my [strategy]. Have to mix up approach.",
    category: "Mental",
  },
  {
    id: "good-adaptation",
    name: "Good Adaptation",
    content:
      "Adjusted to opponent's [habit] and it worked. Keep this read.",
    category: "Mental",
  },

  // Execution
  {
    id: "input-error",
    name: "Input Error",
    content:
      "Special move didn't come out. Likely dropped the motion input.",
    category: "Execution",
  },
  {
    id: "timing-issue",
    name: "Timing Issue",
    content:
      "Link wasn't tight enough. [Move A] to [Move B] needs more practice.",
    category: "Execution",
  },
  {
    id: "combo-route-choice",
    name: "Combo Route Choice",
    content:
      "Used suboptimal combo route. Better option available for more damage/oki.",
    category: "Execution",
  },

  // Okizeme
  {
    id: "oki-setup-missed",
    name: "Oki Setup Missed",
    content:
      "Got knockdown but wasted the advantage. Should have done [oki option].",
    category: "Okizeme",
  },
  {
    id: "pressure-gap",
    name: "Pressure Gap",
    content:
      "Left a gap in pressure. Opponent mashed out. Tighten up blockstring.",
    category: "Okizeme",
  },
];
