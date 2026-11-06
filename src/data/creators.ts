/**
 * Verified, public, professional facts about the creators of Death Note and the work itself.
 *
 * Every statement is original wording and is backed by at least two sources (listed per fact).
 * No private details, no speculation about identity, no quotations, no claims about the
 * creators' intentions or opinions. Research notes and the "not verified — do not use" list:
 * docs/content/creators-and-production.md
 */
import type { Creator, CreatorFact, SourceRef } from './types';

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

const EN_OHBA: SourceRef = {
  label: 'Wikipedia — Tsugumi Ohba',
  url: 'https://en.wikipedia.org/wiki/Tsugumi_Ohba',
};
const JA_OHBA: SourceRef = {
  label: 'Japanese Wikipedia — 大場つぐみ',
  url: 'https://ja.wikipedia.org/wiki/大場つぐみ',
};
const EN_OBATA: SourceRef = {
  label: 'Wikipedia — Takeshi Obata',
  url: 'https://en.wikipedia.org/wiki/Takeshi_Obata',
};
const JA_OBATA: SourceRef = {
  label: 'Japanese Wikipedia — 小畑健',
  url: 'https://ja.wikipedia.org/wiki/小畑健',
};
const EN_DEATH_NOTE: SourceRef = {
  label: 'Wikipedia — Death Note',
  url: 'https://en.wikipedia.org/wiki/Death_Note',
};
const JA_DEATH_NOTE: SourceRef = {
  label: 'Japanese Wikipedia — DEATH NOTE',
  url: 'https://ja.wikipedia.org/wiki/DEATH_NOTE',
};
const EN_CHAPTERS: SourceRef = {
  label: 'Wikipedia — List of Death Note chapters',
  url: 'https://en.wikipedia.org/wiki/List_of_Death_Note_chapters',
};
const EN_ANIME: SourceRef = {
  label: 'Wikipedia — Death Note (2006 TV series)',
  url: 'https://en.wikipedia.org/wiki/Death_Note_(2006_TV_series)',
};
const EN_EPISODES: SourceRef = {
  label: 'Wikipedia — List of Death Note episodes',
  url: 'https://en.wikipedia.org/wiki/List_of_Death_Note_episodes',
};
const EN_SOUNDTRACKS: SourceRef = {
  label: 'Wikipedia — Death Note original soundtracks',
  url: 'https://en.wikipedia.org/wiki/Death_Note_original_soundtracks',
};
const ANN_ANIME: SourceRef = {
  label: 'Anime News Network Encyclopedia — Death Note (TV)',
  url: 'https://www.animenewsnetwork.com/encyclopedia/anime.php?id=6592',
};
const ANN_VIZ_DVD: SourceRef = {
  label: 'Anime News Network — Viz Media announces Death Note anime DVD release (2007)',
  url: 'https://www.animenewsnetwork.com/press-release/2007-06-29/viz-media-announces-fall-dvd-release-of-death-note-anime-series',
};
const VIZ_SERIES: SourceRef = {
  label: 'Viz Media — Death Note (series page)',
  url: 'https://www.viz.com/shonenjump/chapters/death-note',
};
const VIZ_HOW_TO_READ: SourceRef = {
  label: 'Viz Media — Death Note, Vol. 13: How to Read',
  url: 'https://www.viz.com/manga-books/book/death-note-how-to-read-13/product/1333',
};
const VIZ_SHORT_STORIES: SourceRef = {
  label: 'Viz Media — Death Note Short Stories',
  url: 'https://www.viz.com/read/manga/death-note-short-stories/product/7069',
};
const VIZ_BLANC_ET_NOIR: SourceRef = {
  label: 'Viz Media — blanc et noir: Takeshi Obata Illustrations',
  url: 'https://www.viz.com/read/art-book/blanc-et-noir/product/3802',
};
const VIZ_OHBA_INTERVIEW: SourceRef = {
  label: 'Viz Media — interview with Tsugumi Ohba (2012)',
  url: 'https://viz.com/blog/posts/interview-tsugumi-ohba-691',
};
const WIKI_PILOT: SourceRef = {
  label: 'Death Note Wiki — Taro Kagami (pilot chapter)',
  url: 'https://deathnote.fandom.com/wiki/Taro_Kagami',
};
const WIKI_HOW_TO_READ: SourceRef = {
  label: 'Death Note Wiki — Death Note 13: How to Read',
  url: 'https://deathnote.fandom.com/wiki/Death_Note_13:_How_to_Read',
};

/* ------------------------------------------------------------------ */
/* Creators                                                            */
/* ------------------------------------------------------------------ */

