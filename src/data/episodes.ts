/**
 * The 37 episodes of the Madhouse anime (Nippon TV, 2006–2007).
 *
 * - `title`: the English titles of the Viz Media release (as used on its DVDs and on
 *   streaming services), checked against Wikipedia's episode list and a streaming listing.
 * - `titleJa`: the Japanese title with its Hepburn romanisation, checked against both the
 *   English and Japanese Wikipedia episode tables. Episode 36's title is the numeral "1.28"
 *   in both languages.
 * - `aired`: the original Japanese broadcast date as given in both Wikipedia tables. The
 *   series aired in a late-night Tuesday slot (24:56), so some listings give the previous
 *   calendar day (e.g. 3 October 2006 for episode 1).
 * - `summary`: original one-sentence wording; no dialogue.
 * - `chapter`: the site chapter that best fits the episode as a whole. Individual events
 *   inside an episode may belong to other chapters — see `timeline.ts`.
 *
 * Research notes and sources: docs/content/story-reference.md
 */
import type { Episode } from './types';

export const EPISODES: readonly Episode[] = [
  {
    number: 1,
    title: 'Rebirth',
    titleJa: '新生 (Shinsei)',
    aired: '2006-10-04',
    summary:
      'High-school prodigy Light Yagami picks up a notebook dropped by the bored Shinigami Ryuk, proves to himself that it kills, and resolves to purge the world of criminals.',
    chapter: 'light',
  },
  {
    number: 2,
    title: 'Confrontation',
    titleJa: '対決 (Taiketsu)',
    aired: '2006-10-11',
    summary:
      'As criminals worldwide die of heart attacks, Interpol turns to the detective L, whose televised decoy, Lind L. Tailor, draws Kira into revealing that he is in Japan’s Kanto region.',
    chapter: 'kira',
  },
  {
    number: 3,
    title: 'Dealings',
    titleJa: '取引 (Torihiki)',
    aired: '2006-10-18',
    summary:
      'L profiles Kira as a student with access to police information, while Ryuk offers Light the Shinigami eyes and warns him that he is being followed.',
    chapter: 'l',
  },
  {
    number: 4,
    title: 'Pursuit',
    titleJa: '追跡 (Tsuiseki)',
    aired: '2006-10-25',
    summary:
      'Light refuses the eye deal and stages a bus hijacking to unmask the man tailing him, FBI agent Raye Penber.',
    chapter: 'first-battle',
  },
  {
    number: 5,
    title: 'Tactics',
    titleJa: '駆引 (Kakehiki)',
    aired: '2006-11-01',
    summary:
      'Light turns Raye into the instrument of the FBI team’s deaths, the shaken Japanese police divide, and L meets in person the few officers who stay.',
    chapter: 'first-battle',
  },
  {
    number: 6,
    title: 'Unraveling',
    titleJa: '綻び (Hokorobi)',
    aired: '2006-11-08',
    summary:
      'Raye’s fiancée, former FBI agent Naomi Misora, brings a dangerous theory to police headquarters, where Light intercepts her and sets out to learn her real name.',
    chapter: 'first-battle',
  },
  {
    number: 7,
    title: 'Overcast',
    titleJa: '曇天 (Donten)',
    aired: '2006-11-15',
    summary:
      'Light sends Naomi Misora to her death, as Watari reveals himself to the task force and L narrows his attention to the families of the police.',
    chapter: 'first-battle',
  },
  {
    number: 8,
    title: 'Glare',
    titleJa: '目線 (Mesen)',
    aired: '2006-11-22',
    summary:
      'L places cameras and microphones in the Yagami home, and Light goes on killing in full view of them through an audacious sleight of hand.',
    chapter: 'first-battle',
  },
  {
    number: 9,
    title: 'Encounter',
    titleJa: '接触 (Sesshoku)',
    aired: '2006-11-29',
    summary:
      'At To-Oh University, an odd fellow freshman calling himself Hideki Ryuga quietly tells Light that he is L.',
    chapter: 'first-battle',
  },
  {
    number: 10,
    title: 'Doubt',
    titleJa: '疑惑 (Giwaku)',
    aired: '2006-12-06',
    summary:
      'L tests Light over tennis and coffee, Soichiro collapses with a heart attack, and Sakura TV receives tapes from someone claiming to be Kira.',
    chapter: 'first-battle',
  },
  {
    number: 11,
    title: 'Assault',
    titleJa: '突入 (Totsunyū)',
    aired: '2006-12-13',
    summary:
      'Sakura TV airs the tapes, Ukita dies at the station’s door and Soichiro storms the building — while the second Kira is revealed to be Misa Amane.',
    chapter: 'misa',
  },
  {
    number: 12,
    title: 'Love',
    titleJa: '恋心 (Koigokoro)',
    aired: '2006-12-27',
    summary:
      'Light joins the task force and helps bait the second Kira, as Rem recalls how the Shinigami Gelus died to save Misa.',
    chapter: 'misa',
  },
  {
    number: 13,
    title: 'Confession',
    titleJa: '告白 (Kokuhaku)',
    aired: '2007-01-10',
    summary:
      'In Aoyama, Misa recognises Light as Kira through her Shinigami eyes and soon arrives at his door to declare her devotion.',
    chapter: 'misa',
  },
  {
    number: 14,
    title: 'Friend',
    titleJa: '友達 (Tomodachi)',
    aired: '2007-01-17',
    summary:
      'Light accepts Misa as an ally he means to exploit, Rem warns him what harming her will cost, and L concludes that the two Kiras have met.',
    chapter: 'misa',
  },
  {
    number: 15,
    title: 'Wager',
    titleJa: '賭け (Kake)',
    aired: '2007-01-24',
    summary:
      'Misa learns L’s true name but is arrested before she can share it, and in captivity she gives up her notebook and every memory of it.',
    chapter: 'confinement',
  },
  {
    number: 16,
    title: 'Decision',
    titleJa: '決断 (Ketsudan)',
    aired: '2007-01-31',
    summary:
      'Light has himself confined, surrenders the notebook and his memories with it, and the killings stop — then begin again.',
    chapter: 'confinement',
  },
  {
    number: 17,
    title: 'Execution',
    titleJa: '執行 (Shikkō)',
    aired: '2007-02-07',
    summary:
      'Soichiro stages a mock execution to test Light and Misa, who are released, while eight executives of the Yotsuba Group meet to choose their next victim.',
    chapter: 'confinement',
  },
  {
    number: 18,
    title: 'Ally',
    titleJa: '仲間 (Nakama)',
    aired: '2007-02-14',
    summary:
      'Chained together, L and Light trace the new killings to the Yotsuba Group, Aizawa leaves the team, and L brings in Aiber and Wedy.',
    chapter: 'yotsuba',
  },
  {
    number: 19,
    title: 'Matsuda',
    titleJa: '松田 (Matsuda)',
    aired: '2007-02-21',
    summary:
      'Matsuda infiltrates Yotsuba as Misa’s manager, is caught, and survives only by faking his own death.',
    chapter: 'yotsuba',
  },
  {
    number: 20,
    title: 'Makeshift',
    titleJa: '姑息 (Kosoku)',
    aired: '2007-02-28',
    summary:
      'With Yotsuba’s meetings under surveillance, Light and L persuade the executive Reiji Namikawa to stall the killings and enlist Misa as an infiltrator.',
    chapter: 'yotsuba',
  },
  {
    number: 21,
    title: 'Performance',
    titleJa: '活躍 (Katsuyaku)',
    aired: '2007-03-07',
    summary:
      'Guided by Rem, Misa discovers that Kyosuke Higuchi is the third Kira and coaxes a confession out of him.',
    chapter: 'yotsuba',
  },
  {
    number: 22,
    title: 'Guidance',
    titleJa: '誘導 (Yūdō)',
    aired: '2007-03-14',
    summary:
      'The task force stages a Sakura TV special in which Matsuda promises to unmask Kira, drawing Higuchi into the open.',
    chapter: 'yotsuba',
  },
  {
    number: 23,
    title: 'Frenzy',
    titleJa: '狂騒 (Kyōsō)',
    aired: '2007-03-21',
    summary:
      'Racing toward the studio, Higuchi trades for the Shinigami eyes, and the task force runs him down on the road.',
    chapter: 'yotsuba',
  },
  {
    number: 24,
    title: 'Revival',
    titleJa: '復活 (Fukkatsu)',
    aired: '2007-03-28',
    summary:
      'Touching Higuchi’s notebook restores Light’s memories; he kills Higuchi, two planted rules clear his name, and Misa regains the eyes through a deal with Ryuk.',
    chapter: 'yotsuba',
  },
  {
    number: 25,
    title: 'Silence',
    titleJa: '沈黙 (Chinmoku)',
    aired: '2007-04-04',
    summary:
      'As L prepares to test the thirteen-day rule, Rem gives her own life to kill Watari and L.',
    chapter: 'end-of-l',
  },
  {
    number: 26,
    title: 'Renewal',
    titleJa: '再生 (Saisei)',
    aired: '2007-04-11',
    summary:
      'Light erases L’s record of the case and inherits his role, the story leaps five years ahead, and word of L’s death reaches two children at Wammy’s House.',
    chapter: 'end-of-l',
  },
  {
    number: 27,
    title: 'Abduction',
    titleJa: '誘拐 (Yūkai)',
    aired: '2007-04-18',
    summary:
      'Near forms the SPK while Mello, backed by the Mafia, kidnaps the director of the National Police Agency and then Light’s sister, Sayu.',
    chapter: 'successors',
  },
  {
    number: 28,
    title: 'Impatience',
    titleJa: '焦燥 (Shōsō)',
    aired: '2007-04-25',
    summary:
      'Soichiro trades the notebook for Sayu in Los Angeles, Mello turns it on the SPK, and the Shinigami Sidoh learns that his notebook is missing.',
    chapter: 'successors',
  },
  {
    number: 29,
    title: 'Father',
    titleJa: '父親 (Chichioya)',
    aired: '2007-05-02',
    summary:
      'Soichiro makes the eye deal to lead a raid on Mello’s hideout and is fatally wounded, dying convinced that his son is not Kira.',
    chapter: 'successors',
  },
  {
    number: 30,
    title: 'Justice',
    titleJa: '正義 (Seigi)',
    aired: '2007-05-09',
    summary:
      'A scarred Mello brings Near the truth about Shinigami and the false rule, while Kira’s Kingdom and its host Demegawa turn Kira’s followers against the SPK.',
    chapter: 'new-kira',
  },
  {
    number: 31,
    title: 'Transfer',
    titleJa: '移譲 (Ijō)',
    aired: '2007-05-16',
    summary:
      'The SPK escapes a mob in New York, Aizawa quietly aids Near, and a new hand behind the killings — Teru Mikami — is revealed.',
    chapter: 'new-kira',
  },
  {
    number: 32,
    title: 'Selection',
    titleJa: '選択 (Sentaku)',
    aired: '2007-05-23',
    summary:
      'Mikami’s past comes to light, and his choice of Kiyomi Takada as Kira’s spokesperson gives Light a hidden line to his executioner.',
    chapter: 'new-kira',
  },
  {
    number: 33,
    title: 'Scorn',
    titleJa: '嘲笑 (Chōshō)',
    aired: '2007-05-30',
    summary:
      'Near moves to Japan, Misa and Takada clash, and Gevanni catches Mikami writing in the notebook.',
    chapter: 'final-strategy',
  },
  {
    number: 34,
    title: 'Vigilance',
    titleJa: '虎視 (Koshi)',
    aired: '2007-06-06',
    summary:
      'Light directs Takada through written notes under the task force’s eyes, while Gevanni photographs Mikami’s notebook and Near sets his plan in motion.',
    chapter: 'final-strategy',
  },
  {
    number: 35,
    title: 'Malice',
    titleJa: '殺意 (Satsui)',
    aired: '2007-06-13',
    summary:
      'Mello and Matt abduct Takada; Matt is shot, Takada kills Mello with a hidden page, and she in turn dies by the notebook.',
    chapter: 'final-strategy',
  },
  {
    number: 36,
    title: '1.28',
    titleJa: '1.28',
    aired: '2007-06-20',
    summary:
      'Light and Near meet at the Yellow Box warehouse, where Mikami writes every name but Light’s and Light declares victory.',
    chapter: 'confrontation',
  },
  {
    number: 37,
    title: 'New World',
    titleJa: '新世界 (Shin Sekai)',
    aired: '2007-06-27',
    summary:
      'No one dies: Near exposes Light, Matsuda opens fire, and Ryuk writes Light’s name as he promised he one day would.',
    chapter: 'fall',
  },
];
