/**
 * The Death Note rulebook — plain-language paraphrases, never verbatim rule text.
 *
 * Numbering follows the "How to Use It" pages printed between manga chapters (I–LXVI in
 * volumes 1–11, unnumbered closing pages in volume 12, LXVII in the 2020 one-shot), as tabulated
 * by the Death Note Wiki. "—" marks rules with no number of their own.
 *
 * Canon labels:
 *  - `both`: in the manga, and verified in the anime — either as an on-screen rule card (the
 *    anime shows numbered rules around its commercial breaks; cards verified for rules between
 *    How to Use I and XVI, Eps. 1–20) or because an episode states or plays out the rule.
 *  - `manga`: could not be verified in the anime, so treated as manga-only.
 *
 * Research notes, open questions and the full source list:
 * docs/content/rules-and-mechanics.md
 */
import type { Rule, RuleCategory, SourceRef } from './types';

export const RULE_CATEGORIES: Record<RuleCategory, { label: string; description: string }> = {
  writing: {
    label: 'Writing a Name',
    description:
      'What makes an entry count: a true name, a face held in mind, a page that is real.',
  },
  death: {
    label: 'Cause and Timing',
    description: 'How death arrives once the name is written, and how far the writer may steer it.',
  },
  ownership: {
    label: 'Ownership',
    description: 'Who a notebook belongs to, who can see its Shinigami, and how a claim is lost.',
  },
  memory: {
    label: 'Memory',
    description: 'What is forgotten when a notebook is given up, and what brings it back.',
  },
  transfer: {
    label: 'Pages and Passage',
    description: 'Lending, torn pages, and notebooks moving between hands and worlds.',
  },
  eyes: {
    label: 'The Eyes',
    description: 'The Shinigami Eyes: what the trade costs, what it reveals, what it cannot.',
  },
  lifespan: {
    label: 'Lifespan',
    description: 'The quiet arithmetic of years that lies beneath every entry.',
  },
  shinigami: {
    label: 'Shinigami',
    description: 'What the gods of death may do, must do, and are forbidden to do.',
  },
  limits: {
    label: 'Limits',
    description: 'Ages, thresholds and the boundaries no entry can cross.',
  },
  fake: {
    label: 'False Rules',
    description: 'Two lines Light had written into the notebook to mislead his pursuers.',
  },
};

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

const WIKI = 'https://deathnote.fandom.com/wiki/';
const EPISODE_LIST = 'https://en.wikipedia.org/wiki/List_of_Death_Note_episodes';

const RULE_TABLE: SourceRef = {
  label: 'Death Note Wiki — Manga Chapter Rules (How to Use numbering)',
  url: `${WIKI}Rules_of_the_Death_Note/Manga_Chapter_Rules`,
};
const RULE_TABLE_COPY: SourceRef = {
  label: 'How to Use I–LXVII by volume (copy of the wiki table)',
  url: 'https://shirodevil.blogspot.com/2021/07/the-rules-of-death-note.html',
};
const HOW_TO_READ: SourceRef = {
  label: 'Death Note Wiki — rules as compiled in How to Read 13',
  url: `${WIKI}Rules_of_the_Death_Note/How_to_Read_Rules`,
};
const HOW_TO_READ_TOPICS: SourceRef = {
  label: 'How to Read 13 rules grouped by subject',
  url: 'https://startracex.github.io/dn/notes/how-to-use-it',
};
const JA_WIKIPEDIA: SourceRef = {
  label: 'Japanese Wikipedia — DEATH NOTE (rules overview)',
  url: 'https://ja.wikipedia.org/wiki/DEATH_NOTE',
};
const PURSUIT_TRANSCRIPT: SourceRef = {
  label: 'Anime, Ep. 4 “Pursuit” — transcript (prisoner experiments)',
  url: `${WIKI}Pursuit/Transcript`,
};
const LOVE_EPISODE: SourceRef = {
  label: 'Anime, Ep. 12 “Love” — Gelus',
  url: `${WIKI}Love_(episode)`,
};
const SHINIGAMI_EYES: SourceRef = {
  label: 'Death Note Wiki — Shinigami Eyes',
  url: `${WIKI}Shinigami_Eyes`,
};
const MIKAMI: SourceRef = { label: 'Death Note Wiki — Teru Mikami', url: `${WIKI}Teru_Mikami` };
const HIGUCHI: SourceRef = {
  label: 'Death Note Wiki — Kyosuke Higuchi',
  url: `${WIKI}Kyosuke_Higuchi`,
};
const RYUK: SourceRef = { label: 'Death Note Wiki — Ryuk', url: `${WIKI}Ryuk` };
const FAKE_RULES: SourceRef = {
  label: 'Death Note Wiki — Fake Death Note Rules',
  url: `${WIKI}Fake_Death_Note_Rules`,
};
const MU_TALK: SourceRef = {
  label: 'Death Note Wiki — Talk: Mu (manga and anime on the afterlife)',
  url: `${WIKI}Talk:Mu`,
};
const A_KIRA: SourceRef = {
  label: 'Death Note Wiki — The a-Kira Story (2020 one-shot)',
  url: `${WIKI}The_a-Kira_Story`,
};

