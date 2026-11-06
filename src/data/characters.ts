/**
 * Character archive — one profile for every id in CHARACTER_IDS.
 *
 * Tiers follow SPEC §4.4. Japanese names are given only where verified against the
 * English and Japanese Wikipedia character lists. Real names that the story itself never
 * states (L, Near, Mello, Matt, the SPK agents, Aiber, Wedy) come from official supplementary
 * material — chiefly the guidebook Death Note 13: How to Read (2006) — and each profile's
 * `canonNotes` says how the name was revealed. Dates follow the manga's chronology; the anime
 * runs its calendar three years later.
 *
 * Research notes and sources: docs/content/story-reference.md
 */
import type { CharacterProfile, SourceRef } from './types';

const EPISODE_LIST: SourceRef = {
  label: 'Wikipedia — List of Death Note episodes',
  url: 'https://en.wikipedia.org/wiki/List_of_Death_Note_episodes',
};
const CHARACTERS_EN: SourceRef = {
  label: 'Wikipedia — List of Death Note characters',
  url: 'https://en.wikipedia.org/wiki/List_of_Death_Note_characters',
};
const CHARACTERS_JA: SourceRef = {
  label: 'Wikipedia (Japanese) — DEATH NOTEの登場人物',
  url: 'https://ja.wikipedia.org/wiki/DEATH_NOTEの登場人物',
};
const EPISODES_IT: SourceRef = {
  label: 'Wikipedia (Italian) — Episodi di Death Note',
  url: 'https://it.wikipedia.org/wiki/Episodi_di_Death_Note',
};
const EPISODES_ES: SourceRef = {
  label: 'Wikipedia (Spanish) — Episodios de Death Note',
  url: 'https://es.wikipedia.org/wiki/Anexo:Episodios_de_Death_Note',
};
const LIGHT_EN: SourceRef = {
  label: 'Wikipedia — Light Yagami',
  url: 'https://en.wikipedia.org/wiki/Light_Yagami',
};
const LIGHT_JA: SourceRef = {
  label: 'Wikipedia (Japanese) — 夜神月',
  url: 'https://ja.wikipedia.org/wiki/夜神月',
};
const L_EN: SourceRef = {
  label: 'Wikipedia — L (Death Note)',
  url: 'https://en.wikipedia.org/wiki/L_(Death_Note)',
};
const RYUK_EN: SourceRef = {
  label: 'Wikipedia — Ryuk (Death Note)',
  url: 'https://en.wikipedia.org/wiki/Ryuk_(Death_Note)',
};
const MISA_EN: SourceRef = {
  label: 'Wikipedia — Misa Amane',
  url: 'https://en.wikipedia.org/wiki/Misa_Amane',
};
const MELLO_EN: SourceRef = {
  label: 'Wikipedia — Mello (Death Note)',
  url: 'https://en.wikipedia.org/wiki/Mello_(Death_Note)',
};
const GWERN: SourceRef = {
  label: 'Gwern Branwen — “Death Note’s Ending” (citing How to Read 13)',
  url: 'https://gwern.net/Death%20Note%20Ending',
};

