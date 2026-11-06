/**
 * Key events of the story, in story order, from the notebook's fall to the manga epilogue.
 *
 * Canon: the anime is the primary continuity. `canon: 'both'` means the event happens in
 * both versions; anime-only and manga-only beats are labelled, and differences are in `note`.
 *
 * Dates: only where the manga or its official guidebook (Death Note 13: How to Read)
 * establishes them. They follow the manga's calendar (2003–2010). The anime runs its whole
 * calendar three years later — birth and death years are shifted by three, and its own
 * on-screen dates for Part II fall in 2012 — so every dated event notes the anime year.
 *
 * Research notes and the full source list: docs/content/story-reference.md
 */
import type { SourceRef, TimelineEvent } from './types';

const EPISODE_LIST = 'https://en.wikipedia.org/wiki/List_of_Death_Note_episodes';

/** An anime episode, verified against the Wikipedia episode summaries. */
const anime = (n: number): SourceRef => ({
  label: `Anime, Ep. ${n} (summary: Wikipedia episode list)`,
  url: EPISODE_LIST,
});

const EPISODES_IT: SourceRef = {
  label: 'Wikipedia (Italian) — Episodi di Death Note',
  url: 'https://it.wikipedia.org/wiki/Episodi_di_Death_Note',
};
const EPISODES_ES: SourceRef = {
  label: 'Wikipedia (Spanish) — Episodios de Death Note',
  url: 'https://es.wikipedia.org/wiki/Anexo:Episodios_de_Death_Note',
};
const EPISODES_FR: SourceRef = {
  label: 'Wikipedia (French) — Liste des épisodes de Death Note',
  url: 'https://fr.wikipedia.org/wiki/Liste_des_épisodes_de_Death_Note',
};
const CHARACTERS_EN: SourceRef = {
  label: 'Wikipedia — List of Death Note characters',
  url: 'https://en.wikipedia.org/wiki/List_of_Death_Note_characters',
};
const CHARACTERS_JA: SourceRef = {
  label: 'Wikipedia (Japanese) — DEATH NOTEの登場人物 (guidebook dates, anime-year variants)',
  url: 'https://ja.wikipedia.org/wiki/DEATH_NOTEの登場人物',
};
const CHAPTERS_EN: SourceRef = {
  label: 'Wikipedia — List of Death Note chapters (volume summaries)',
  url: 'https://en.wikipedia.org/wiki/List_of_Death_Note_chapters',
};
const SERIES_EN: SourceRef = {
  label: 'Wikipedia — Death Note',
  url: 'https://en.wikipedia.org/wiki/Death_Note',
};
const SERIES_JA: SourceRef = {
  label: 'Wikipedia (Japanese) — DEATH NOTE (in-story years, anime variants)',
  url: 'https://ja.wikipedia.org/wiki/DEATH_NOTE',
};
const LIGHT_EN: SourceRef = {
  label: 'Wikipedia — Light Yagami',
  url: 'https://en.wikipedia.org/wiki/Light_Yagami',
};
const LIGHT_JA: SourceRef = {
  label: 'Wikipedia (Japanese) — 夜神月 (manga and anime endings compared)',
  url: 'https://ja.wikipedia.org/wiki/夜神月',
};
const L_EN: SourceRef = {
  label: 'Wikipedia — L (Death Note)',
  url: 'https://en.wikipedia.org/wiki/L_(Death_Note)',
};
const MISA_EN: SourceRef = {
  label: 'Wikipedia — Misa Amane',
  url: 'https://en.wikipedia.org/wiki/Misa_Amane',
};
const RYUK_EN: SourceRef = {
  label: 'Wikipedia — Ryuk (Death Note)',
  url: 'https://en.wikipedia.org/wiki/Ryuk_(Death_Note)',
};
const GWERN: SourceRef = {
  label: 'Gwern Branwen — “Death Note’s Ending” (citing How to Read 13)',
  url: 'https://gwern.net/Death%20Note%20Ending',
};
const FAN_CHRONOLOGY: SourceRef = {
  label: 'Fan chronology compiled from the manga (cross-reference only)',
  url: 'https://www.goodreads.com/topic/show/22669218-timeline',
};