/** An anime episode, checked against Wikipedia's episode summaries. */
const ep = (n: number, title: string): SourceRef => ({
  label: `Anime, Ep. ${n} “${title}”`,
  url: EPISODE_LIST,
});

/** An on-screen rule card, as listed on the Death Note Wiki page for that episode. */
const card = (n: number, title: string, rules: string, page = title): SourceRef => ({
  label: `Anime, Ep. ${n} “${title}” — rule card, How to Use ${rules}`,
  url: `${WIKI}${page}`,
});

/** Every numbered rule cites the numbering table and its full copy. */
const NUMBERED = [RULE_TABLE, RULE_TABLE_COPY];

/* ------------------------------------------------------------------ */
/* Rules                                                               */
/* ------------------------------------------------------------------ */

export const RULES: readonly Rule[] = [
  /* Writing a name ---------------------------------------------------- */
  {
    id: 'name-written-dies',
    category: 'writing',
    title: 'A name becomes a death',
    plain: 'Any person whose name is written in the notebook will die.',
    detail: 'It is the first instruction inside the cover, written in English.',
    ref: 'How to Use I · 1',
    canon: 'both',
    storyRelevance:
      'Light’s first test is a hostage-taker on live television; the second, a biker ' +
      'harassing a young woman. Both die exactly as written.',
    sources: [...NUMBERED, card(1, 'Rebirth', 'I–II'), ep(1, 'Rebirth')],
  },
  {
    id: 'face-in-mind',
    category: 'writing',
    title: 'The face must be in mind',
    plain:
      'An entry only works if the writer pictures the victim’s face while writing the name — ' +
      'so others who happen to share that name are safe.',
    ref: 'How to Use I · 2',
    canon: 'both',
    storyRelevance:
      'Kira needs a face as well as a name. It is why L hides his, and why the Shinigami Eyes ' +
      'are such a prize.',
    sources: [...NUMBERED, card(1, 'Rebirth', 'I–II'), JA_WIKIPEDIA],
  },
  {
    id: 'any-writing-instrument',
    category: 'writing',
    title: 'Any ink will do',
    plain:
      'Anything that leaves legible writing directly on the page counts: pen, pencil, ' +
      'cosmetics, even blood.',
    ref: 'How to Use VII · 2',
    canon: 'both',
    sources: [...NUMBERED, card(11, 'Assault', 'VII · 2–3')],
  },
  {
    id: 'one-name-one-page',
    category: 'writing',
    title: 'One name, one page',
    plain:
      'A name split across separate pages has no effect, though the front and back of a ' +
      'single sheet count as one page.',
    detail:
      'The cause and circumstances may continue on other pages, provided the writer keeps the ' +
      'victim’s name in mind (How to Use LIV).',
    ref: 'How to Use LIII · 1–2; LIV',
    canon: 'manga',
    sources: [...NUMBERED, HOW_TO_READ_TOPICS],
  },
  {
    id: 'circumstances-first',
    category: 'writing',
    title: 'Circumstances first, name later',
    plain:
      'The cause and details may be written before the name, which must then be added in ' +
      'front of them. The writer has about 19 days to do so.',
    ref: 'How to Use VIII · 1',
    canon: 'manga',
    sources: [...NUMBERED, HOW_TO_READ_TOPICS],
  },
  {
    id: 'four-mistakes',
    category: 'writing',
    title: 'Four mistakes',
    plain:
      'If a person’s name is misspelled four times, the Death Note can no longer kill that ' +
      'person.',
    detail:
      'A later rule closes the loophole: deliberate misspellings protect no one and kill the ' +
      'writer instead.',
    ref: 'How to Use IX · 2',
    canon: 'both',
    sources: [...NUMBERED, card(13, 'Confession', 'IX · 1–2', 'Confessions'), HOW_TO_READ_TOPICS],
  },
  {
    id: 'deliberate-misspelling',
    category: 'writing',
    title: 'No misspelling on purpose',
    plain:
      'Immunity comes only from honest mistakes. Misspelling a name four times on purpose ' +
      'kills the writer, and the intended victim gains no protection.',
    ref: 'How to Use XXXV · 1–2',
    canon: 'manga',
    sources: [...NUMBERED, HOW_TO_READ],
  },
  {
    id: 'same-name-two-notebooks',
    category: 'writing',
    title: 'Two notebooks, one name',
    plain:
      'If the same person is written in two or more notebooks and the entries are completed ' +
      'within 0.06 seconds of each other, they count as simultaneous — and the person does ' +
      'not die.',
    detail:
      'Otherwise, whichever entry was completed first is the one that takes effect ' +
      '(How to Use XV · 1).',
    ref: 'How to Use XV · 1–2',
    canon: 'both',
    sources: [...NUMBERED, card(20, 'Makeshift', 'XV · 2, XVI · 1'), HOW_TO_READ],
  },
  {
    id: 'corrections',
    category: 'writing',
    title: 'Corrections, not reprieves',
    plain:
      'Within 6 minutes 40 seconds, the time and circumstances of a death may be changed by ' +
      'striking them through with two straight lines. The name itself can never be cancelled: ' +
      'erasers, correction fluid and overwriting change nothing.',
    ref: 'How to Use XI · 1–2; XLI; LXI',
    canon: 'manga',
    sources: [...NUMBERED, HOW_TO_READ_TOPICS, JA_WIKIPEDIA],
  },

  /* Cause and timing -------------------------------------------------- */
  {
    id: 'forty-seconds',
    category: 'death',
    title: 'Forty seconds to name a cause',
    plain: 'A cause of death written within 40 seconds of the name will come to pass.',
    ref: 'How to Use I · 3',
    canon: 'both',
    storyRelevance:
      'For his second test Light writes a traffic accident. Forty seconds later, a truck ' +
      'strikes the man.',
    sources: [...NUMBERED, card(1, 'Rebirth', 'I–II'), ep(1, 'Rebirth')],
  },
  {
    id: 'heart-attack-default',
    category: 'death',
    title: 'The default is a heart attack',
    plain: 'If no cause is written, the victim dies of a heart attack.',
    ref: 'How to Use I · 4',
    canon: 'both',
    storyRelevance: 'A wave of heart attacks among criminals becomes Kira’s signature.',
    sources: [...NUMBERED, card(1, 'Rebirth', 'I–II'), ep(2, 'Confrontation')],
  },
  {
    id: 'six-forty-details',
    category: 'death',
    title: 'Six minutes forty for the details',
    plain:
      'Once the cause is written, the writer has 6 minutes and 40 seconds to set down the ' +
      'circumstances of the death.',
    ref: 'How to Use I · 5',
    canon: 'both',
    sources: [...NUMBERED, card(1, 'Rebirth', 'I–II'), JA_WIKIPEDIA],
  },
  {
    id: 'scheduled-heart-attack',
    category: 'death',
    title: 'A heart attack on schedule',
    plain:
      'When the cause is a heart attack, a time of death written within the next 40 seconds ' +
      'lets the death be scheduled rather than immediate.',
    detail:
      'The official English wording is unclear about the earliest possible moment; what it ' +
      'establishes is that the time of death can be set.',
    ref: 'How to Use III · 1',
    canon: 'both',
    storyRelevance: 'Light’s prisoner experiments fix the hour at which his test subjects die.',
    sources: [...NUMBERED, card(2, 'Confrontation', 'III'), PURSUIT_TRANSCRIPT],
  },
  {
    id: 'physically-possible',
    category: 'death',
    title: 'Only what is possible',
    plain:
      'Written circumstances only come true if the victim could physically carry them out, or ' +
      'could plausibly be expected to. Otherwise the victim simply dies of a heart attack.',
    detail:
      'Not even Shinigami know exactly where that line falls; an owner has to find it by ' +
      'experiment (How to Use VI · 2).',
    ref: 'How to Use VI · 1',
    canon: 'both',
    storyRelevance:
      'Light probes the boundary on prisoners. Those given impossible instructions die of ' +
      'heart attacks instead.',
    sources: [...NUMBERED, card(9, 'Encounter', 'V · 4, VI · 1'), PURSUIT_TRANSCRIPT],
  },
  {
    id: 'suicide-is-valid',
    category: 'death',
    title: 'Suicide counts',
    plain:
      'Suicide is accepted as a cause of death, since any human could conceivably take their ' +
      'own life.',
    ref: 'How to Use X · 1',
    canon: 'both',
    storyRelevance:
      'Light writes Naomi Misora’s death as a suicide. She disappears, and her body is never ' +
      'found.',
    sources: [...NUMBERED, card(14, 'Friend', 'X · 1–2'), ep(7, 'Overcast')],
  },
  {
    id: 'no-collateral-deaths',
    category: 'death',
    title: 'One name, one death',
    plain:
      'If the death as written would directly kill people whose names were not written, the ' +
      'victim dies of a heart attack instead.',
    detail:
      'The manga applies the same safeguard to vague accidents: “dies in an accident” brings ' +
      'a natural-looking accident 6 minutes 40 seconds later, unless it would claim others ' +
      '(How to Use XXVI · 1–2).',
    ref: 'How to Use X · 2',
    canon: 'both',
    sources: [...NUMBERED, card(14, 'Friend', 'X · 1–2'), HOW_TO_READ_TOPICS],
  },
  {
    id: 'no-reprieve',
    category: 'death',
    title: 'No reprieve',
    plain: 'Once a name has been written, that person’s death cannot be prevented.',
    ref: 'How to Use XI · 3',
    canon: 'both',
    sources: [...NUMBERED, card(16, 'Decision', 'XI · 3, XII · 1', 'Decision_(episode)')],
  },
  {
    id: 'twenty-three-days',
    category: 'death',
    title: 'The 23-day horizon',
    plain:
      'Circumstances and a time of death can only be arranged within 23 days. The notebook ' +
      'cannot schedule a death further ahead than that.',
    detail:
      'Known as the 23-day rule. The exception is a named disease that naturally takes longer ' +
      'to kill (How to Use XXVIII · 1).',
    ref: 'How to Use XXVII · 2',
    canon: 'manga',
    sources: [...NUMBERED, HOW_TO_READ_TOPICS, JA_WIKIPEDIA],
  },
  {
    id: 'death-by-disease',
    category: 'death',
    title: 'Death by disease',
    plain:
      'A named disease needs enough time to run its course; if too little is allowed, the ' +
      'victim has a heart attack 6 minutes 40 seconds later. Writing “disease” without naming ' +
      'one produces a fitting illness.',
    ref: 'How to Use XXVII · 1–2; XXVIII · 1',
    canon: 'manga',
    sources: [...NUMBERED, HOW_TO_READ_TOPICS],
  },
  {
    id: 'destroying-saves-no-one',
    category: 'death',
    title: 'Destroying the notebook saves no one',
    plain:
      'A completed entry still comes true if the notebook is destroyed afterwards. Destroying ' +
      'it mid-entry does not help either: the victim dies of a heart attack, or of the cause ' +
      'already written.',
    detail:
      'Compare the false rule Light planted, which claimed that destroying the notebook would ' +
      'kill everyone who had ever touched it.',
    ref: 'How to Use LXII · 1–3',
    canon: 'manga',
    sources: [...NUMBERED, HOW_TO_READ_TOPICS],
  },

  /* Ownership --------------------------------------------------------- */
  {
    id: 'human-world-property',
    category: 'ownership',
    title: 'Finders keepers',
    plain:
      'Once a notebook touches the ground of the human world, it becomes the property of the ' +
      'human world, and the person who takes it up becomes its owner.',
    ref: 'How to Use II · 1',
    canon: 'both',
    storyRelevance: 'Ryuk tells Light at their first meeting that the notebook is now his.',
    sources: [...NUMBERED, card(1, 'Rebirth', 'I–II'), ep(1, 'Rebirth')],
  },
  {
    id: 'owner-sees-shinigami',
    category: 'ownership',
    title: 'The owner sees its Shinigami',
    plain: 'The owner of a notebook can see and hear the Shinigami it came from.',
    ref: 'How to Use II · 2',
    canon: 'both',
    sources: [...NUMBERED, card(1, 'Rebirth', 'I–II'), ep(1, 'Rebirth')],
  },
  {
    id: 'touch-to-see',
    category: 'ownership',
    title: 'Touch the notebook, see the god',
    plain:
      'Anyone who touches a notebook, even a single torn page, can see and hear its ' +
      'Shinigami, whether or not they own it.',
    ref: 'How to Use III · 2',
    canon: 'both',
    storyRelevance:
      'Light lets a bus hijacker brush a torn page so that Ryuk suddenly appears to him. Later ' +
      'the task force first sees a Shinigami by handling the notebook seized from Higuchi.',
    sources: [...NUMBERED, card(2, 'Confrontation', 'III'), ep(4, 'Pursuit'), ep(24, 'Revival')],
  },
  {
    id: 'haunted-until-death',
    category: 'ownership',
    title: 'Haunted until death',
    plain: 'The Shinigami a notebook came from stays with its owner until the owner dies.',
    ref: 'How to Use IV · 1',
    canon: 'both',
    sources: [...NUMBERED, card(3, 'Dealings', 'IV · 1')],
  },
  {
    id: 'lost-490-days',
    category: 'ownership',
    title: 'The 490-day grace period',
    plain:
      'An owner whose notebook is lost or stolen loses ownership unless they recover it ' +
      'within 490 days.',
    ref: 'How to Use XII · 1',
    canon: 'both',
    sources: [
      ...NUMBERED,
      card(16, 'Decision', 'XI · 3, XII · 1', 'Decision_(episode)'),
      JA_WIKIPEDIA,
    ],
  },
  {
    id: 'ownership-passes',
    category: 'ownership',
    title: 'When the owner dies',
    plain:
      'If an owner dies while the notebook is lent out, ownership passes to whoever holds it. ' +
      'Someone who steals a notebook and kills its owner likewise becomes the new owner.',
    ref: 'How to Use XIV · 1–2',
    canon: 'manga',
    sources: [...NUMBERED, JA_WIKIPEDIA],
  },

  /* Memory ------------------------------------------------------------ */
  {
    id: 'giving-up-erases-memory',
    category: 'memory',
    title: 'To give it up is to forget',
    plain:
      'A person who gives up ownership forgets everything connected with the notebook — and ' +
      'only that. The rest of their memories from the same period remain.',
    ref: 'How to Use XII · 2; XXII',
    canon: 'both',
    storyRelevance:
      'Misa, then Light, renounce their notebooks while confined. Light emerges with no memory ' +
      'of being Kira and joins the hunt for him in earnest.',
    sources: [
      ...NUMBERED,
      card(17, 'Execution', 'XII · 2, XIII · 1'),
      ep(15, 'Wager'),
      ep(16, 'Decision'),
    ],
  },
  {
    id: 'touch-to-remember',
    category: 'memory',
    title: 'A touch brings it back',
    plain:
      'Lost memories return when the person regains ownership of the notebook they used, or ' +
      'simply touches it again.',
    detail:
      'During the Yotsuba case Rem brings Misa a portion of a notebook: Misa can see Rem ' +
      'again, but her memories do not return.',
    ref: 'How to Use XXXVII · 1–2',
    canon: 'both',
    storyRelevance:
      'Light takes hold of the notebook recovered from Higuchi and everything returns at once; ' +
      'Misa recovers hers when she digs up the notebook Light buried.',
    sources: [...NUMBERED, ep(21, 'Performance'), ep(24, 'Revival')],
  },
  {
    id: 'six-restorations',
    category: 'memory',
    title: 'Six chances to remember',
    plain:
      'Memories of a notebook can be recovered this way up to six times per notebook. After ' +
      'that they are gone for good, and the person would have to use it as if for the first ' +
      'time.',
    ref: 'How to Use XXXVIII · 1–2',
    canon: 'manga',
    sources: [...NUMBERED, JA_WIKIPEDIA],
  },
  {
    id: 'no-kill-no-forgetting',
    category: 'memory',
    title: 'No kill, no forgetting',
    plain:
      'Memory loss only touches someone who has killed with the notebook. An owner who never ' +
      'used it keeps their memories when ownership ends, though they lose sight of its ' +
      'Shinigami and any Eyes they traded for.',
    ref: 'How to Use XLVII',
    canon: 'manga',
    sources: [...NUMBERED, JA_WIKIPEDIA],
  },

  /* Pages and passage ------------------------------------------------- */
  {
    id: 'pages-and-scraps',
    category: 'transfer',
    title: 'A scrap is enough',
    plain: 'A single page, or even a torn fragment of one, carries the notebook’s full power.',
    ref: 'How to Use VII · 1',
    canon: 'both',
    storyRelevance:
      'Light kills on camera from behind a bag of crisps, and keeps a scrap hidden in his ' +
      'wristwatch. Takada later asks Mikami to send her pages of her own.',
    sources: [...NUMBERED, ep(8, 'Glare'), ep(24, 'Revival'), ep(33, 'Scorn'), ep(35, 'Malice')],
  },
  {
    id: 'lending',
    category: 'transfer',
    title: 'Lending without letting go',
    plain: 'An owner may lend the notebook to someone else and remain its owner.',
    detail:
      'The Shinigami stays with the owner rather than the borrower (How to Use XIII · 2), and ' +
      'only an owner can trade for the Eyes.',
    ref: 'How to Use XIII · 1–2',
    canon: 'both',
    storyRelevance:
      'Before Soichiro’s eye deal, Light gives up ownership of his own notebook and borrows ' +
      'Misa’s instead.',
    sources: [...NUMBERED, card(17, 'Execution', 'XII · 2, XIII · 1'), ep(29, 'Father')],
  },
  {
    id: 'notebook-outlives-shinigami',
    category: 'transfer',
    title: 'The notebook outlives its god',
    plain: 'When a Shinigami dies, its notebook remains — and keeps its power.',
    ref: 'How to Use XVII · 2',
    canon: 'both',
    storyRelevance:
      'The notebook Rem brings Misa is the one Gelus left behind. After Rem’s own death, Light ' +
      'quietly takes hers.',
    sources: [...NUMBERED, LOVE_EPISODE, ep(25, 'Silence')],
  },
  {
    id: 'shinigami-retrieval',
    category: 'transfer',
    title: 'A Shinigami may come to collect',
    plain:
      'A Shinigami whose notebook has ended up in human hands may stay in the human world ' +
      'until it gets the notebook back.',
    detail:
      'The manga spells out the conditions: the Shinigami must touch the notebook and haunt ' +
      'whoever holds it, waiting for that person to die or give it up (How to Use XLIV · 2).',
    ref: 'How to Use XLIII · 1',
    canon: 'both',
    storyRelevance:
      'Sidoh comes down to recover his lost notebook and finds it in the hands of Mello’s ' +
      'gang; Light eventually returns it to him.',
    sources: [...NUMBERED, ep(28, 'Impatience'), ep(29, 'Father')],
  },
  {
    id: 'no-buying-or-selling',
    category: 'transfer',
    title: 'Not for sale',
    plain: 'A Death Note may not be bought or sold. Anyone who sells one, or buys one, dies.',
    detail:
      'Added by the King of Death in the 2020 one-shot set after the main story, long after ' +
      'the anime.',
    ref: 'How to Use LXVII',
    canon: 'manga',
    sources: [...NUMBERED, A_KIRA, JA_WIKIPEDIA],
  },

  /* The Eyes ---------------------------------------------------------- */
  {
    id: 'eye-deal',
    category: 'eyes',
    title: 'The Eyes, for half a life',
    plain:
      'An owner may give the Shinigami half of their remaining life in exchange for its eyes, ' +
      'which reveal the name and lifespan of anyone whose face they see.',
    ref: 'How to Use V · 3',
    canon: 'both',
    storyRelevance:
      'Ryuk offers Light the trade early on and Light refuses. Misa, Higuchi, Soichiro and ' +
      'Mikami all accept.',
    sources: [
      ...NUMBERED,
      ep(3, 'Dealings'),
      ep(11, 'Assault'),
      ep(23, 'Frenzy'),
      ep(29, 'Father'),
      HIGUCHI,
      MIKAMI,
    ],
  },
  {
    id: 'owners-lifespans-hidden',
    category: 'eyes',
    title: 'Owners’ lifespans stay hidden',
    plain:
      'The Eyes cannot show the lifespan of anyone who owns a Death Note — the viewer ' +
      'included.',
    ref: 'How to Use XVIII · 2',
    canon: 'both',
    storyRelevance:
      'Misa picks out Light as Kira because his lifespan is the one she cannot see. Soichiro, ' +
      'given the Eyes at the end of his life, can see his son’s — and dies believing Light ' +
      'cannot be Kira.',
    sources: [...NUMBERED, ep(13, 'Confession'), ep(29, 'Father'), SHINIGAMI_EYES],
  },
  {
    id: 'eyes-lost-with-ownership',
    category: 'eyes',
    title: 'The Eyes go; the price stays',
    plain:
      'Giving up ownership takes the Eyes away along with the memories, but the half of a ' +
      'lifetime already paid is never returned.',
    ref: 'How to Use XII · 2',
    canon: 'both',
    sources: [...NUMBERED, card(17, 'Execution', 'XII · 2, XIII · 1'), JA_WIKIPEDIA],
  },
  {
    id: 'trade-again',
    category: 'eyes',
    title: 'A second trade, a second halving',
    plain:
      'Someone who has lost the Eyes can trade for them again, paying half of whatever life ' +
      'remains at that point.',
    detail:
      'There is no numbered rule for this; it follows from How to Use V · 3 and XII · 2 and ' +
      'is shown in the story.',
    ref: '—',
    canon: 'both',
    storyRelevance:
      'Misa makes the trade twice — first with Rem, then with Ryuk after recovering her ' +
      'notebook — halving what remains of her life each time.',
    sources: [ep(11, 'Assault'), ep(24, 'Revival'), JA_WIKIPEDIA, SHINIGAMI_EYES],
  },
  {
    id: 'more-than-half-a-face',
    category: 'eyes',
    title: 'More than half a face',
    plain:
      'The Eyes need more than half of a person’s face in view. A partly hidden face still ' +
      'works if enough of it can be seen.',
    ref: 'How to Use XX · 1',
    canon: 'manga',
    sources: [...NUMBERED, SHINIGAMI_EYES],
  },
  {
    id: 'photographs-not-drawings',
    category: 'eyes',
    title: 'Photographs, never drawings',
    plain:
      'A photograph works however old it is, though its clarity and size can matter. A ' +
      'drawing never works, however lifelike.',
    ref: 'How to Use XX · 2',
    canon: 'manga',
    sources: [...NUMBERED, SHINIGAMI_EYES],
  },
  {
    id: 'keener-sight',
    category: 'eyes',
    title: 'Keener sight',
    plain:
      'Whatever their eyesight before, a person with the Eyes gains vision of 3.6 or better ' +
      'on the decimal scale used in Japanese eye tests.',
    ref: 'How to Use XXI',
    canon: 'manga',
    sources: [...NUMBERED, JA_WIKIPEDIA],
  },
  {
    id: 'true-name-original-span',
    category: 'eyes',
    title: 'The true name, the original span',
    plain:
      'The Eyes show the name needed to kill a person — their true name, even if it appears ' +
      'in no official register — and the lifespan they were originally meant to have.',
    detail: 'A life shortened indirectly by the notebook still shows its original length.',
    ref: 'How to Use XXX · 1–2',
    canon: 'manga',
    storyRelevance:
      'Aliases are worthless against the notebook: during the Yotsuba case Higuchi writes ' +
      'Matsuda’s cover name, and nothing happens.',
    sources: [...NUMBERED, SHINIGAMI_EYES, ep(23, 'Frenzy')],
  },
  {
    id: 'borrowers-cannot-trade',
    category: 'eyes',
    title: 'Borrowers cannot trade',
    plain:
      'Only an owner can make the Eye trade; someone who has merely borrowed a notebook cannot.',
    ref: 'How to Use XIII · 3',
    canon: 'manga',
    sources: [...NUMBERED, SHINIGAMI_EYES],
  },

  /* Shinigami --------------------------------------------------------- */
  {
    id: 'shinigami-neutral',
    category: 'shinigami',
    title: 'Neither help nor hindrance',
    plain:
      'In principle, the Shinigami attached to a notebook does nothing to help or to prevent ' +
      'the deaths written in it.',
    ref: 'How to Use IV · 3',
    canon: 'both',
    storyRelevance:
      'Ryuk makes a point of telling Light that he is not on his side. He is there to be ' +
      'entertained.',
    sources: [...NUMBERED, card(6, 'Unraveling', 'IV · 2–3'), ep(3, 'Dealings')],
  },
  {
    id: 'no-duty-to-explain',
    category: 'shinigami',
    title: 'No duty to explain',
    plain: 'A Shinigami need not explain the notebook or its rules to its owner unless asked.',
    ref: 'How to Use IV · 4',
    canon: 'manga',
    sources: [...NUMBERED],
  },
  {
    id: 'thirty-nine-days',
    category: 'shinigami',
    title: 'Thirty-nine days',
    plain:
      'A Shinigami must show itself to a human who has used its notebook within 39 days of ' +
      'that first use.',
    ref: 'How to Use IV · 2',
    canon: 'both',
    storyRelevance: 'Ryuk arrives five days after Light’s first entries.',
    sources: [...NUMBERED, card(6, 'Unraveling', 'IV · 2–3'), ep(1, 'Rebirth')],
  },
  {
    id: 'beyond-weapons',
    category: 'shinigami',
    title: 'Beyond the reach of weapons',
    plain:
      'A knife through the heart or a bullet to the head cannot kill a Shinigami. Other ways ' +
      'exist, but most Shinigami do not know them.',
    ref: 'How to Use V · 4',
    canon: 'both',
    storyRelevance: 'The terrified bus hijacker opens fire on Ryuk, who is untouched.',
    sources: [...NUMBERED, card(9, 'Encounter', 'V · 4, VI · 1'), ep(4, 'Pursuit')],
  },
  {
    id: 'shinigami-know-little',
    category: 'shinigami',
    title: 'Even the gods are guessing',
    plain:
      'Shinigami understand surprisingly little about the notebook — including the exact ' +
      'limits on which circumstances will work.',
    ref: 'How to Use VII · 3; VI · 2',
    canon: 'both',
    sources: [...NUMBERED, card(11, 'Assault', 'VII · 2–3')],
  },
  {
    id: 'keeps-own-notebook',
    category: 'shinigami',
    title: 'Every Shinigami keeps one',
    plain:
      'A Shinigami must always own at least one notebook, which may never be lent to a human ' +
      'or written in by one.',
    detail: 'Shinigami may swap notebooks among themselves (How to Use XVI · 2).',
    ref: 'How to Use XVI · 1',
    canon: 'both',
    storyRelevance:
      'Ryuk never parts with his own notebook. The one that falls to Light is a second ' +
      'notebook he had obtained.',
    sources: [...NUMBERED, card(20, 'Makeshift', 'XV · 2, XVI · 1'), RYUK],
  },
  {
    id: 'love-is-fatal',
    category: 'shinigami',
    title: 'Love is fatal',
    plain:
      'A Shinigami that kills with its notebook in order to lengthen the life of a human it ' +
      'cares for will die — though the human’s life is extended.',
    detail:
      'A later rule restates it: a Shinigami that deliberately extends a human’s life dies, ' +
      'while a human who does the same does not (How to Use LVIII · 2).',
    ref: 'How to Use XVII · 1',
    canon: 'both',
    storyRelevance:
      'Gelus dies saving Misa from a stalker. Rem dies the same way when she kills L and ' +
      'Watari to protect Misa — exactly as Light intended.',
    sources: [...NUMBERED, LOVE_EPISODE, ep(12, 'Love'), ep(25, 'Silence')],
  },
  {
    id: 'who-may-kill-an-owner',
    category: 'shinigami',
    title: 'Only one may kill the owner',
    plain:
      'A Shinigami watching from its own realm cannot kill a notebook’s owner, nor can one ' +
      'that comes to the human world for that purpose. Only the Shinigami that brought the ' +
      'notebook to that human may do it.',
    ref: 'How to Use XXXIV · 1–3',
    canon: 'manga',
    sources: [...NUMBERED],
  },
  {
    id: 'the-bringer-may-end-it',
    category: 'shinigami',
    title: 'The bringer may end it',
    plain:
      'The Shinigami that brought a notebook to the human world and gave it to a human may ' +
      'kill that owner with its own notebook — for instance, because it has come to dislike ' +
      'them.',
    ref: 'How to Use LX',
    canon: 'both',
    storyRelevance:
      'At their first meeting Ryuk tells Light that he will be the one to write Light’s name. ' +
      'In the end, he does.',
    sources: [...NUMBERED, ep(1, 'Rebirth'), ep(37, 'New World')],
  },
  {
    id: 'names-are-not-told',
    category: 'shinigami',
    title: 'Names are not for telling',
    plain: 'A Shinigami must not tell humans the names or lifespans it sees.',
    ref: 'How to Use XVIII · 3',
    canon: 'manga',
    sources: [...NUMBERED, SHINIGAMI_EYES],
  },

  /* Lifespan ---------------------------------------------------------- */
  {
    id: 'life-flows-one-way',
    category: 'lifespan',
    title: 'Life flows one way',
    plain:
      'A Shinigami lengthens its own life by writing human names in its notebook. Humans ' +
      'cannot extend their lives this way; for them the notebook can only cost life.',
    detail: 'The anime’s account of Gelus rests on the same economy of lifespans.',
    ref: 'How to Use V · 1–2',
    canon: 'manga',
    sources: [...NUMBERED, LOVE_EPISODE],
  },
  {
    id: 'no-death-beyond-fate',
    category: 'lifespan',
    title: 'No death beyond fate',
    plain:
      'A death cannot be set for later than the end of the victim’s original lifespan. If it ' +
      'is, the victim dies when that lifespan runs out.',
    ref: 'How to Use LVII',
    canon: 'manga',
    sources: [...NUMBERED, HOW_TO_READ_TOPICS],
  },
  {
    id: 'ripples',
    category: 'lifespan',
    title: 'Ripples',
    plain:
      'A death caused by the notebook can indirectly lengthen other people’s lives, even when ' +
      'no one intends it. For a human writer there is no penalty.',
    ref: 'How to Use LVIII · 1; LIX',
    canon: 'manga',
    sources: [...NUMBERED, HOW_TO_READ_TOPICS],
  },

  /* Limits ------------------------------------------------------------ */
  {
    id: 'neither-heaven-nor-hell',
    category: 'limits',
    title: 'Neither Heaven nor Hell',
    plain: 'A human who uses the Death Note can go to neither Heaven nor Hell.',
    ref: 'How to Use II · 3',
    canon: 'both',
    storyRelevance: 'Ryuk tells Light this at their first meeting.',
    sources: [...NUMBERED, card(1, 'Rebirth', 'I–II'), RYUK],
  },
  {
    id: 'too-young',
    category: 'limits',
    title: 'Too young to be written',
    plain:
      'The Death Note has no effect on anyone less than 780 days old — a little over two years.',
    ref: 'How to Use IX · 1',
    canon: 'both',
    sources: [...NUMBERED, card(13, 'Confession', 'IX · 1–2', 'Confessions'), JA_WIKIPEDIA],
  },
  {
    id: 'too-old',
    category: 'limits',
    title: 'Beyond its reach by age',
    plain: 'Nobody aged 124 or older can be killed with the Death Note.',
    ref: 'How to Use XXIX · 1',
    canon: 'manga',
    sources: [...NUMBERED, JA_WIKIPEDIA, HOW_TO_READ_TOPICS],
  },
  {
    id: 'final-twelve-minutes',
    category: 'limits',
    title: 'The final twelve minutes',
    plain: 'Nor can it kill someone whose original lifespan has less than 12 minutes left to run.',
    ref: 'How to Use XXIX · 2',
    canon: 'manga',
    sources: [...NUMBERED, JA_WIKIPEDIA, HOW_TO_READ_TOPICS],
  },
  {
    id: 'six-notebooks',
    category: 'limits',
    title: 'Six at most',
    plain:
      'No more than six Death Notes can be at work in the human world at once, not counting ' +
      'the Shinigami’s own. A seventh stays powerless until one of the six is burned or taken ' +
      'back to the Shinigami realm.',
    detail: 'A single Shinigami may hand notebooks to no more than three humans at a time.',
    ref: 'How to Use XLIX–LII',
    canon: 'manga',
    sources: [...NUMBERED],
  },
  {
    id: 'nothingness',
    category: 'limits',
    title: 'Nothingness',
    plain:
      'Every human dies in the end. Afterwards they go to Mu — nothingness — and once dead, ' +
      'no one ever returns.',
    detail:
      'From the unnumbered rule pages that close the final volume. The anime never states it ' +
      'outright.',
    ref: '—',
    canon: 'manga',
    sources: [...NUMBERED, MU_TALK],
  },

  /* False rules ------------------------------------------------------- */
  {
    id: 'thirteen-day-rule',
    category: 'fake',
    title: 'The thirteen-day rule',
    plain:
      'Claims that anyone who has written in the notebook must write another name within 13 ' +
      'days of the last, or die.',
    detail:
      'False. Light had Ryuk write it into the notebook so that he and Misa — held in ' +
      'custody for more than fifty days without writing anything — would appear innocent.',
    ref: '—',
    canon: 'both',
    fake: true,
    storyRelevance:
      'It clears Light and Misa when the task force reads the notebook. Sidoh later tells ' +
      'Mello it is false, and Near proposes putting it to the test.',
    sources: [ep(24, 'Revival'), ep(29, 'Father'), ep(30, 'Justice'), FAKE_RULES],
  },
  {
    id: 'destruction-rule',
    category: 'fake',
    title: 'Destroy it, and all who touched it die',
    plain:
      'Claims that if the notebook is made unusable — torn up or burned — everyone who has ' +
      'ever touched it will die.',
    detail:
      'False, and written in at Light’s instruction alongside the thirteen-day rule. If ' +
      'believed, it makes destroying the notebook fatal to everyone who has handled it.',
    ref: '—',
    canon: 'both',
    fake: true,
    storyRelevance:
      'The task force reads it with the thirteen-day rule. In the manga’s closing chapters ' +
      'Ryuk confirms both are lies, and Near has the notebooks burned.',
    sources: [ep(24, 'Revival'), FAKE_RULES, JA_WIKIPEDIA],
  },
];