export const CHARACTERS: readonly CharacterProfile[] = [
  /* Tier 1 ----------------------------------------------------------- */
  {
    id: 'light',
    name: 'Light Yagami',
    nameJa: '夜神 月',
    aliases: ['Kira', 'L (to the task force, after L’s death)'],
    role: 'Top student who becomes Kira',
    affiliation: 'kira',
    tier: 1,
    introduced: { episode: 1, chapter: 'light' },
    summary:
      'A brilliant, outwardly model high-school student and the son of a senior police officer, Light finds a Shinigami’s notebook and decides to use it to rid the world of criminals. As Kira he becomes the target of a worldwide manhunt — and, in time, one of its leaders — matching wits first with L and then with L’s successors.',
    personality:
      'Disciplined, charming and immensely capable, Light begins with a sincere, absolute conviction that removing the wicked will build a just and peaceful world. Power hardens that conviction into self-deification: anyone who obstructs him becomes expendable, and he manipulates even those who love him. The story never reduces him to a cartoon — his belief in his own justice, and his love for his family, remain real to the end.',
    significance:
      'The protagonist and the story’s central question: what an idealistic, gifted person becomes when handed absolute power over life and death. Tsugumi Ohba has described him as a victim of the notebook as much as its wielder.',
    keyEvents: [
      'Finds the Death Note and makes his first judgments',
      'Kills Lind L. Tailor and betrays his location to L',
      'Eliminates Raye Penber and the FBI agents',
      'Meets L at To-Oh University',
      'Allies with Misa, the second Kira',
      'Gives up his memories in confinement',
      'Regains them and engineers L’s death',
      'Leads the task force as the new L',
      'Rules through Mikami and Takada',
      'Exposed by Near at the Yellow Box',
      'Dies when Ryuk writes his name',
    ],
    relationships: [
      {
        to: 'l',
        kind: 'rival',
        label: 'Adversaries turned wary colleagues — each the only equal the other finds',
      },
      {
        to: 'ryuk',
        kind: 'shinigami-bond',
        label: 'The Shinigami who follows him for amusement and promised to write his name',
      },
      { to: 'misa', kind: 'manipulates', label: 'Uses her devotion as a weapon' },
      { to: 'soichiro', kind: 'family', label: 'Father and moral anchor, deceived to the last' },
      { to: 'near', kind: 'adversary', label: 'L’s successor, who finally exposes him' },
      { to: 'mikami', kind: 'ally', label: 'Handpicked executioner who worships him as God' },
      {
        to: 'takada',
        kind: 'manipulates',
        label: 'Former girlfriend turned spokesperson, used and then sacrificed',
      },
      { to: 'sayu', kind: 'family', label: 'Younger sister who adores him' },
    ],
    fate: 'Exposed at the Yellow Box warehouse on 28 January 2010 (manga date; 2013 in the anime), shot by Matsuda as he tries to write Near’s name, and killed when Ryuk writes his name. In the anime he escapes wounded and dies alone on a warehouse stairway, seeing L; in the manga he dies inside the warehouse, begging for his life.',
    spoiler: true,
    canonNotes:
      'Born 28 February 1986 per the guidebook (1989 in the anime). The anime’s final minutes — his flight, the vision of his younger self, L’s apparition and a quiet death — are its own; in the manga he pleads with Ryuk and Mikami on the warehouse floor and Ryuk answers by writing his name.',
    sources: [LIGHT_EN, LIGHT_JA, EPISODE_LIST, CHARACTERS_EN],
  },
  {
    id: 'l',
    name: 'L',
    nameJa: 'エル',
    aliases: ['Ryuzaki', 'Hideki Ryuga', 'Eraldo Coil', 'Deneuve', 'L Lawliet (real name)'],
    role: 'The world’s greatest detective',
    affiliation: 'l',
    tier: 1,
    introduced: { episode: 2, chapter: 'l' },
    summary:
      'An anonymous detective known only by a single letter, L has solved cases worldwide through intermediaries. He takes the Kira case at Interpol’s request, traps Kira into revealing his region within days, and soon fixes on Light — whom he befriends, watches and works beside while trying to prove what he suspects.',
    personality:
      'Unconventional in every visible way — barefoot, crouched in chairs, living on sweets — L is rigorously logical yet willing to gamble, bluff and bend the rules, including his own ethics, to win. Beneath the competitiveness is a solitary figure who has trusted almost no one. He tells Light that he is his first friend, a remark that may be strategy, sincerity, or both.',
    significance:
      'Light’s mirror: an equal intellect committed to a justice bound by law. Their duel is the spine of the story’s first half, and his methods outlive him through Near and Mello.',
    keyEvents: [
      'Exposes Kira’s region with the Lind L. Tailor broadcast',
      'Profiles Kira as a student with access to police data',
      'Meets the remaining task force in person',
      'Reveals himself to Light at To-Oh University',
      'Detains Misa and confines Light',
      'Handcuffs himself to Light for the Yotsuba case',
      'Captures Higuchi and confirms that Shinigami exist',
      'Moves to test the thirteen-day rule',
      'Killed by Rem, alongside Watari',
    ],
    relationships: [
      { to: 'light', kind: 'rival', label: 'Prime suspect, partner and, perhaps, friend' },
      { to: 'watari', kind: 'ally', label: 'Guardian, handler and the one person he fully trusts' },
      { to: 'near', kind: 'successor', label: 'The successor who completes his work' },
      { to: 'mello', kind: 'successor', label: 'The successor who pursues it outside the law' },
      { to: 'misa', kind: 'adversary', label: 'Suspect he detains as the second Kira' },
      { to: 'soichiro', kind: 'colleague', label: 'Chief of the task force who stays by him' },
      { to: 'rem', kind: 'adversary', label: 'The Shinigami who ends his life to save Misa' },
    ],
    fate: 'Killed on 5 November 2004 (manga date; 2007 in the anime) when Rem writes his name to protect Misa. He dies in Light’s arms, his suspicion confirmed in a final look.',
    spoiler: true,
    canonNotes:
      'His full name, L Lawliet, was first published in the official guidebook How to Read 13; no character speaks it. The guidebook gives his birth date as 31 October 1979 (1982 in the anime). The anime adds a rain-soaked rooftop conversation with Light and a scene in which L dries Light’s feet shortly before his death.',
    sources: [L_EN, EPISODE_LIST, CHARACTERS_EN, CHARACTERS_JA],
  },
  {
    id: 'ryuk',
    name: 'Ryuk',
    nameJa: 'リューク',
    role: 'The Shinigami who drops the notebook',
    affiliation: 'shinigami',
    tier: 1,
    introduced: { episode: 1, chapter: 'shinigami' },
    summary:
      'A Shinigami bored by the stagnant realm of the gods of death, Ryuk drops a second notebook into the human world simply to see what happens. Bound to its owner, he follows Light through the story, visible only to those who have touched the notebook, and watches events unfold as entertainment.',
    personality:
      'Amused, curious and strictly neutral, Ryuk helps neither side; he volunteers information only when it entertains him and is openly indifferent to whether Light wins or loses. His craving for apples, which he likens to a human vice, is his one visible weakness.',
    significance:
      'The catalyst and the detached witness: everything begins with his boredom and ends with his pen.',
    keyEvents: [
      'Drops a second Death Note into the human world',
      'Appears to Light and explains the notebook',
      'Offers Light the Shinigami eyes',
      'Becomes tied to the notebook buried in the woods',
      'Grants Misa her second eye deal, and later Soichiro his',
      'Writes Light’s name, as he promised',
    ],
    relationships: [
      {
        to: 'light',
        kind: 'shinigami-bond',
        label: 'Owner he follows for entertainment — and whose name he promised to write',
      },
      { to: 'misa', kind: 'shinigami-bond', label: 'Grants her a second set of eyes' },
      {
        to: 'soichiro',
        kind: 'shinigami-bond',
        label: 'Grants him the eyes for the raid on Mello',
      },
      { to: 'rem', kind: 'colleague', label: 'Fellow Shinigami with very different loyalties' },
      { to: 'sidoh', kind: 'rival', label: 'The Shinigami whose notebook he took' },
    ],
    fate: 'Survives the story, having kept his promise to write Light’s name.',
    spoiler: true,
    canonNotes:
      'Ryuk claims he tricked the Shinigami King into a second notebook; Part II reveals that the notebook he dropped belonged to Sidoh. In the manga Light begs Ryuk to kill the others before Ryuk writes his name; in the anime Ryuk writes it from a distance after Light has fled.',
    sources: [RYUK_EN, EPISODE_LIST, CHARACTERS_EN, LIGHT_JA],
  },

  /* Tier 2 ----------------------------------------------------------- */
  {
    id: 'misa',
    name: 'Misa Amane',
    nameJa: '弥 海砂',
    aliases: ['Misa-Misa', 'The second Kira'],
    role: 'Model, idol and the second Kira',
    affiliation: 'kira',
    tier: 2,
    introduced: { episode: 11, chapter: 'misa' },
    summary:
      'A young model and rising idol, Misa saw her parents murdered by a burglar and came to revere Kira when the killer died. Given a notebook by the Shinigami Rem, she becomes the second Kira, finds Light through the Shinigami eyes, and devotes herself to him.',
    personality:
      'Open, impulsive and fiercely loyal, Misa is constantly underestimated — not least by Light — yet she twice gives up half her life for the eyes and, in the Yotsuba case, succeeds where L’s team cannot. Her devotion grows from grief and gratitude, and the story is unflinching about how coldly Light exploits it: she is a killer in her own right and one of the clearest victims of his manipulation.',
    significance:
      'Her eyes make Kira deadlier than ever and her arrest forces the confinement gambit; she is both Light’s most powerful asset and the measure of his cruelty.',
    keyEvents: [
      'Receives Gelus’s notebook from Rem',
      'Trades for the Shinigami eyes',
      'Speaks to the world as the second Kira through Sakura TV',
      'Finds Light in Aoyama',
      'Learns L’s name, then is arrested',
      'Gives up her notebook and her memories',
      'Draws a confession from Higuchi',
      'Recovers her memories and makes a second eye deal, with Ryuk',
      'Carries on Kira’s work into Part II',
    ],
    relationships: [
      {
        to: 'light',
        kind: 'devotion',
        label: 'Loves him without reserve; he treats her as an instrument',
      },
      {
        to: 'rem',
        kind: 'shinigami-bond',
        label: 'Protective Shinigami who gives her own life for Misa',
      },
      { to: 'gelus', kind: 'shinigami-bond', label: 'Shinigami who died to save her' },
      { to: 'ryuk', kind: 'shinigami-bond', label: 'Grants her second eye deal' },
      { to: 'l', kind: 'adversary', label: 'The detective who detains her as the second Kira' },
      { to: 'takada', kind: 'rival', label: 'Rival for Light’s attention in Part II' },
      { to: 'mogi', kind: 'colleague', label: 'Steady minder who poses as her manager' },
    ],
    fate: 'Her fate is not shown in the manga; the guidebook How to Read 13 dates her death to a little over a year after Light’s. The anime’s final glimpse of her — alone beyond a rooftop railing at sunset — leaves it open.',
    spoiler: true,
    canonNotes:
      'Born 25 December 1984 per the guidebook (1987 in the anime). Ohba later suggested she may have died by suicide in despair, but neither version depicts her death, and the anime’s official analysis guide lists her death date as unknown.',
    sources: [MISA_EN, EPISODE_LIST, EPISODES_ES, CHARACTERS_JA],
  },
  {
    id: 'rem',
    name: 'Rem',
    nameJa: 'レム',
    role: 'Shinigami devoted to Misa',
    affiliation: 'shinigami',
    tier: 2,
    introduced: { episode: 11, chapter: 'misa' },
    summary:
      'A Shinigami who saw Gelus die to save Misa, Rem carried his notebook to her and stayed at her side. She sees through Light from the start and warns him that harming Misa will cost him his life — a protectiveness Light ultimately turns against her.',
    personality:
      'Quiet, perceptive and grave, Rem is one of the few Shinigami who come to care for a human. Her love for Misa is selfless, and her clear view of Light’s character makes her his most dangerous critic; yet that same love leaves her no choice once he arranges matters so that only L’s death can save Misa.',
    significance:
      'Her sacrifice ends L’s investigation and enacts the law that destroyed Gelus: a Shinigami who kills to prolong a human life dies.',
    keyEvents: [
      'Brings Gelus’s notebook to Misa',
      'Grants Misa the Shinigami eyes',
      'Threatens Light to protect Misa',
      'Leaves with Light’s notebook and gives it to Higuchi',
      'Grants Higuchi the eyes',
      'Writes the names of Watari and L',
      'Crumbles to dust',
    ],
    relationships: [
      { to: 'misa', kind: 'devotion', label: 'Loves and protects her above all else' },
      { to: 'light', kind: 'adversary', label: 'Sees through him, yet is outmanoeuvred by him' },
      {
        to: 'gelus',
        kind: 'colleague',
        label: 'Witnessed his sacrifice and carried on his devotion',
      },
      {
        to: 'higuchi',
        kind: 'shinigami-bond',
        label: 'Tied to his notebook during the Yotsuba case',
      },
      { to: 'l', kind: 'adversary', label: 'Ends his life to save Misa' },
    ],
    fate: 'Dies on 5 November 2004 (manga date; 2007 in the anime) after writing L’s and Watari’s names, turning to dust. Light takes her notebook.',
    spoiler: true,
    canonNotes:
      'Her death and L’s follow the same course in both versions; the anime adds a rooftop scene between L and Light beforehand.',
    sources: [CHARACTERS_EN, EPISODE_LIST, EPISODES_ES, MISA_EN],
  },
  {
    id: 'near',
    name: 'Near',
    nameJa: 'ニア',
    aliases: ['N', 'Nate River (real name)'],
    role: 'L’s successor and head of the SPK',
    affiliation: 'spk',
    tier: 2,
    introduced: { episode: 26, chapter: 'successors' },
    summary:
      'Raised at Wammy’s House as one of the candidates to succeed L, Near is a quiet, detached prodigy who thinks best with a puzzle or a toy in his hands. After L’s death he forms the SPK with the backing of the US government, soon concludes that the new “L” guiding the Japanese task force is Kira, and sets out to prove it.',
    personality:
      'Calm, methodical and unsentimental, Near treats the case as a puzzle, building models and arranging finger puppets as he reasons. He is willing to take risks and to bait his opponent openly, and he is clear-eyed enough to acknowledge that he could not have surpassed L alone — the victory owes as much to Mello’s recklessness as to his own patience.',
    significance:
      'The detective who completes L’s work, exposing Light at the Yellow Box with help Mello never intended to give.',
    keyEvents: [
      'Learns of L’s death at Wammy’s House',
      'Founds the SPK',
      'Loses most of his team to Mello’s notebook',
      'Receives Mello’s warning about the false rule',
      'Escapes Kira’s mob in New York',
      'Identifies Mikami as X-Kira',
      'Has the real notebook replaced with a copy',
      'Exposes Light at the Yellow Box',
    ],
    relationships: [
      {
        to: 'mello',
        kind: 'rival',
        label: 'Fellow successor whose reckless move hands him victory',
      },
      { to: 'l', kind: 'successor', label: 'The detective whose work he completes' },
      { to: 'light', kind: 'adversary', label: 'The Kira he unmasks' },
      { to: 'rester', kind: 'colleague', label: 'His second-in-command' },
      { to: 'gevanni', kind: 'colleague', label: 'The agent whose surveillance breaks the case' },
      { to: 'lidner', kind: 'colleague', label: 'Agent he places beside Takada' },
      { to: 'roger', kind: 'ally', label: 'Director of Wammy’s House, later his assistant' },
    ],
    fate: 'Survives. The manga’s epilogue shows him working as the new L, with Roger in Watari’s place.',
    spoiler: true,
    canonNotes:
      'His real name, Nate River, comes from the creators’ official supplementary material and is never used in the anime.',
    sources: [CHARACTERS_EN, MELLO_EN, EPISODE_LIST, EPISODES_ES, CHARACTERS_JA],
  },
  {
    id: 'mello',
    name: 'Mello',
    nameJa: 'メロ',
    aliases: ['Mihael Keehl (real name)'],
    role: 'L’s successor who hunts Kira outside the law',
    affiliation: 'mafia',
    tier: 2,
    introduced: { episode: 26, chapter: 'successors' },
    summary:
      'Near’s fellow candidate at Wammy’s House, Mello refuses to share L’s legacy with his rival and leaves to pursue Kira on his own terms, allied with a Mafia organisation in the United States. His kidnappings of the police director and of Sayu Yagami win him the task force’s notebook — and turn the hunt for Kira into open war.',
    personality:
      'Volatile, proud and relentlessly driven, Mello measures himself against Near and acts where Near deliberates. He is reckless and capable of ruthless violence, yet shows a rough code of his own — he hands Near what he has learned rather than keep it — and his last move proves decisive.',
    significance:
      'The disruptive force of the second half: his actions cost lives, Soichiro’s among them, but his abduction of Takada provokes the mistake that undoes Kira.',
    keyEvents: [
      'Leaves Wammy’s House to hunt Kira alone',
      'Kidnaps the police director, then Sayu',
      'Wins the notebook in the Los Angeles exchange',
      'Survives the raid on his hideout, badly scarred',
      'Visits Near and reveals the false thirteen-day rule',
      'Abducts Takada with Matt',
      'Killed by Takada',
    ],
    relationships: [
      { to: 'near', kind: 'rival', label: 'Lifelong rival he refuses to stand beside' },
      { to: 'l', kind: 'successor', label: 'The detective he means to surpass' },
      { to: 'matt', kind: 'ally', label: 'Childhood friend who joins his final move' },
      { to: 'light', kind: 'adversary', label: 'The Kira he hunts by any means' },
      {
        to: 'soichiro',
        kind: 'adversary',
        label: 'Leads the raid that leaves Mello scarred and Soichiro dying',
      },
      { to: 'lidner', kind: 'ally', label: 'SPK agent who quietly passes him information' },
      { to: 'takada', kind: 'adversary', label: 'His final target — and his killer' },
    ],
    fate: 'Killed on 26 January 2010 (manga date; 2013 in the anime) when Takada writes his name on a hidden page during his abduction of her.',
    spoiler: true,
    canonNotes:
      'His real name, Mihael Keehl, is seen in the story through Soichiro’s Shinigami eyes during the raid, and Takada writes it having been told it by Light; its spelling is given in How to Read 13.',
    sources: [MELLO_EN, CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_ES],
  },
  {
    id: 'mikami',
    name: 'Teru Mikami',
    nameJa: '魅上 照',
    aliases: ['X-Kira'],
    role: 'Prosecutor chosen as Kira’s hidden executioner',
    affiliation: 'kira',
    tier: 2,
    introduced: { episode: 31, chapter: 'new-kira' },
    summary:
      'A prosecutor and fervent believer in Kira, Mikami catches Light’s attention through his appearances on Kira’s Kingdom. Entrusted with the notebook that had been Misa’s, he judges in Kira’s name while Light stays under surveillance, appoints Takada as Kira’s spokesperson and, at the Yellow Box, writes the names meant to end Light’s war.',
    personality:
      'Ascetic, meticulous and absolute in his sense of justice, Mikami was shaped by childhood bullying and trauma into a man who sees the world as divided into the righteous and those to be erased. His devotion to Kira is religious; his discipline makes him an ideal instrument, and his single break from routine proves fatal.',
    significance:
      'The fanatic Light needs once he can no longer act himself; his faith sustains Kira’s reign and, through one unscripted act, ends it.',
    keyEvents: [
      'Champions Kira on Kira’s Kingdom',
      'Receives the notebook and makes the eye deal',
      'Kills Demegawa',
      'Appoints Takada as Kira’s spokesperson',
      'Carries a decoy notebook on Light’s instructions',
      'Retrieves the real notebook to write Takada’s name',
      'Writes the names at the Yellow Box',
      'Exposed when the notebook fails',
    ],
    relationships: [
      { to: 'light', kind: 'devotion', label: 'Worships him as God — until God falters' },
      { to: 'takada', kind: 'colleague', label: 'Chooses her as Kira’s voice' },
      {
        to: 'gevanni',
        kind: 'adversary',
        label: 'SPK agent who shadows him and replaces his notebook',
      },
      { to: 'near', kind: 'adversary', label: 'The detective who names him X-Kira' },
    ],
    fate: 'Anime: at the Yellow Box, appalled by Light’s collapse, he stabs himself with his pen and dies. Manga: he is taken into custody and dies in prison about ten days later, having lost his mind (7 February 2010 in the guidebook chronology).',
    spoiler: true,
    canonNotes:
      'In the manga’s epilogue Matsuda speculates that Near used the notebook to steer Mikami’s actions; Ide points out there is no proof, and the guidebook leaves it to the reader. It must not be presented as fact.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_IT, GWERN],
  },

  /* Tier 3 ----------------------------------------------------------- */
  {
    id: 'takada',
    name: 'Kiyomi Takada',
    nameJa: '高田 清美',
    role: 'Newscaster and Kira’s spokesperson',
    affiliation: 'kira',
    tier: 3,
    introduced: { episode: 32, chapter: 'new-kira' },
    summary:
      'Once Light’s girlfriend at To-Oh University, Takada is a newscaster at NHN when Mikami chooses her as Kira’s spokesperson. Light renews the relationship, reveals himself to her, and uses their supervised meetings to relay orders, while she wields pages of the notebook herself.',
    personality:
      'Poised, intelligent and ambitious, Takada embraces Kira’s cause with conviction and relishes being chosen as its public voice — and as Light’s partner. Her pride and her rivalry with Misa make her susceptible to Light’s flattery, and she never fully grasps that he regards her as expendable.',
    significance:
      'Kira’s public face in the final arc and the channel through which Light runs his endgame.',
    keyEvents: [
      'Chosen by Mikami as Kira’s spokesperson',
      'Resumes her relationship with Light',
      'Receives pages of the notebook',
      'Clashes with Misa',
      'Abducted by Mello',
      'Kills Mello with a hidden page',
    ],
    relationships: [
      {
        to: 'light',
        kind: 'romance',
        label: 'Former girlfriend who believes she is his chosen partner',
      },
      { to: 'mikami', kind: 'colleague', label: 'Kira’s executioner, who appointed her' },
      { to: 'misa', kind: 'rival', label: 'Rival for Light' },
      { to: 'mello', kind: 'adversary', label: 'Her abductor, whom she kills' },
    ],
    fate: 'Dies on 26 January 2010 (manga date; 2013 in the anime) after killing Mello: Light writes her name on a hidden scrap, directing her to burn herself and the evidence, and Mikami — acting on his own — writes it in the real notebook.',
    spoiler: true,
    canonNotes:
      'In the manga she first appears in Part I as Light’s university girlfriend. Her name being written twice — by Light and by Mikami — happens in both versions, and is what exposes the real notebook.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_IT],
  },
  {
    id: 'soichiro',
    name: 'Soichiro Yagami',
    nameJa: '夜神 総一郎',
    role: 'Light’s father; chief of the Kira investigation',
    affiliation: 'task-force',
    tier: 3,
    introduced: { episode: 2, chapter: 'light' },
    summary:
      'A senior officer of the National Police Agency, Soichiro leads the Japanese task force hunting Kira, never suspecting — and refusing to believe — that the culprit might be his own son. His integrity anchors the investigation through its darkest turns.',
    personality:
      'Upright, dutiful and stubborn, he places justice and the law above his career and his health, and loves his family deeply. His decency makes him admirable — and makes him the person Light deceives most completely.',
    significance:
      'The moral standard against which Light’s “justice” is measured; his death in Part II removes the last restraint on his son.',
    keyEvents: [
      'Leads the Japanese Kira task force',
      'Stays with L when most officers quit',
      'Suffers a heart attack under the strain',
      'Storms Sakura TV to seize the second Kira’s tapes',
      'Confines himself alongside Light',
      'Stages the mock execution',
      'Trades for the Shinigami eyes to raid Mello’s hideout',
      'Dies believing in Light’s innocence',
    ],
    relationships: [
      { to: 'light', kind: 'family', label: 'The son he trusts to the very end' },
      { to: 'sachiko', kind: 'family', label: 'His wife' },
      { to: 'sayu', kind: 'family', label: 'The daughter he trades the notebook to save' },
      { to: 'l', kind: 'colleague', label: 'The detective he follows when others will not' },
      { to: 'mello', kind: 'adversary', label: 'The quarry of his last raid' },
      { to: 'ryuk', kind: 'shinigami-bond', label: 'Grants him the eyes' },
    ],
    fate: 'Shot during the raid on Mello’s hideout, he dies in hospital on 11 November 2009 (manga date; 2012 in the anime), seeing Light’s lifespan with his eyes and dying convinced his son cannot be Kira.',
    spoiler: true,
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_ES],
  },
  {
    id: 'matsuda',
    name: 'Touta Matsuda',
    nameJa: '松田 桃太',
    aliases: ['Taro Matsui'],
    role: 'Youngest member of the task force',
    affiliation: 'task-force',
    tier: 3,
    introduced: { episode: 3, chapter: 'l' },
    summary:
      'The youngest and most impulsive member of the Japanese task force, Matsuda is often treated as its weak link, yet his eagerness produces some of the investigation’s boldest moments — from infiltrating Yotsuba as Misa’s manager to the shots fired at the Yellow Box.',
    personality:
      'Warm, emotional and openly idealistic, Matsuda admires Soichiro and badly wants to prove himself. He is also the member most willing to admit that Kira’s justice has its appeal — which makes his reaction to Light’s confession all the more devastating.',
    significance:
      'The story’s everyman: his disillusionment turns the final verdict from cold logic into grief and rage.',
    keyEvents: [
      'Stays with the task force to meet L',
      'Infiltrates Yotsuba posing as Misa’s manager',
      'Fakes his own death to escape',
      'Fronts the Sakura TV trap for Higuchi',
      'Shoots Light at the Yellow Box',
    ],
    relationships: [
      { to: 'light', kind: 'colleague', label: 'Trusted colleague — and the man he finally stops' },
      { to: 'soichiro', kind: 'colleague', label: 'The chief he reveres' },
      { to: 'misa', kind: 'colleague', label: 'Poses as her manager' },
      { to: 'aizawa', kind: 'colleague', label: 'Fellow detective' },
      { to: 'ide', kind: 'colleague', label: 'Fellow detective' },
    ],
    fate: 'Survives the story.',
    spoiler: true,
    canonNotes:
      'In the manga’s epilogue he speculates that Near used the notebook to steer Mikami; Ide points out there is no proof. It is speculation, not canon.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, GWERN],
  },
  {
    id: 'aizawa',
    name: 'Shuichi Aizawa',
    nameJa: '相沢 周市',
    aliases: ['Aihara'],
    role: 'Task force detective who comes to suspect Light',
    affiliation: 'task-force',
    tier: 3,
    introduced: { episode: 3, chapter: 'l' },
    summary:
      'A seasoned detective and family man, Aizawa is one of the officers who stay with Soichiro when most of the police abandon the Kira case. He leaves during the Yotsuba investigation to keep his post, returns in time to stop Higuchi, and in Part II becomes the first of the team to seriously doubt the man leading them.',
    personality:
      'Blunt, principled and protective of his family, Aizawa bristles at L’s methods but is slow to give up on a colleague. His suspicion of Light is painful precisely because it means suspecting Soichiro’s son.',
    significance:
      'The conscience of the Part II task force: his willingness to share his doubts with Near opens the way to Light’s exposure.',
    keyEvents: [
      'Meets L with the officers who stay',
      'Leaves the task force during the Yotsuba case',
      'Helps block Higuchi’s escape',
      'Grows suspicious of Light',
      'Shares information with Near',
      'Present at the Yellow Box',
    ],
    relationships: [
      { to: 'light', kind: 'colleague', label: 'The colleague he comes to suspect' },
      { to: 'near', kind: 'ally', label: 'Shares his doubts with him' },
      { to: 'ide', kind: 'colleague', label: 'Close friend on the force' },
      { to: 'soichiro', kind: 'colleague', label: 'The chief he served' },
      { to: 'matsuda', kind: 'colleague', label: 'Fellow detective' },
    ],
    fate: 'Survives; by the manga’s epilogue he leads the investigation team.',
    spoiler: true,
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST],
  },
  {
    id: 'mogi',
    name: 'Kanzo Mogi',
    nameJa: '模木 完造',
    aliases: ['Kanichi Moji'],
    role: 'Quiet, steadfast task force detective',
    affiliation: 'task-force',
    tier: 3,
    introduced: { episode: 3, chapter: 'l' },
    summary:
      'Reserved and dependable, Mogi is one of the officers who stay with the Kira case from the start. During the Yotsuba operation he plays Misa’s cheerful manager — a role so unlike his taciturn manner that it surprises his colleagues.',
    personality:
      'A man of few words, steady nerves and absolute reliability; he rarely voices an opinion but can be trusted with anything.',
    significance: 'The task force’s steady hand, present through to the Yellow Box.',
    keyEvents: [
      'Stays with L when most officers quit',
      'Acts as Misa’s manager',
      'Present at the Yellow Box',
    ],
    relationships: [
      { to: 'misa', kind: 'colleague', label: 'Her stand-in manager' },
      { to: 'aizawa', kind: 'colleague', label: 'Fellow detective' },
      { to: 'soichiro', kind: 'colleague', label: 'The chief he served' },
    ],
    fate: 'Survives the story.',
    spoiler: false,
    sources: [CHARACTERS_EN, CHARACTERS_JA],
  },
  {
    id: 'ide',
    name: 'Hideki Ide',
    nameJa: '伊出 英基',
    role: 'Task force detective',
    affiliation: 'task-force',
    tier: 3,
    introduced: { episode: 3, chapter: 'l' },
    summary:
      'A detective in the early Kira investigation, Ide steps away when he cannot accept L’s methods, returns to help block Higuchi’s escape, and rejoins the task force after L’s death.',
    personality:
      'Gruff, practical and loyal to his colleagues — above all to his friend Aizawa, whom he cites as his reason for coming back.',
    significance: 'A steady supporting presence whose return strengthens the team for Part II.',
    keyEvents: [
      'Joins the early investigation',
      'Leaves rather than work under L',
      'Helps block Higuchi’s escape',
      'Rejoins the task force after L’s death',
    ],
    relationships: [
      { to: 'aizawa', kind: 'colleague', label: 'Close friend and the reason he returns' },
      { to: 'matsuda', kind: 'colleague', label: 'Fellow detective' },
    ],
    fate: 'Survives the story.',
    spoiler: false,
    canonNotes:
      'In the manga’s epilogue he dismisses Matsuda’s theory about Near for lack of proof.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, GWERN],
  },
  {
    id: 'ukita',
    name: 'Hirokazu Ukita',
    nameJa: '宇生田 広数',
    role: 'Task force detective killed at Sakura TV',
    affiliation: 'task-force',
    tier: 3,
    introduced: { episode: 3, chapter: 'l' },
    summary:
      'A young, hot-headed member of the original task force, Ukita is one of the few who stay with L after the FBI deaths. When Sakura TV airs the second Kira’s tapes, he rushes to the station alone to stop the broadcast.',
    personality: 'Brave, impulsive and fiercely committed, with little patience for caution.',
    significance:
      'His death outside Sakura TV shows that the second Kira can kill without knowing a name — the first sign of the Shinigami eyes.',
    keyEvents: [
      'Stays with the task force to meet L',
      'Rushes to Sakura TV',
      'Killed at the station’s entrance',
    ],
    relationships: [
      { to: 'misa', kind: 'adversary', label: 'Killed by her through the Shinigami eyes' },
      { to: 'aizawa', kind: 'colleague', label: 'Fellow detective' },
      { to: 'soichiro', kind: 'colleague', label: 'The chief he served' },
    ],
    fate: 'Killed on 18 April 2004 (manga date; 2007 in the anime) by Misa, who needs only his face.',
    spoiler: true,
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST],
  },
  {
    id: 'watari',
    name: 'Watari',
    nameJa: 'ワタリ',
    aliases: ['Quillsh Wammy (real name)'],
    role: 'L’s guardian, handler and only confidant',
    affiliation: 'l',
    tier: 3,
    introduced: { episode: 2, chapter: 'l' },
    summary:
      'The elderly gentleman who speaks to the world on L’s behalf, Watari arranges L’s operations, equips the task force and is, for most of the story, the only person who has seen L’s face. He is also Quillsh Wammy, the inventor who founded the orphanage that raised L’s successors.',
    personality:
      'Courteous, discreet and unflappable — a skilled engineer and marksman whose devotion to L is paternal.',
    significance:
      'The infrastructure behind L and, through Wammy’s House, the origin of everyone who inherits his work.',
    keyEvents: [
      'Brings L’s voice to Interpol',
      'Reveals himself to the task force and equips it',
      'Holds Misa in custody',
      'Shoots the gun from Higuchi’s hand',
      'Killed by Rem moments before L',
    ],
    relationships: [
      { to: 'l', kind: 'ally', label: 'Guardian and partner' },
      { to: 'roger', kind: 'colleague', label: 'Runs Wammy’s House in his stead' },
      { to: 'near', kind: 'ally', label: 'A child of the orphanage he founded' },
      { to: 'mello', kind: 'ally', label: 'A child of the orphanage he founded' },
    ],
    fate: 'Killed by Rem on 5 November 2004 (manga date; 2007 in the anime), seconds before L.',
    spoiler: true,
    canonNotes: 'His real name, Quillsh Wammy, is revealed as the first part of the story closes.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_ES],
  },
  {
    id: 'naomi',
    name: 'Naomi Misora',
    nameJa: '南空 ナオミ',
    aliases: ['Shoko Maki'],
    role: 'Former FBI agent investigating Raye’s death',
    affiliation: 'fbi',
    tier: 3,
    introduced: { episode: 6, chapter: 'first-battle' },
    summary:
      'A former FBI agent engaged to Raye Penber, Naomi refuses to accept his death as coincidence. Alone, she reasons her way toward the truth about Kira and brings her theory to police headquarters — where Light is waiting.',
    personality:
      'Intelligent, controlled and courageous; her investigative instinct is sharpened rather than dulled by grief.',
    significance:
      'The first person to come close to the truth by her own reasoning; her disappearance shows how little Light will spare to protect himself.',
    keyEvents: [
      'Comes to Japan with Raye',
      'Builds her own theory of Kira’s methods',
      'Meets Light under an alias',
      'Reveals her real name',
      'Disappears; her body is never found',
    ],
    relationships: [
      { to: 'raye', kind: 'romance', label: 'Engaged to him' },
      { to: 'light', kind: 'adversary', label: 'Outwitted by him at police headquarters' },
      {
        to: 'l',
        kind: 'colleague',
        label: 'Worked with him on an earlier case, told in the novel Another Note',
      },
    ],
    fate: 'Light’s notebook sends her to take her own life where she will not be found; she vanishes in January 2004 (manga date; 2007 in the anime).',
    spoiler: true,
    canonNotes:
      'The manga leaves her end implied; the anime dwells on her final walk. The guidebook chronology gives her death as 2 January 2004. Her earlier case with L belongs to the prequel novel Another Note, which the anime does not adapt.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST],
  },
  {
    id: 'raye',
    name: 'Raye Penber',
    nameJa: 'レイ・ペンバー',
    role: 'FBI agent assigned to the Yagami family',
    affiliation: 'fbi',
    tier: 3,
    introduced: { episode: 3, chapter: 'first-battle' },
    summary:
      'One of twelve FBI agents sent to Japan to watch police officers and their families, Raye is assigned to the Yagamis. Light detects the tail, learns Raye’s name during a staged bus hijacking, and turns him into the instrument of his colleagues’ deaths.',
    personality:
      'Professional, brave and protective — he tells his fiancée to keep away from the case for her own safety.',
    significance:
      'The first investigator Light kills, and the event that shatters the Japanese police’s trust in L.',
    keyEvents: [
      'Tails Light',
      'Shows his FBI identification during the bus hijacking',
      'Coerced into writing his colleagues’ names',
      'Dies moments after leaving the train, recognising Light',
    ],
    relationships: [
      { to: 'naomi', kind: 'romance', label: 'Engaged to her' },
      { to: 'light', kind: 'adversary', label: 'The suspect who kills him' },
      { to: 'l', kind: 'colleague', label: 'Investigating on L’s behalf' },
    ],
    fate: 'Killed by Light on 27 December 2003 (manga date; 2006 in the anime), after the eleven agents whose names he wrote.',
    spoiler: true,
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST],
  },
  {
    id: 'sayu',
    name: 'Sayu Yagami',
    nameJa: '夜神 粧裕',
    role: 'Light’s younger sister',
    affiliation: 'civilian',
    tier: 3,
    introduced: { episode: 2, chapter: 'light' },
    summary:
      'Light’s cheerful younger sister, who looks up to her brother and knows nothing of his double life. In Part II, Mello’s men kidnap her to force the task force to surrender its notebook.',
    personality: 'Bright, affectionate and ordinary — a reminder of the life Light leaves behind.',
    significance:
      'Her kidnapping shows that Kira’s war reaches the innocent, and its aftermath haunts the Yagami family.',
    keyEvents: [
      'Turns to Light for help with her studies',
      'Kidnapped by Mello’s gang',
      'Exchanged for the notebook in Los Angeles',
      'Left in deep shock after her return',
    ],
    relationships: [
      { to: 'light', kind: 'family', label: 'The older brother she adores' },
      { to: 'soichiro', kind: 'family', label: 'Her father, who brings her home' },
      { to: 'sachiko', kind: 'family', label: 'Her mother' },
      { to: 'mello', kind: 'adversary', label: 'Kidnapped by his gang' },
    ],
    fate: 'Survives, returned unharmed but traumatised; she never learns that Light was Kira.',
    spoiler: true,
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_ES],
  },
  {
    id: 'sachiko',
    name: 'Sachiko Yagami',
    nameJa: '夜神 幸子',
    role: 'Light’s mother',
    affiliation: 'civilian',
    tier: 3,
    introduced: { episode: 1, chapter: 'light' },
    summary:
      'Light’s mother, devoted to her family and proud of her son’s achievements. She remains unaware of the truth from first to last.',
    personality:
      'Gentle and warm — the heart of the ordinary household that frames Light’s secret.',
    significance: 'Embodies the normal family life against which Light’s double existence is set.',
    keyEvents: [
      'Celebrates Light’s exam results',
      'Sees her daughter kidnapped and her husband killed in Part II',
      'Never learns that Light was Kira',
    ],
    relationships: [
      { to: 'light', kind: 'family', label: 'The son she is proud of' },
      { to: 'soichiro', kind: 'family', label: 'Her husband' },
      { to: 'sayu', kind: 'family', label: 'Her daughter' },
    ],
    fate: 'Survives, never learning the truth about her son.',
    spoiler: true,
    sources: [CHARACTERS_EN, CHARACTERS_JA],
  },
  {
    id: 'gevanni',
    name: 'Stephen Gevanni',
    nameJa: 'ステファン・ジェバンニ',
    aliases: ['Stephen Loud (real name)'],
    role: 'SPK agent',
    affiliation: 'spk',
    tier: 3,
    introduced: { episode: 27, chapter: 'successors' },
    summary:
      'One of the three SPK agents who survive Mello’s attack, Gevanni carries out the surveillance that breaks the case: he shadows Mikami, learns his routines, and photographs the notebook he keeps in a gym locker.',
    personality:
      'Patient, precise and quietly skilful — the investigator who makes Near’s plans possible.',
    significance:
      'His work identifies X-Kira and produces the copy that defeats Light at the Yellow Box.',
    keyEvents: [
      'Survives Mello’s attack on the SPK',
      'Shadows Mikami',
      'Photographs his notebook',
      'Replaces the real notebook with a copy',
      'Present at the Yellow Box',
    ],
    relationships: [
      { to: 'near', kind: 'colleague', label: 'Serves as his eyes in the field' },
      { to: 'mikami', kind: 'adversary', label: 'The man he shadows' },
      { to: 'rester', kind: 'colleague', label: 'Fellow SPK agent' },
      { to: 'lidner', kind: 'colleague', label: 'Fellow SPK agent' },
    ],
    fate: 'Survives the story.',
    spoiler: true,
    canonNotes:
      'His real name is given as Stephen Loud in official reference material; it is never used in the anime.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_IT],
  },
  {
    id: 'lidner',
    name: 'Halle Lidner',
    nameJa: 'ハル・リドナー',
    aliases: ['Halle Bullook (real name)'],
    role: 'SPK agent and former CIA operative',
    affiliation: 'spk',
    tier: 3,
    introduced: { episode: 27, chapter: 'successors' },
    summary:
      'A former CIA agent in Near’s SPK, Lidner survives Mello’s attack and is later assigned as Takada’s bodyguard, giving Near a view from inside Kira’s camp. She also quietly passes information to Mello, judging that his methods may help catch Kira.',
    personality: 'Composed, capable and pragmatic — willing to bend her loyalties for results.',
    significance:
      'Her double role links Near’s investigation with Mello’s and places the SPK beside Takada.',
    keyEvents: [
      'Taken hostage by Mello at SPK headquarters',
      'Passes information to Mello',
      'Guards Takada',
      'Present at the Yellow Box',
    ],
    relationships: [
      { to: 'near', kind: 'colleague', label: 'Her commander' },
      { to: 'mello', kind: 'ally', label: 'Passes him information' },
      { to: 'takada', kind: 'adversary', label: 'Guards her while reporting to Near' },
    ],
    fate: 'Survives the story.',
    spoiler: true,
    canonNotes:
      'Her real name is given as Halle Bullook in official reference material; it is never used in the anime.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST],
  },
  {
    id: 'rester',
    name: 'Anthony Rester',
    nameJa: 'アンソニー・レスター',
    aliases: ['Anthony Carter (real name)'],
    role: 'Commander and Near’s second-in-command',
    affiliation: 'spk',
    tier: 3,
    introduced: { episode: 27, chapter: 'successors' },
    summary:
      'The senior officer of the SPK, Rester serves as Near’s right hand, handling security and operations. He is one of the three agents who survive Mello’s attack on the organisation.',
    personality:
      'Disciplined and loyal — the guidebook describes him as a former special-forces leader — he defers to Near’s intellect while keeping him safe.',
    significance: 'The SPK’s steady command presence from New York to the Yellow Box.',
    keyEvents: [
      'Survives Mello’s attack on the SPK',
      'Guards Near during the New York siege',
      'Follows Near to Japan',
      'Present at the Yellow Box',
    ],
    relationships: [
      { to: 'near', kind: 'ally', label: 'Commander who serves as his right hand' },
      { to: 'gevanni', kind: 'colleague', label: 'Fellow SPK agent' },
      { to: 'lidner', kind: 'colleague', label: 'Fellow SPK agent' },
    ],
    fate: 'Survives the story.',
    spoiler: false,
    canonNotes:
      'His real name is given as Anthony Carter in official reference material; it is never used in the anime.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST],
  },
  {
    id: 'matt',
    name: 'Matt',
    nameJa: 'マット',
    aliases: ['Mail Jeevas (real name)'],
    role: 'Mello’s friend and accomplice',
    affiliation: 'mafia',
    tier: 3,
    introduced: { episode: 35, chapter: 'final-strategy' },
    summary:
      'Mello’s childhood friend, Matt joins him for his final move — the abduction of Takada — creating the diversion that draws off her bodyguards.',
    personality:
      'Laid-back and laconic, a gamer and smoker whose loyalty to Mello outweighs his own safety.',
    significance: 'His brief appearance makes Mello’s last gamble possible.',
    keyEvents: ['Creates a diversion during Takada’s abduction', 'Shot dead by her bodyguards'],
    relationships: [
      { to: 'mello', kind: 'ally', label: 'Childhood friend' },
      { to: 'takada', kind: 'adversary', label: 'Helps abduct her' },
    ],
    fate: 'Shot dead by Takada’s bodyguards on 26 January 2010 (manga date; 2013 in the anime).',
    spoiler: true,
    canonNotes:
      'His real name, Mail Jeevas, comes from the guidebook How to Read 13; it is never used in the anime.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_IT],
  },
  {
    id: 'higuchi',
    name: 'Kyosuke Higuchi',
    nameJa: '火口 卿介',
    aliases: ['The third Kira'],
    role: 'Yotsuba executive and the third Kira',
    affiliation: 'yotsuba',
    tier: 3,
    introduced: { episode: 17, chapter: 'yotsuba' },
    summary:
      'Head of technology development at the Yotsuba Group, Higuchi receives Light’s original notebook from Rem and uses Kira’s power to eliminate the company’s rivals, while his fellow executives help choose the targets. Vain and ambitious, he comes to covet Misa — and the role of Kira itself.',
    personality:
      'Opportunistic, impatient and self-serving — the opposite of Light’s ideological Kira, he kills for profit and prestige.',
    significance:
      'Shows what the notebook becomes in the hands of greed; his capture returns the notebook — and Light’s memories — to play.',
    keyEvents: [
      'Receives the notebook from Rem',
      'Kills for Yotsuba’s profit',
      'Confesses to Misa',
      'Lured by the Sakura TV trap',
      'Makes the eye deal with Rem',
      'Captured by the task force',
      'Killed by Light with a watch scrap',
    ],
    relationships: [
      { to: 'rem', kind: 'shinigami-bond', label: 'The Shinigami tied to his notebook' },
      { to: 'misa', kind: 'adversary', label: 'Courts her; she draws out his confession' },
      { to: 'light', kind: 'adversary', label: 'An unwitting pawn in Light’s plan' },
      { to: 'l', kind: 'adversary', label: 'The detective who traps him' },
    ],
    fate: 'Arrested, then killed by Light on 28 October 2004 (manga date; 2007 in the anime) with a scrap of the notebook hidden in a wristwatch.',
    spoiler: true,
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_IT],
  },
  {
    id: 'roger',
    name: 'Roger Ruvie',
    nameJa: 'ロジャー・ラヴィー',
    role: 'Director of Wammy’s House',
    affiliation: 'wammy',
    tier: 3,
    introduced: { episode: 26, chapter: 'successors' },
    summary:
      'The elderly manager of Wammy’s House in Winchester, Roger receives word of L’s death and breaks the news to Near and Mello, the children raised as L’s potential successors.',
    personality:
      'Weary and reserved; he knows the secrets of L’s work but admits to little affinity for children.',
    significance: 'The link between L’s world and the generation that inherits it.',
    keyEvents: ['Learns of L’s death', 'Tells Near and Mello', 'Supports Near after the case'],
    relationships: [
      { to: 'near', kind: 'ally', label: 'Former charge he goes on to serve' },
      { to: 'mello', kind: 'ally', label: 'Former charge' },
      { to: 'watari', kind: 'colleague', label: 'Founder of the house he runs' },
    ],
    fate: 'Survives; the manga’s final chapter shows him serving Near as Watari once served L.',
    spoiler: true,
    canonNotes: 'His role as Near’s “Watari” is shown in the manga’s ending.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODES_ES],
  },
  {
    id: 'wedy',
    name: 'Wedy',
    nameJa: 'ウエディ',
    aliases: ['Mary Kenwood (real name)'],
    role: 'Professional thief recruited by L',
    affiliation: 'l',
    tier: 3,
    introduced: { episode: 18, chapter: 'yotsuba' },
    summary:
      'A professional thief from L’s network, Wedy joins the task force for the Yotsuba operation, defeating the company’s security to plant cameras and microphones in the executives’ meeting room.',
    personality: 'Cool, sardonic and supremely confident in her craft.',
    significance: 'Her surveillance lets the team watch Kira’s corporate meetings as they happen.',
    keyEvents: [
      'Recruited by L',
      'Bugs the Yotsuba meeting room',
      'Helps trap Higuchi',
      'Killed by Light after L’s death',
    ],
    relationships: [
      { to: 'l', kind: 'colleague', label: 'Specialist hired for the case' },
      { to: 'aiber', kind: 'colleague', label: 'Partner on the Yotsuba operation' },
    ],
    fate: 'Killed by Light after L’s death; in the manga her death is a motorcycle accident.',
    spoiler: true,
    canonNotes:
      'Her real name is given as Mary Kenwood in official reference material; it is never used in the anime.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_ES],
  },
  {
    id: 'aiber',
    name: 'Aiber',
    nameJa: 'アイバー',
    aliases: ['Eraldo Coil (cover identity)', 'Thierry Morello (real name)'],
    role: 'Con artist recruited by L',
    affiliation: 'l',
    tier: 3,
    introduced: { episode: 18, chapter: 'yotsuba' },
    summary:
      'A professional swindler from L’s network, Aiber infiltrates the Yotsuba executives’ meetings under a false identity, winning their confidence and feeding the task force information from inside.',
    personality: 'Charming, gregarious and a master of persuasion.',
    significance: 'His infiltration gives L a man inside the Yotsuba conspiracy.',
    keyEvents: [
      'Recruited by L',
      'Infiltrates the Yotsuba meetings',
      'Helps bring down Higuchi',
      'Killed by Light after L’s death',
    ],
    relationships: [
      { to: 'wedy', kind: 'colleague', label: 'Partner on the Yotsuba operation' },
      { to: 'l', kind: 'colleague', label: 'Specialist hired for the case' },
    ],
    fate: 'Killed by Light after L’s death.',
    spoiler: true,
    canonNotes:
      'Anime: he dies of a heart attack at home in front of his wife and son. Manga: he dies of liver cancer in a Paris hospital. His real name is given as Thierry Morello in official reference material.',
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST, EPISODES_ES],
  },
  {
    id: 'lind-tailor',
    name: 'Lind L. Tailor',
    nameJa: 'リンド・L・テイラー',
    role: 'Condemned prisoner used as L’s decoy',
    affiliation: 'l',
    tier: 3,
    introduced: { episode: 2, chapter: 'first-battle' },
    summary:
      'A death-row prisoner whose arrest had been kept from the public, Lind L. Tailor is put on television under the name “L” to denounce Kira as evil.',
    personality:
      'The story reveals almost nothing of him; he exists as L’s instrument, a stand-in sacrificed to test Kira’s reach.',
    significance:
      'His death on air lets L place Kira in the Kanto region and confirms that Kira can kill from a distance.',
    keyEvents: [
      'Appears on television as “L”',
      'Denounces Kira',
      'Killed by Light during the broadcast',
    ],
    relationships: [
      { to: 'l', kind: 'ally', label: 'Used by L as a televised decoy' },
      { to: 'light', kind: 'adversary', label: 'Killed by him on live television' },
    ],
    fate: 'Killed on air on 5 December 2003 (manga date; the anime’s calendar runs three years later).',
    spoiler: true,
    sources: [CHARACTERS_EN, CHARACTERS_JA, EPISODE_LIST],
  },
  {
    id: 'gelus',
    name: 'Gelus',
    nameJa: 'ジェラス',
    role: 'Shinigami who died to save Misa',
    affiliation: 'shinigami',
    tier: 3,
    introduced: { episode: 12, chapter: 'shinigami' },
    summary:
      'A small, doll-like Shinigami who spent his time watching Misa from the Shinigami realm and fell in love with her. When a stalker was about to kill her, he wrote the man’s name in his notebook — saving her life and ending his own.',
    personality:
      'Silent, gentle and devoted — an unusual Shinigami whose feeling for a human outweighs the law of his kind.',
    significance:
      'His death establishes the rule that later dooms Rem; his remaining lifespan passed to Misa, and his notebook became hers.',
    keyEvents: [
      'Watches Misa from the Shinigami realm',
      'Kills her stalker to save her',
      'Crumbles to dust; Rem carries his notebook to Misa',
    ],
    relationships: [
      { to: 'misa', kind: 'devotion', label: 'Loved her from afar' },
      { to: 'rem', kind: 'colleague', label: 'Fellow Shinigami who honours his sacrifice' },
    ],
    fate: 'Turns to dust after saving Misa; his remaining lifespan passes to her.',
    spoiler: true,
    sources: [CHARACTERS_EN, MISA_EN, EPISODES_ES],
  },
  {
    id: 'sidoh',
    name: 'Sidoh',
    nameJa: 'シドウ',
    role: 'Shinigami searching for his lost notebook',
    affiliation: 'shinigami',
    tier: 3,
    introduced: { episode: 28, chapter: 'successors' },
    summary:
      'A timid, forgetful Shinigami, Sidoh discovers that the notebook Ryuk dropped into the human world was his. He follows it to Mello’s gang, where the truth that the thirteen-day rule is false comes out, and finally recovers it from Light.',
    personality: 'Nervous, easily frightened by humans, and fond of chocolate.',
    significance:
      'His arrival reaches back to the story’s origin and puts the truth about the false rule in Mello’s hands.',
    keyEvents: [
      'Learns that Ryuk took his notebook',
      'Comes to the human world',
      'Haunts Mello’s hideout',
      'Reveals that the thirteen-day rule is false',
      'Recovers his notebook from Light',
    ],
    relationships: [
      { to: 'ryuk', kind: 'rival', label: 'Ryuk took his notebook' },
      { to: 'mello', kind: 'shinigami-bond', label: 'Tied to the notebook held by Mello’s gang' },
      {
        to: 'light',
        kind: 'adversary',
        label: 'Gets his notebook back from Light, who wants him out of the way',
      },
    ],
    fate: 'Recovers his notebook after the raid on Mello’s hideout.',
    spoiler: true,
    sources: [CHARACTERS_EN, EPISODE_LIST, EPISODES_ES],
  },
];