export const TIMELINE: readonly TimelineEvent[] = [
  /* Origin ---------------------------------------------------------- */
  {
    id: 'ryuk-drops-notebook',
    arc: 'origin',
    episode: 1,
    title: 'A Shinigami’s boredom',
    summary:
      'In the grey, stagnant realm of the Shinigami, where the gods of death idle and gamble, Ryuk lets a second Death Note fall into the human world simply to see what will happen. He claims to have tricked the Shinigami King into giving it to him.',
    characters: ['ryuk'],
    chapter: 'prologue',
    canon: 'both',
    note: 'Part II reveals that the notebook he dropped had belonged to another Shinigami, Sidoh (Ep. 28).',
    sources: [anime(1), RYUK_EN, CHARACTERS_EN],
  },
  {
    id: 'light-finds-notebook',
    arc: 'origin',
    episode: 1,
    date: '2003-11-28',
    title: 'The notebook falls',
    summary:
      'Light Yagami, a gifted and outwardly model high-school student, finds a black notebook on his school grounds. Its instructions claim that anyone whose name is written in it, while the writer pictures their face, will die.',
    characters: ['light'],
    chapter: 'notebook',
    canon: 'both',
    note: 'Date from the manga’s chronology; the anime’s calendar runs three years later (2006).',
    sources: [anime(1), SERIES_EN, FAN_CHRONOLOGY],
  },
  {
    id: 'first-judgments',
    arc: 'origin',
    episode: 1,
    title: 'Two tests',
    summary:
      'Half in disbelief, Light writes the name of a hostage-taker shown on the news, who dies of a heart attack minutes later. A second test, on a man harassing a woman in the street, proves that he can also dictate how a person dies — and Light resolves to rid the world of those he judges evil.',
    characters: ['light'],
    chapter: 'light',
    canon: 'both',
    sources: [anime(1), SERIES_EN],
  },
  {
    id: 'ryuk-appears',
    arc: 'origin',
    episode: 1,
    title: 'Ryuk arrives',
    summary:
      'Days later Ryuk appears in Light’s room. He explains that the notebook now belongs to Light, that for now only Light can see or hear him, and that when Light’s time comes it will be Ryuk who writes his name. Light tells him he means to become the god of a new world.',
    characters: ['ryuk', 'light'],
    chapter: 'shinigami',
    canon: 'both',
    sources: [anime(1), RYUK_EN],
  },
  {
    id: 'kira-named',
    arc: 'origin',
    episode: [1, 2],
    title: 'The world names Kira',
    summary:
      'Criminals in prisons and on the run around the world begin dying of sudden heart attacks — the notebook’s default cause, and a uniform signature that makes the pattern impossible to miss. The public gives the unseen judge a name: Kira.',
    characters: ['light'],
    chapter: 'kira',
    canon: 'both',
    sources: [anime(2), SERIES_EN],
  },

  /* L's investigation ------------------------------------------------ */
  {
    id: 'interpol-turns-to-l',
    arc: 'investigation',
    episode: 2,
    title: 'Interpol turns to L',
    summary:
      'At an emergency Interpol conference, an elderly man sets down a laptop showing a single gothic letter, and a disguised voice speaks for L — the detective no one has seen, who has solved cases the world’s police could not. L calls the deaths murder and takes the case.',
    characters: ['l', 'watari'],
    chapter: 'l',
    canon: 'both',
    sources: [anime(2), L_EN],
  },
  {
    id: 'lind-l-tailor',
    arc: 'investigation',
    episode: 2,
    date: '2003-12-05',
    title: 'Lind L. Tailor and the Kanto deduction',
    summary:
      'L puts a condemned prisoner, Lind L. Tailor, on television as “L” to denounce Kira, and Light kills him on air. L had already traced the first victim to Japan; now he reveals that the broadcast reached only the Kanto region — so that is where Kira is — and dares Kira to kill him.',
    characters: ['l', 'lind-tailor', 'light'],
    chapter: 'first-battle',
    canon: 'both',
    note: 'Date from the manga’s chronology (Tailor’s death); the anime’s calendar runs three years later.',
    sources: [anime(2), CHARACTERS_EN, CHARACTERS_JA],
  },
  {
    id: 'student-profile',
    arc: 'investigation',
    episode: 3,
    title: 'A student with inside access',
    summary:
      'From the times of death, L infers that Kira is probably a student; from the choice of victims, that Kira can see police information. The Japanese task force is led by Soichiro Yagami — Light’s father, whose work gives his son a window onto the investigation.',
    characters: ['l', 'soichiro', 'light'],
    chapter: 'l',
    canon: 'both',
    sources: [anime(3)],
  },
  {
    id: 'eyes-offered',
    arc: 'investigation',
    episode: [3, 4],
    title: 'Half a life for the eyes',
    summary:
      'Ryuk explains that a Shinigami sees every human’s name and remaining lifespan, and offers Light the same eyes in exchange for half of the life he has left. Light declines, judging the price too high for someone who intends to be a god.',
    characters: ['ryuk', 'light'],
    chapter: 'eyes',
    canon: 'both',
    sources: [anime(3), anime(4)],
  },
  {
    id: 'bus-hijacking',
    arc: 'investigation',
    episode: 4,
    title: 'The bus hijacking',
    summary:
      'Aware that he is being tailed, Light uses the notebook to stage a bus hijacking and lets the hijacker glimpse Ryuk through a scrap of a page. The agent following him steps in and shows his FBI identification — giving Light the name Raye Penber.',
    characters: ['light', 'raye', 'ryuk'],
    chapter: 'first-battle',
    canon: 'both',
    sources: [anime(4), CHARACTERS_EN],
  },
  {
    id: 'fbi-agents-killed',
    arc: 'investigation',
    episode: 5,
    date: '2003-12-27',
    title: 'Twelve agents',
    summary:
      'Light corners Raye on a train and, under threat, makes him write the names of his fellow agents on notebook pages hidden in an envelope. The other eleven FBI agents secretly investigating in Japan die, then Raye, who recognises Light in his final moments.',
    characters: ['light', 'raye'],
    chapter: 'first-battle',
    canon: 'both',
    note: 'Date from the manga’s chronology (Raye’s death); anime calendar: 2006.',
    sources: [anime(5), CHARACTERS_EN, CHARACTERS_JA],
  },
  {
    id: 'the-few-who-stay',
    arc: 'investigation',
    episode: 5,
    title: 'The few who stay',
    summary:
      'Learning that the FBI had been watching police families on L’s behalf, most officers abandon the case. The handful who remain — Soichiro, Aizawa, Matsuda, Mogi and Ukita — are invited to meet L in person, and find a barefoot young man crouched in a hotel armchair.',
    characters: ['l', 'soichiro', 'aizawa', 'matsuda', 'mogi', 'ukita'],
    chapter: 'l',
    canon: 'both',
    sources: [anime(5), CHARACTERS_EN],
  },
  {
    id: 'naomi-misora',
    arc: 'investigation',
    episode: [6, 7],
    date: '2004-01',
    title: 'Naomi Misora',
    summary:
      'Raye’s fiancée, a former FBI agent, refuses to accept his death as chance and brings her own theory of Kira’s methods to police headquarters. Light intercepts her, draws her real name out from behind the alias Shoko Maki, and writes it; she walks away and is never found.',
    characters: ['naomi', 'light', 'raye'],
    chapter: 'first-battle',
    canon: 'both',
    note: 'The manga leaves her end implied; the anime dwells on her final walk. The guidebook chronology dates her death to 2 January 2004 (anime calendar: 2007).',
    sources: [anime(6), anime(7), CHARACTERS_EN, CHARACTERS_JA],
  },
  {
    id: 'home-surveillance',
    arc: 'investigation',
    episode: 8,
    title: 'Cameras in the Yagami house',
    summary:
      'L has cameras and microphones installed in the homes of senior police officers, Soichiro Yagami’s among them. Ryuk finds every camera for Light, who goes on killing while appearing only to study — following the news on a tiny television hidden in a bag of crisps.',
    characters: ['l', 'light', 'ryuk', 'soichiro'],
    chapter: 'first-battle',
    canon: 'both',
    sources: [anime(8)],
  },
  {
    id: 'to-oh-university',
    arc: 'investigation',
    episode: [9, 10],
    title: 'To-Oh University',
    summary:
      'L sits the To-Oh University entrance exam to observe Light, and at the entrance ceremony, where both deliver the freshman address, he introduces himself as Hideki Ryuga — the name of a famous idol — before telling Light that he is L. A tennis match and a café conversation follow, each one a test, and neither can read the other.',
    characters: ['l', 'light'],
    chapter: 'first-battle',
    canon: 'both',
    sources: [anime(9), anime(10), FAN_CHRONOLOGY],
  },

  /* The second Kira ------------------------------------------------- */
  {
    id: 'sakura-tv-broadcasts',
    arc: 'second-kira',
    episode: [10, 11],
    date: '2004-04-18',
    title: 'The Sakura TV broadcasts',
    summary:
      'Sakura TV airs tapes from a self-proclaimed Kira. Ukita runs to the station and dies at its door — killed by someone who did not need his name — until Soichiro, despite his recent heart attack, drives a police vehicle into the lobby and seizes the tapes.',
    characters: ['ukita', 'soichiro', 'misa', 'l'],
    chapter: 'misa',
    canon: 'both',
    note: 'Date from the manga’s chronology (Ukita’s death); anime calendar: 2007.',
    sources: [anime(10), anime(11), CHARACTERS_EN, CHARACTERS_JA],
  },
  {
    id: 'misa-amane',
    arc: 'second-kira',
    episode: 11,
    title: 'The second Kira',
    summary:
      'The tapes’ sender is Misa Amane, a young model whose parents were murdered by a burglar — a man Kira later killed. She has already traded half of her remaining life to Rem, the Shinigami who brought her a notebook, for the eyes.',
    characters: ['misa', 'rem'],
    chapter: 'misa',
    canon: 'both',
    sources: [anime(11), MISA_EN],
  },
  {
    id: 'gelus-sacrifice',
    arc: 'second-kira',
    episode: 12,
    title: 'Gelus',
    summary:
      'Rem recalls Gelus, a Shinigami who watched Misa from the Shinigami realm and fell in love with her. When a stalker was about to kill her, Gelus wrote the man’s name, extending her life against the law of his kind, and crumbled to dust; Rem carried his notebook to Misa.',
    characters: ['gelus', 'rem', 'misa'],
    chapter: 'shinigami',
    canon: 'both',
    sources: [anime(12), EPISODES_ES, CHARACTERS_EN, MISA_EN],
  },
  {
    id: 'light-joins-task-force',
    arc: 'second-kira',
    episode: 12,
    title: 'Light joins the task force',
    summary:
      'L brings Light into the investigation to study the tapes, and Light confirms what L already suspects: a second Kira with different powers. The second Kira’s reply to a staged message from “Kira” speaks openly of Shinigami and asks for a meeting.',
    characters: ['light', 'l', 'soichiro', 'matsuda', 'aizawa', 'misa'],
    chapter: 'misa',
    canon: 'both',
    sources: [anime(12), EPISODES_IT],
  },
  {
    id: 'aoyama',
    arc: 'second-kira',
    episode: [13, 14],
    title: 'Aoyama',
    summary:
      'Reading the second Kira’s diary as an invitation, Light goes to Aoyama with Matsuda and friends. Misa spots him — the one face whose lifespan she cannot see — and soon appears at his home; Light accepts her devotion, meaning to use it, while Rem warns him that she will kill him if Misa comes to harm.',
    characters: ['misa', 'light', 'matsuda', 'rem', 'ryuk'],
    chapter: 'misa',
    canon: 'both',
    sources: [anime(13), anime(14), EPISODES_ES],
  },

  /* Confinement ------------------------------------------------------ */
  {
    id: 'misa-arrested',
    arc: 'confinement',
    episode: 15,
    title: 'Misa’s arrest',
    summary:
      'Misa meets L at the university and sees his true name, but is arrested as the suspected second Kira before she can pass it on. Held blindfolded and bound, she gives up ownership of her notebook on Rem’s advice and loses every memory tied to it — though not her love for Light.',
    characters: ['misa', 'l', 'rem', 'watari', 'light'],
    chapter: 'confinement',
    canon: 'both',
    sources: [anime(15), EPISODES_ES, CHAPTERS_EN, MISA_EN],
  },
  {
    id: 'notebook-exchange',
    arc: 'confinement',
    episode: [15, 16],
    title: 'The exchange in the woods',
    summary:
      'Light trades notebooks with Rem: she leaves with his original, which she will later hand to a new owner, while the notebook that had been Misa’s — now tied to Ryuk — is buried in the woods. Both moves are built to work after Light himself has forgotten them.',
    characters: ['light', 'rem', 'ryuk', 'misa'],
    chapter: 'confinement',
    canon: 'both',
    note: 'The anime shows the burial in Ep. 16 and lets the full design emerge in retrospect, as Rem pieces it together in Ep. 25.',
    sources: [anime(16), anime(24), CHAPTERS_EN, EPISODES_IT],
  },
  {
    id: 'light-confined',
    arc: 'confinement',
    episode: 16,
    title: 'Light’s confinement',
    summary:
      'Suggesting he might be Kira without knowing it, Light asks to be locked up, and Soichiro insists on confinement too. Under L’s cameras Light gives up ownership of the notebook and forgets everything — and after a pause the killings resume, seemingly clearing him.',
    characters: ['light', 'l', 'soichiro', 'ryuk'],
    chapter: 'confinement',
    canon: 'both',
    sources: [anime(16), EPISODES_IT, CHAPTERS_EN],
  },
  {
    id: 'mock-execution',
    arc: 'confinement',
    episode: [17, 18],
    title: 'The mock execution',
    summary:
      'To test them, Soichiro drives Light and Misa out of headquarters and threatens to shoot his son and then himself; the gun holds blanks, and neither suspect shows any power. Both are released — Light handcuffed to L.',
    characters: ['soichiro', 'light', 'misa', 'l'],
    chapter: 'confinement',
    canon: 'both',
    sources: [anime(17), anime(18), EPISODES_IT],
  },

  /* Yotsuba ---------------------------------------------------------- */
  {
    id: 'yotsuba-eight',
    arc: 'yotsuba',
    episode: 17,
    title: 'The Yotsuba eight',
    summary:
      'The new deaths serve profit. Eight executives of the Yotsuba Group meet weekly to decide which rivals should die, knowing that one of them holds Kira’s power but not which — Rem has given it to Kyosuke Higuchi.',
    characters: ['higuchi', 'rem'],
    chapter: 'yotsuba',
    canon: 'both',
    sources: [anime(17), CHARACTERS_EN],
  },
  {
    id: 'aiber-and-wedy',
    arc: 'yotsuba',
    episode: 18,
    title: 'Aiber and Wedy',
    summary:
      'As the police withdraw from the case, Aizawa leaves the task force to keep his post and support his family. L, chained to Light, recruits two specialists from his own network: Aiber, a con artist, and Wedy, a professional thief.',
    characters: ['aizawa', 'aiber', 'wedy', 'l', 'light'],
    chapter: 'yotsuba',
    canon: 'both',
    sources: [anime(18), EPISODES_IT, CHARACTERS_EN],
  },
  {
    id: 'matsuda-infiltrates',
    arc: 'yotsuba',
    episode: 19,
    title: 'Matsuda’s fall',
    summary:
      'Eager to prove himself, Matsuda slips into Yotsuba as Misa’s manager and is caught eavesdropping. Guided by L, he stages a fall from a balcony and lets the executives believe him dead.',
    characters: ['matsuda', 'misa', 'l'],
    chapter: 'yotsuba',
    canon: 'both',
    sources: [anime(19), EPISODES_IT, CHAPTERS_EN],
  },
  {
    id: 'misa-exposes-higuchi',
    arc: 'yotsuba',
    episode: [20, 21],
    title: 'Misa exposes Higuchi',
    summary:
      'L sends Misa into Yotsuba. Rem, protective of her, reveals that Higuchi holds the notebook and tells Misa of her forgotten past as the second Kira; Misa draws a confession out of Higuchi, succeeding where L’s surveillance had not.',
    characters: ['misa', 'rem', 'higuchi', 'l'],
    chapter: 'yotsuba',
    canon: 'both',
    sources: [anime(20), anime(21), EPISODES_IT, CHAPTERS_EN],
  },
  {
    id: 'sakura-tv-trap',
    arc: 'yotsuba',
    episode: 22,
    title: 'The Sakura TV trap',
    summary:
      'The task force stages a Sakura TV special in which Matsuda, presented as an anonymous insider, promises to reveal Kira’s identity — bait that sends Higuchi racing toward the studio.',
    characters: ['light', 'l', 'matsuda', 'higuchi'],
    chapter: 'yotsuba',
    canon: 'both',
    sources: [anime(22), EPISODES_IT],
  },
  {
    id: 'higuchi-captured',
    arc: 'yotsuba',
    episode: [23, 24],
    title: 'Higuchi’s capture',
    summary:
      'On the road, Higuchi trades with Rem for the eyes, and L realises that he can now kill with a glance. Police cars driven by Aizawa and Ide block his escape; after his arrest, Watari shoots the gun from his hand before he can turn it on himself.',
    characters: ['higuchi', 'rem', 'aizawa', 'ide', 'watari', 'l', 'light'],
    chapter: 'yotsuba',
    canon: 'both',
    sources: [anime(23), anime(24), CHARACTERS_EN, CHARACTERS_JA],
  },
  {
    id: 'light-revives',
    arc: 'yotsuba',
    episode: 24,
    date: '2004-10-28',
    title: 'Revival',
    summary:
      'As the team handles Higuchi’s notebook, each of them sees Rem. When Light touches it — the notebook he once owned — his memories return, and he kills Higuchi with a scrap hidden in his wristwatch.',
    characters: ['light', 'higuchi', 'rem', 'ryuk', 'l'],
    chapter: 'yotsuba',
    canon: 'both',
    note: 'Date from the manga’s chronology (Higuchi’s death); anime calendar: 2007.',
    sources: [anime(24), CHAPTERS_EN, CHARACTERS_JA],
  },
  {
    id: 'false-rules',
    arc: 'yotsuba',
    episode: 24,
    title: 'The thirteen-day rule',
    summary:
      'The notebook carries two rules Light had planted: an owner who writes no name for thirteen days will die, and destroying the notebook kills everyone who has touched it. Light and Misa survived far longer in custody, so the first seems to prove their innocence, and they are freed.',
    characters: ['light', 'misa', 'l'],
    chapter: 'yotsuba',
    canon: 'both',
    sources: [anime(24), EPISODES_IT],
  },

  /* The end of L ----------------------------------------------------- */
  {
    id: 'misa-second-deal',
    arc: 'end-of-l',
    episode: 24,
    title: 'The second eye deal',
    summary:
      'On Light’s instructions, Misa digs up the buried notebook and recovers her memories. Because the exchange in the woods tied Ryuk to it, she can trade with him for the eyes a second time — halving her remaining life again — to learn L’s name anew.',
    characters: ['misa', 'ryuk', 'light'],
    chapter: 'end-of-l',
    canon: 'both',
    sources: [anime(24), EPISODES_IT, MISA_EN],
  },
  {
    id: 'thirteen-day-test',
    arc: 'end-of-l',
    episode: 25,
    title: 'L moves to test the rule',
    summary:
      'L questions Rem, who reveals as little as she can, and resolves to test the thirteen-day rule on a condemned prisoner — the one fact still shielding Misa. Rem understands that Light has arranged matters so that only L’s death can save her.',
    characters: ['l', 'rem', 'light', 'misa'],
    chapter: 'end-of-l',
    canon: 'both',
    sources: [anime(25)],
  },
  {
    id: 'rain-on-the-roof',
    arc: 'end-of-l',
    episode: 25,
    title: 'Rain on the rooftop',
    summary:
      'In a sequence created for the anime, Light finds L standing in the rain on the headquarters roof, and L speaks of how isolated he is and how often people lie. Back inside, L quietly dries Light’s feet.',
    characters: ['l', 'light'],
    chapter: 'end-of-l',
    canon: 'anime',
    note: 'Anime addition; the manga moves directly to Rem’s decision.',
    sources: [anime(25), L_EN],
  },
  {
    id: 'rem-kills-l',
    arc: 'end-of-l',
    episode: 25,
    date: '2004-11-05',
    title: 'Rem’s choice',
    summary:
      'Rem writes the names of Watari and L in her own notebook, knowing that killing to prolong Misa’s life will destroy her, and crumbles to dust. Watari dies first; L collapses into Light’s arms, and the face looking down at him confirms what he had suspected.',
    characters: ['rem', 'watari', 'l', 'light', 'misa'],
    chapter: 'end-of-l',
    canon: 'both',
    note: 'Date from the manga’s chronology; anime calendar: 5 November 2007.',
    sources: [anime(25), L_EN, CHARACTERS_JA],
  },
  {
    id: 'light-becomes-l',
    arc: 'end-of-l',
    episode: 26,
    title: 'Light becomes L',
    summary:
      'Light pockets Rem’s notebook, deletes the account of the case that L had recorded, and is accepted by the task force as L’s successor while L’s death is kept secret. He then kills the remaining Yotsuba executives and L’s agents, Aiber and Wedy.',
    characters: ['light', 'aiber', 'wedy', 'aizawa', 'matsuda', 'soichiro'],
    chapter: 'end-of-l',
    canon: 'both',
    note: 'Aiber’s death differs: in the anime he suffers a heart attack at home before his wife and son; in the manga he dies of liver cancer in a Paris hospital.',
    sources: [anime(26), EPISODES_ES, CHARACTERS_EN, CHARACTERS_JA],
  },

  /* Successors ------------------------------------------------------- */
  {
    id: 'wammys-house',
    arc: 'successors',
    episode: [26, 27],
    title: 'Wammy’s House',
    summary:
      'L’s systems alert Roger Ruvie at Wammy’s House, the orphanage for gifted children in Winchester founded by Watari. He tells the two boys raised as L’s potential successors; Mello refuses to work alongside Near and leaves.',
    characters: ['roger', 'near', 'mello', 'watari'],
    chapter: 'successors',
    canon: 'both',
    sources: [anime(26), anime(27), EPISODES_ES, CHARACTERS_EN],
  },
  {
    id: 'five-years-later',
    arc: 'successors',
    episode: 26,
    date: '2009',
    title: 'Five years later',
    summary:
      'The story leaps forward about five years. Light works at the National Police Agency while secretly serving as L, and Kira — still killing — commands an open following around the world.',
    characters: ['light', 'misa'],
    chapter: 'successors',
    canon: 'both',
    note: 'The manga’s chronology places Part II in 2009; the anime’s own dates for Part II fall in 2012.',
    sources: [anime(26), EPISODES_ES, SERIES_JA, LIGHT_JA],
  },
  {
    id: 'spk-founded',
    arc: 'successors',
    episode: 27,
    date: '2009',
    title: 'Near and the SPK',
    summary:
      'With the backing of the US President, Near assembles the SPK — the Special Provision for Kira — from FBI and CIA agents. In his first contact with the Japanese task force he makes it plain that he knows the original L is dead.',
    characters: ['near', 'rester', 'gevanni', 'lidner'],
    chapter: 'successors',
    canon: 'both',
    note: 'Founded in 2009 in the manga’s chronology; 2012 in the anime’s.',
    sources: [anime(27), EPISODES_ES, CHARACTERS_EN, SERIES_JA],
  },
  {
    id: 'mello-kidnappings',
    arc: 'successors',
    episode: 27,
    title: 'Mello’s gambit',
    summary:
      'Mello, now working with a Mafia organisation in the United States, kidnaps the director of the National Police Agency and demands the task force’s notebook; Light kills the hostage rather than risk it. Mello then abducts Light’s sister, Sayu.',
    characters: ['mello', 'light', 'sayu'],
    chapter: 'successors',
    canon: 'both',
    sources: [anime(27), EPISODES_ES],
  },
  {
    id: 'sayu-exchange',
    arc: 'successors',
    episode: 28,
    title: 'The Los Angeles exchange',
    summary:
      'Soichiro carries the notebook to Los Angeles, with Light tracking him from afar, and trades it for his daughter. Sayu comes home alive but deeply traumatised, and Mello turns the notebook on the SPK, killing most of its members.',
    characters: ['soichiro', 'sayu', 'mello', 'light', 'near'],
    chapter: 'successors',
    canon: 'both',
    sources: [anime(28), EPISODES_ES, CHARACTERS_EN],
  },
  {
    id: 'sidoh-notebook',
    arc: 'successors',
    episode: [28, 29],
    title: 'Sidoh’s notebook',
    summary:
      'In the Shinigami realm, Sidoh learns that the notebook Ryuk dropped — Light’s first — was his own. He follows it to Mello’s hideout, where the truth that the thirteen-day rule is false reaches Mello; after the raid, Light returns the notebook to Sidoh to keep him out of the way.',
    characters: ['sidoh', 'ryuk', 'mello', 'light'],
    chapter: 'shinigami',
    canon: 'both',
    sources: [anime(28), anime(29), EPISODES_ES, CHARACTERS_EN],
  },
  {
    id: 'soichiro-raid',
    arc: 'successors',
    episode: 29,
    date: '2009-11',
    title: 'A father’s eyes',
    summary:
      'To lead the raid on Mello’s hideout, Soichiro trades half his remaining life with Ryuk for the eyes. He sees Mello’s real name but is shot before he can write it, and Mello escapes by setting off explosives that leave him badly scarred. Dying in hospital, Soichiro sees his son’s lifespan and believes that Light cannot be Kira.',
    characters: ['soichiro', 'ryuk', 'mello', 'light'],
    chapter: 'successors',
    canon: 'both',
    note: 'The guidebook chronology dates Soichiro’s death to 11 November 2009; the anime sets the raid in November 2012. Light had given up ownership of his notebook beforehand, which is why his lifespan was visible.',
    sources: [anime(29), EPISODES_ES, CHARACTERS_JA],
  },
  {
    id: 'mello-visits-near',
    arc: 'successors',
    episode: 30,
    title: 'Mello visits Near',
    summary:
      'Scarred and hunted, Mello enters SPK headquarters with Halle Lidner as his hostage, takes back the only photograph of himself, and leaves Near what he has learned: Shinigami are real, and the thirteen-day rule is a lie.',
    characters: ['mello', 'near', 'lidner', 'rester', 'gevanni'],
    chapter: 'successors',
    canon: 'both',
    sources: [anime(30)],
  },

  /* The new Kira era ------------------------------------------------- */
  {
    id: 'kiras-kingdom',
    arc: 'new-kira',
    episode: [30, 31],
    title: 'Kira’s Kingdom',
    summary:
      'Sakura TV’s Kira’s Kingdom broadcasts Kira’s will, and the station’s director, Hitoshi Demegawa, now Kira’s self-appointed spokesman, calls on followers to storm the SPK’s New York headquarters. The SPK escapes by scattering banknotes into the crowd, and Misa, waiting outside to see Near’s face, comes away with nothing.',
    characters: ['light', 'near', 'misa', 'rester', 'gevanni', 'lidner'],
    chapter: 'new-kira',
    canon: 'both',
    sources: [anime(30), anime(31), CHARACTERS_EN],
  },
  {
    id: 'aizawa-doubts',
    arc: 'new-kira',
    episode: 31,
    title: 'Aizawa’s doubt',
    summary:
      'Increasingly uneasy about Light, Aizawa passes information to Near and asks for Light and Misa to be watched again. Light agrees at once — and the killings continue regardless, carried out by someone else.',
    characters: ['aizawa', 'near', 'light', 'misa'],
    chapter: 'new-kira',
    canon: 'both',
    sources: [anime(31)],
  },
  {
    id: 'mikami-x-kira',
    arc: 'new-kira',
    episode: [31, 32],
    title: 'Teru Mikami',
    summary:
      'The new hand is Teru Mikami, a prosecutor whose zeal on Kira’s Kingdom caught Light’s eye and who now holds the notebook that had been Misa’s. Near will call him X-Kira; he soon kills Demegawa for exploiting Kira’s name for money.',
    characters: ['mikami', 'light', 'misa', 'near'],
    chapter: 'new-kira',
    canon: 'both',
    note: 'Near’s label “X-Kira” distinguishes the hidden executioner from Kira himself.',
    sources: [anime(31), anime(32), CHARACTERS_EN, EPISODES_FR],
  },
  {
    id: 'takada-spokesperson',
    arc: 'new-kira',
    episode: 32,
    title: 'Kira’s spokesperson',
    summary:
      'Mikami names the NHN newscaster Kiyomi Takada — Light’s girlfriend in his university days — as Kira’s official voice. Light arranges supervised meetings with her, reveals himself to Mikami through her, and asks her to stand beside him as the goddess of his new world.',
    characters: ['takada', 'mikami', 'light'],
    chapter: 'new-kira',
    canon: 'both',
    sources: [anime(32), CHARACTERS_EN],
  },

  /* Finale ----------------------------------------------------------- */
  {
    id: 'near-to-japan',
    arc: 'finale',
    episode: 33,
    title: 'Near comes to Japan',
    summary:
      'Near moves to Japan, presenting himself as bait. Reasoning that Kira’s hidden executioner has the eyes and takes his orders through Takada, he places Lidner beside her as a bodyguard.',
    characters: ['near', 'lidner', 'takada'],
    chapter: 'final-strategy',
    canon: 'both',
    sources: [anime(33)],
  },
  {
    id: 'gevanni-shadows-mikami',
    arc: 'finale',
    episode: [33, 34],
    title: 'Gevanni on Mikami’s trail',
    summary:
      'Gevanni shadows Mikami, watches him write names in the notebook at fixed times, then finds it in a gym locker and photographs every page; Near confirms that the handwriting is Mikami’s.',
    characters: ['gevanni', 'mikami', 'near'],
    chapter: 'final-strategy',
    canon: 'both',
    sources: [anime(33), anime(34), CHARACTERS_EN],
  },
  {
    id: 'notes-and-decoys',
    arc: 'finale',
    episode: [33, 34],
    title: 'Notes and decoys',
    summary:
      'Light and Takada pass written instructions during meetings the task force is watching, even as Aizawa marks the notepads. Expecting the SPK to find Mikami’s notebook, Light arranges for him to carry a decoy while the real one stays hidden — and Takada receives genuine pages of her own.',
    characters: ['light', 'takada', 'mikami', 'aizawa'],
    chapter: 'final-strategy',
    canon: 'both',
    sources: [anime(33), anime(34), anime(36), EPISODES_IT],
  },
  {
    id: 'takada-abducted',
    arc: 'finale',
    episode: 35,
    date: '2010-01-26',
    title: 'Mello’s last move',
    summary:
      'Mello abducts Takada while his friend Matt draws off her bodyguards and is shot dead. Takada kills Mello with a page hidden in her clothing, then dies by fire along with the evidence: Light writes her name on a scrap from his watch, and Mikami — acting on his own — writes it in the real notebook.',
    characters: ['mello', 'matt', 'takada', 'light', 'mikami'],
    chapter: 'final-strategy',
    canon: 'both',
    note: 'Date from the manga’s chronology; anime calendar: 2013. Mikami’s unscripted entry is revealed only at the Yellow Box (Ep. 37).',
    sources: [anime(35), anime(37), EPISODES_IT, CHARACTERS_JA],
  },
  {
    id: 'yellow-box',
    arc: 'finale',
    episode: 36,
    date: '2010-01-28',
    title: 'The Yellow Box',
    summary:
      'Near gathers the SPK and the task force in an abandoned warehouse known as the Yellow Box. Mikami, watching through a gap in the door with his eyes, writes every name present except Light’s, and as the forty seconds run out, Light declares victory.',
    characters: [
      'near',
      'light',
      'mikami',
      'rester',
      'gevanni',
      'lidner',
      'matsuda',
      'aizawa',
      'mogi',
      'ide',
    ],
    chapter: 'confrontation',
    canon: 'both',
    note: 'Date from the manga’s chronology; in the anime’s calendar, 28 January 2013 — the day the episode title “1.28” marks.',
    sources: [anime(36), EPISODES_IT, LIGHT_EN, LIGHT_JA],
  },
  {
    id: 'nobody-dies',
    arc: 'finale',
    episode: 37,
    title: 'Nobody dies',
    summary:
      'No one falls. Near explains that Mikami’s one slip — retrieving the real notebook to write Takada’s name — led Gevanni to it, and that the SPK replaced it with a copy; the only name missing from Mikami’s page is Light’s. Mikami is seized, and Light, cornered, admits that he is Kira.',
    characters: ['near', 'light', 'mikami', 'gevanni'],
    chapter: 'fall',
    canon: 'both',
    sources: [anime(37), EPISODES_IT, EPISODES_FR],
  },
  {
    id: 'matsuda-fires',
    arc: 'finale',
    episode: 37,
    title: 'Matsuda fires',
    summary:
      'As Light reaches for the scrap hidden in his watch, Matsuda — anguished at what Light has made of his father’s sacrifice — shoots him several times.',
    characters: ['matsuda', 'light', 'near'],
    chapter: 'fall',
    canon: 'both',
    sources: [anime(37), EPISODES_IT, CHARACTERS_EN],
  },
  {
    id: 'mikami-anime-death',
    arc: 'finale',
    episode: 37,
    title: 'Mikami’s end',
    summary:
      'Seeing the god he served reduced to a bleeding, desperate man, Mikami stabs himself with his pen, and in the confusion Light slips out of the warehouse.',
    characters: ['mikami', 'light'],
    chapter: 'fall',
    canon: 'anime',
    note: 'Manga: Mikami is taken into custody and dies in prison about ten days later, having lost his mind (7 February 2010 in the guidebook chronology).',
    sources: [anime(37), CHARACTERS_EN, CHARACTERS_JA, LIGHT_JA],
  },
  {
    id: 'ryuk-keeps-his-promise',
    arc: 'finale',
    episode: 37,
    date: '2010-01-28',
    title: 'Ryuk keeps his promise',
    summary:
      'With Light defeated and no longer entertaining, Ryuk writes Light’s name in his own notebook, as he warned on the day they met. Light dies of a heart attack.',
    characters: ['ryuk', 'light'],
    chapter: 'fall',
    canon: 'both',
    note: 'Manga: inside the warehouse, Light begs Ryuk to kill the others, and Ryuk writes his name instead. Anime: Light never asks; Ryuk writes from a high vantage point after Light has fled. Date from the manga’s chronology; anime calendar: 2013.',
    sources: [anime(37), RYUK_EN, LIGHT_EN, LIGHT_JA],
  },
  {
    id: 'the-stairway',
    arc: 'finale',
    episode: 37,
    title: 'The stairway',
    summary:
      'Wounded, Light staggers along a road at sunset and glimpses his younger, pre-notebook self. He dies on a warehouse stairway, seeing L before him in his last moments.',
    characters: ['light', 'l'],
    chapter: 'fall',
    canon: 'anime',
    note: 'Manga: Light dies on the floor of the Yellow Box, pleading for his life, in front of Near and the task force.',
    sources: [anime(37), LIGHT_JA, RYUK_EN],
  },
  {
    id: 'misa-at-the-edge',
    arc: 'finale',
    episode: 37,
    title: 'Misa at the edge',
    summary:
      'Among the anime’s final images, Misa stands alone beyond the railing of a high rooftop at sunset. What follows is not shown.',
    characters: ['misa'],
    chapter: 'fall',
    canon: 'anime',
    note: 'Manga: Misa is not seen after Light’s death. The guidebook How to Read 13 dates her death to a little over a year after his; the anime’s official analysis guide lists it as unknown.',
    sources: [anime(37), EPISODES_IT, MISA_EN],
  },
  {
    id: 'one-year-later',
    arc: 'finale',
    episode: 37,
    title: 'One year later',
    summary:
      'A year after Kira’s fall, crime has returned to its former level, the task force members wrestle with what they did, and Near works as the new L, with Roger in Watari’s place. On a mountainside, Kira’s worshippers still gather beneath the moon.',
    characters: ['near', 'matsuda', 'ide', 'aizawa', 'roger'],
    chapter: 'fall',
    canon: 'manga',
    note: 'Manga-only epilogue (the final chapter, set a year later), listed here after Ep. 37; the anime ends without it. In it Matsuda speculates that Near used the notebook to steer Mikami; Ide points out there is no proof, and the guidebook leaves the question to the reader.',
    sources: [SERIES_EN, LIGHT_EN, CHARACTERS_EN, GWERN],
  },
];