export const CREATORS: readonly Creator[] = [
  {
    id: 'ohba',
    name: 'Tsugumi Ohba',
    nameJa: '大場 つぐみ',
    craft: 'Story',
    facts: [
      {
        text: 'Wrote Death Note, credited for its story, with Takeshi Obata as artist.',
        sources: [VIZ_SERIES, EN_DEATH_NOTE, JA_OHBA],
      },
      {
        text:
          'Supplied the story as storyboards — rough layouts of the pages — which Obata turned ' +
          'into the finished artwork.',
        sources: [VIZ_OHBA_INTERVIEW, EN_DEATH_NOTE],
      },
      {
        text:
          'Death Note began as a one-shot pilot in Weekly Shōnen Jump in 2003, before its ' +
          'serialization from December 2003 to May 2006.',
        sources: [JA_OHBA, JA_DEATH_NOTE, EN_DEATH_NOTE],
      },
      {
        text:
          'Returned to the story with two special one-shots, “C-Kira” (2008) and “a-Kira” ' +
          '(2020), both drawn by Obata.',
        sources: [EN_DEATH_NOTE, JA_DEATH_NOTE, JA_OHBA],
      },
      {
        text:
          'Reunited with Obata for Bakuman. (Weekly Shōnen Jump, 2008–2012, 20 volumes) and ' +
          'Platinum End (Jump SQ, 2015–2021, 14 volumes).',
        sources: [EN_OHBA, JA_OHBA],
      },
      {
        text:
          'Also wrote the one-shot Skip! Yamada-kun (Weekly Young Jump, 2014), drawn by ' +
          'Robico.',
        sources: [EN_OHBA, JA_OHBA],
      },
    ],
  },
  {
    id: 'obata',
    name: 'Takeshi Obata',
    nameJa: '小畑 健',
    craft: 'Art',
    facts: [
      {
        text:
          'Drew Death Note, giving its characters, its Shinigami and its world their visual ' +
          'form.',
        sources: [VIZ_SERIES, EN_DEATH_NOTE, EN_OBATA],
      },
      {
        text: 'Made his first serialization in 1989 with the gag manga Cyborg Jii-chan G.',
        sources: [EN_OBATA, JA_OBATA],
      },
      {
        text:
          'Before Death Note, illustrated Hikaru no Go (1998–2003), written by Yumi Hotta. It ' +
          'received the Shogakukan Manga Award and, in 2003, a Tezuka Osamu Cultural Prize.',
        sources: [EN_OBATA, JA_OBATA],
      },
      {
        text:
          'His collaborations with other writers include Ayatsuri Sakon (1995–1996), Blue ' +
          'Dragon: Ral Ω Grad (2006–2007), Gakkyū Hōtei (2014–2015) and Show-ha Shoten! ' +
          '(2021–2025).',
        sources: [EN_OBATA, JA_OBATA],
      },
      {
        text:
          'Drew the 2014 manga adaptation of Hiroshi Sakurazaka’s novel All You Need Is Kill, ' +
          'written for manga by Ryōsuke Takeuchi.',
        sources: [EN_OBATA, JA_OBATA],
      },
      {
        text: 'Reunited with Ohba for Bakuman. (2008–2012) and Platinum End (2015–2021).',
        sources: [EN_OBATA, JA_OBATA],
      },
      {
        text:
          'His illustration collection blanc et noir (Shueisha, 2006) gathers his Death Note ' +
          'artwork among other pieces; Viz Media published it in English in 2016.',
        sources: [EN_OBATA, VIZ_BLANC_ET_NOIR],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* The work                                                            */
/* ------------------------------------------------------------------ */

export const WORK_FACTS: readonly CreatorFact[] = [
  {
    text:
      'Serialized in Shueisha’s Weekly Shōnen Jump from December 2003 to May 2006 — issues ' +
      '2004 No. 1 to 2006 No. 24.',
    sources: [EN_DEATH_NOTE, JA_DEATH_NOTE],
  },
  {
    text:
      'The story runs to 108 chapters, collected by Shueisha in 12 volumes between April 2004 ' +
      'and July 2006.',
    sources: [EN_CHAPTERS, JA_DEATH_NOTE],
  },
  {
    text:
      'A pilot one-shot, following a schoolboy named Taro Kagami, appeared in Weekly Shōnen ' +
      'Jump in 2003 (issue No. 36).',
    sources: [JA_DEATH_NOTE, WIKI_PILOT],
  },
  {
    text:
      'The official guidebook Death Note 13: How to Read — character files, creator ' +
      'interviews, the complete rules and the pilot — was released in Japan on 13 October ' +
      '2006, and in English by Viz Media on 19 February 2008.',
    sources: [EN_CHAPTERS, JA_DEATH_NOTE, VIZ_HOW_TO_READ, WIKI_HOW_TO_READ],
  },
  {
    text:
      'Two special one-shots followed: “C-Kira” in Weekly Shōnen Jump in February 2008, and ' +
      '“a-Kira” in Jump SQ in February 2020.',
    sources: [EN_DEATH_NOTE, JA_DEATH_NOTE],
  },
  {
    text:
      'The pilot and the special one-shots were collected as Death Note Short Stories — ' +
      'Shueisha, February 2021; Viz Media, May 2022.',
    sources: [EN_DEATH_NOTE, JA_DEATH_NOTE, VIZ_SHORT_STORIES],
  },
  {
    text:
      'Viz Media publishes the manga in English in North America; its 12 volumes were ' +
      'released between October 2005 and July 2007.',
    sources: [EN_DEATH_NOTE, EN_CHAPTERS, VIZ_SERIES],
  },
  {
    text:
      'The anime was animated by Madhouse and directed by Tetsurō Araki, with series ' +
      'composition by Toshiki Inoue.',
    sources: [EN_ANIME, ANN_ANIME],
  },
  {
    text: 'It ran for 37 episodes on Nippon TV, from October 2006 to June 2007.',
    sources: [EN_ANIME, EN_EPISODES, JA_DEATH_NOTE],
  },
  {
    text: 'Its score was composed by Yoshihisa Hirano and Hideki Taniuchi.',
    sources: [EN_ANIME, EN_SOUNDTRACKS],
  },
  {
    text:
      'Two television specials retell the story in condensed form: Relight: Visions of a ' +
      'God (August 2007) and Relight 2: L’s Successors (August 2008).',
    sources: [EN_ANIME, JA_DEATH_NOTE],
  },
  {
    text: 'Viz Media also licensed the anime for North America.',
    sources: [EN_ANIME, ANN_VIZ_DVD],
  },
];
