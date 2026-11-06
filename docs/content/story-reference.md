# Story reference

The factual source document for the story content of **DEATH NOTE — THE JUDGMENT**: the
episode guide, the per-chapter fact sheets the site copy is written from, the differences
between the anime and the manga, and a list of claims the site must not make.

Data files built from this document: `src/data/episodes.ts`, `src/data/timeline.ts`,
`src/data/characters.ts`. Rules and supernatural mechanics live in
[rules-and-mechanics.md](rules-and-mechanics.md).

## Conventions

- **Canon.** The Madhouse anime (Nippon TV, 4 October 2006 – 27 June 2007, 37 episodes,
  directed by Tetsurō Araki) is the primary continuity. Manga-only material — including the
  official guidebook _Death Note 13: How to Read_ (Japan, 13 October 2006) — is labelled.
- **Wording.** Everything here and on the site is original paraphrase. No dialogue is
  reproduced and no quotation is attributed to any character, creator or staff member.
- **Two calendars.** The manga's chronology (fixed by the guidebook) runs from November 2003 to
  January 2010. **The anime moves its entire calendar three years later**: birth and death
  years are shifted by three (Light 1986 → 1989, L 1979 → 1982, Raye's death 2003 → 2006,
  Watari's 2004 → 2007, Soichiro's 2009 → 2012, Light's 2010 → 2013), and the anime's own dates
  for Part II fall in 2012 (episodes 26 and 29). Data files use the manga dates and note the
  anime year. See [§5](#5-dates-two-calendars).
- **Air dates.** Calendar dates as given in both the English and Japanese Wikipedia episode
  tables. The show aired in a late-night Tuesday slot (24:56), so some listings give the
  previous day — e.g. the Japanese Wikipedia series article gives the run as 3 October 2006 –
  26 June 2007.
- **English titles.** The Viz Media titles, as used on the English DVD release and streaming
  services (checked against Wikipedia and Netflix's listing).
- **Real names never stated in the story** (L, Near, Mello's spelling, Matt, the SPK agents,
  Aiber, Wedy) come from official supplementary material, chiefly _How to Read 13_. The site
  may show them only as such, labelled.

---

## 1. Episode guide

| #   | English title | Japanese title      | Aired (JST) | Site chapter   | Core events                                                                                                         |
| --- | ------------- | ------------------- | ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | Rebirth       | 新生 _Shinsei_      | 2006-10-04  | light          | Ryuk drops the notebook; Light's first tests; Ryuk appears                                                          |
| 2   | Confrontation | 対決 _Taiketsu_     | 2006-10-11  | kira           | Worldwide heart attacks; "Kira"; Interpol turns to L; Lind L. Tailor; Kanto                                         |
| 3   | Dealings      | 取引 _Torihiki_     | 2006-10-18  | l              | L's student profile; task force led by Soichiro; eye deal offered; Light is followed                                |
| 4   | Pursuit       | 追跡 _Tsuiseki_     | 2006-10-25  | first-battle   | Light refuses the eyes; bus hijacking; Raye Penber's name                                                           |
| 5   | Tactics       | 駆引 _Kakehiki_     | 2006-11-01  | first-battle   | Raye and the twelve FBI agents die; police walkout; L meets the five who stay                                       |
| 6   | Unraveling    | 綻び _Hokorobi_     | 2006-11-08  | first-battle   | Naomi Misora at police HQ; alias Shoko Maki                                                                         |
| 7   | Overcast      | 曇天 _Donten_       | 2006-11-15  | first-battle   | Naomi's disappearance; Watari reveals himself to the task force                                                     |
| 8   | Glare         | 目線 _Mesen_        | 2006-11-22  | first-battle   | Cameras and bugs in the Yagami home; the crisp-packet television                                                    |
| 9   | Encounter     | 接触 _Sesshoku_     | 2006-11-29  | first-battle   | To-Oh entrance exam and ceremony; "Hideki Ryuga"; "I am L"                                                          |
| 10  | Doubt         | 疑惑 _Giwaku_       | 2006-12-06  | first-battle   | Tennis match; café test; Soichiro's heart attack; tapes reach Sakura TV                                             |
| 11  | Assault       | 突入 _Totsunyū_     | 2006-12-13  | misa           | Sakura TV broadcasts; Ukita killed; Soichiro storms the station; Misa and Rem                                       |
| 12  | Love          | 恋心 _Koigokoro_    | 2006-12-27  | misa           | Light joins the task force; staged "Kira" reply; "Shinigami"; Gelus's story                                         |
| 13  | Confession    | 告白 _Kokuhaku_     | 2007-01-10  | misa           | Aoyama; Misa identifies Light; she comes to his home                                                                |
| 14  | Friend        | 友達 _Tomodachi_    | 2007-01-17  | misa           | Light uses Misa; Rem's threat; L concludes the Kiras have met                                                       |
| 15  | Wager         | 賭け _Kake_         | 2007-01-24  | confinement    | Misa sees L's name; Misa arrested; she relinquishes her notebook                                                    |
| 16  | Decision      | 決断 _Ketsudan_     | 2007-01-31  | confinement    | Notebook buried; Light and Soichiro confined; Light relinquishes; killings resume                                   |
| 17  | Execution     | 執行 _Shikkō_       | 2007-02-07  | confinement    | Mock execution; release; new headquarters; the Yotsuba eight                                                        |
| 18  | Ally          | 仲間 _Nakama_       | 2007-02-14  | yotsuba        | Handcuffs; Yotsuba suspected; Aizawa leaves; Aiber and Wedy                                                         |
| 19  | Matsuda       | 松田 _Matsuda_      | 2007-02-21  | yotsuba        | Matsuda infiltrates Yotsuba; staged fall; a wavering executive dies                                                 |
| 20  | Makeshift     | 姑息 _Kosoku_       | 2007-02-28  | yotsuba        | Surveillance of the meetings; Reiji Namikawa; Misa sent in                                                          |
| 21  | Performance   | 活躍 _Katsuyaku_    | 2007-03-07  | yotsuba        | Rem shows Misa the third Kira; Higuchi's confession                                                                 |
| 22  | Guidance      | 誘導 _Yūdō_         | 2007-03-14  | yotsuba        | Sakura TV trap with Matsuda as bait                                                                                 |
| 23  | Frenzy        | 狂騒 _Kyōsō_        | 2007-03-21  | yotsuba        | Higuchi's eye deal with Rem; roadblock; arrest                                                                      |
| 24  | Revival       | 復活 _Fukkatsu_     | 2007-03-28  | yotsuba        | Team sees Rem; Light's memories return; Higuchi killed; the two fake rules; Misa's second deal (Ryuk)               |
| 25  | Silence       | 沈黙 _Chinmoku_     | 2007-04-04  | end-of-l       | L plans the 13-day test; rooftop in the rain (anime-only); Rem kills Watari and L                                   |
| 26  | Renewal       | 再生 _Saisei_       | 2007-04-11  | end-of-l       | L's recorded account deleted; Light becomes L; Yotsuba, Aiber, Wedy killed; five-year jump; Wammy's House told      |
| 27  | Abduction     | 誘拐 _Yūkai_        | 2007-04-18  | successors     | Roger tells Near and Mello; SPK founded; police director kidnapped; Sayu kidnapped                                  |
| 28  | Impatience    | 焦燥 _Shōsō_        | 2007-04-25  | successors     | Los Angeles exchange; most of the SPK killed; Sidoh's lost notebook                                                 |
| 29  | Father        | 父親 _Chichioya_    | 2007-05-02  | successors     | 13-day rule exposed; Soichiro's eye deal; raid; Mello scarred; Soichiro dies                                        |
| 30  | Justice       | 正義 _Seigi_        | 2007-05-09  | new-kira       | Mello visits Near; _Kira's Kingdom_; Demegawa's call to storm the SPK                                               |
| 31  | Transfer      | 移譲 _Ijō_          | 2007-05-16  | new-kira       | Money from the windows; Aizawa aids Near; Mikami revealed; Demegawa killed                                          |
| 32  | Selection     | 選択 _Sentaku_      | 2007-05-23  | new-kira       | Mikami's past; Takada named spokesperson; Light and Takada                                                          |
| 33  | Scorn         | 嘲笑 _Chōshō_       | 2007-05-30  | final-strategy | Near to Japan; Takada's pages; Misa vs Takada; Lidner as bodyguard; Gevanni sees Mikami write                       |
| 34  | Vigilance     | 虎視 _Koshi_        | 2007-06-06  | final-strategy | Written notes; Aizawa's marked notepads; SPK takes Misa; Mikami's notebook photographed                             |
| 35  | Malice        | 殺意 _Satsui_       | 2007-06-13  | final-strategy | Mello and Matt abduct Takada; Matt shot; Mello killed; Takada dies                                                  |
| 36  | 1.28          | 1.28                | 2007-06-20  | confrontation  | The Yellow Box; Mikami writes the names; Light declares victory                                                     |
| 37  | New World     | 新世界 _Shin Sekai_ | 2007-06-27  | fall           | Fake notebook explained; confession; Matsuda fires; Mikami's suicide; Ryuk writes Light's name; Misa on the rooftop |

Two TV specials, _Relight: Visions of a God_ (2007) and _Relight 2: L's Successors_ (2008),
re-edit the series with new framing and changes; they are not part of the 37-episode
continuity and are not used as canon by the site.

---

## 2. Chapter fact sheets

Each sheet lists the events in story order with their anime episodes. Bracketed ids are the
matching `timeline.ts` events. Names are spelled as in the Viz English release.

### 00 — Prologue · `prologue`

Episode 1 (opening).

1. The Shinigami realm: a grey, stagnant world where the gods of death idle and gamble. Ryuk
   is bored. (Ep 1)
2. Ryuk drops a second Death Note into the human world to see what happens. He claims he
   tricked the Shinigami King into giving it to him. [`ryuk-drops-notebook`]
   - Part II reveals the notebook was **Sidoh's** (Ep 28).

### 01 — The Death Note · `notebook`

Episode 1.

1. Light finds the black notebook on his school grounds; its rules say that writing a name
   while picturing the face kills the person. Manga date **28 November 2003**. [`light-finds-notebook`]
2. Key first rules (detail in the rulebook): face required; death by heart attack unless a
   cause is written; 40 seconds by default; the cause and circumstances can be specified.

### 02 — The Shinigami Realm · `shinigami`

Episodes 1, 3–4, 12, 24, 28–29.

1. Ryuk appears in Light's room, explains that the notebook is now his and that Ryuk will be
   the one to write Light's name when his time comes. (Ep 1) [`ryuk-appears`]
2. Ryuk explains the Shinigami **eyes** (names and lifespans visible) and offers them for half
   of Light's remaining life; Light refuses. (Eps 3–4) [`eyes-offered`]
3. **Rem** arrives with Misa (Ep 11). Rem tells the story of **Gelus**, a small, doll-like
   Shinigami who loved Misa from afar and killed her stalker, extending her life — and died
   for it, his remaining lifespan passing to her; Rem carried his notebook to Misa. (Ep 12)
   [`gelus-sacrifice`]
4. Ryuk becomes tied to Misa's buried notebook (see confinement) and grants Misa her second eye
   deal (Ep 24) and Soichiro his (Ep 29).
5. **Sidoh** learns from **Armonia Justin Beyondormason** that Ryuk took his notebook; he comes
   to the human world, ends up among Mello's gang, the truth that the 13-day rule is false
   comes out, and Light returns the notebook to him after the raid. (Eps 28–29) [`sidoh-notebook`]

### 03 — Light Yagami · `light`

Episode 1.

1. Light: top student, son of senior police officer **Soichiro Yagami**; mother **Sachiko**,
   younger sister **Sayu**.
2. First test: a hostage-taker shown on the news (**Kurou Otoharada**, at a Shinjuku nursery)
   dies of a heart attack. Second test: a man harassing a woman in the street dies in an
   accident — proof the manner of death can be dictated. [`first-judgments`]
3. Light resolves to purge the world of criminals and become the god of a new world.

### 04 — Birth of Kira · `kira`

Episodes 1–2.

1. Criminals worldwide die of heart attacks — the notebook's default cause, which gives the
   deaths an unmistakable signature. [`kira-named`]
2. The public names the unseen judge **Kira**; the killings become a global phenomenon and an
   emergency for **Interpol** (the ICPO).

### 05 — L · `l`

Episodes 2–3, 5, 7.

1. Interpol's emergency conference: an elderly man (**Watari**) sets down a laptop showing a
   gothic **L**; a disguised voice speaks for the detective no one has seen. (Ep 2)
   [`interpol-turns-to-l`]
2. L's profile: times of death suggest a **student**; victim selection suggests access to
   **police information**. The Japanese task force is led by Soichiro Yagami. (Ep 3)
   [`student-profile`]
3. After the FBI deaths most officers quit; **Soichiro, Aizawa, Matsuda, Mogi and Ukita** stay
   and meet L in person in a hotel room — barefoot, crouching in an armchair. (Ep 5)
   [`the-few-who-stay`]
4. Watari reveals himself to the task force and equips it with concealed devices. (Ep 7)

### 06 — First Battle: Light vs L · `first-battle`

Episodes 2, 4–10.

1. **Lind L. Tailor**, a condemned prisoner whose arrest was never made public, appears on TV
   as "L" and denounces Kira; Light kills him on air. L had already traced the first victim
   to Japan; the broadcast was aired only in the **Kanto region**, so Kira is in Kanto. L
   dares Kira to kill him. (Ep 2; manga date **5 December 2003**) [`lind-l-tailor`]
2. Light, followed, stages a **bus hijacking** (Ep 4); the hijacker glimpses Ryuk through a
   scrap; the tail shows his FBI ID: **Raye Penber**. [`bus-hijacking`]
3. On a train, Light coerces Raye into writing names on Death Note pages hidden in an envelope.
   The **twelve FBI agents** in Japan die — the eleven others, then Raye, who recognises Light
   as he dies. (Ep 5; manga date **27 December 2003**) [`fbi-agents-killed`]
4. **Naomi Misora**, Raye's fiancée and a former FBI agent, brings her own theory of Kira to
   police HQ; Light, posing as a helper, draws out her real name past the alias **Shoko
   Maki**. She vanishes; her body is never found. (Eps 6–7; manga January 2004) [`naomi-misora`]
5. L installs cameras and bugs in the homes of senior officers, the Yagamis' included. Ryuk
   locates the cameras; Light keeps killing via a pocket TV hidden in a crisp packet. (Ep 8)
   [`home-surveillance`]
6. **To-Oh University**: L sits the entrance exam; at the entrance ceremony both give the
   freshman address; L introduces himself as **Hideki Ryuga** (a famous idol's name), then
   tells Light he is L. Tennis match and café test follow; Soichiro has a heart attack.
   (Eps 9–10) [`to-oh-university`]

### 07 — Misa Amane: The Second Kira · `misa`

Episodes 10–14.

1. **Sakura TV** receives and airs tapes from a self-proclaimed Kira. **Ukita** dies at the
   station's door, killed without his name being known; Soichiro drives a police vehicle
   into the lobby to seize the tapes. (Eps 10–11; manga date **18 April 2004**)
   [`sakura-tv-broadcasts`]
2. The second Kira is **Misa Amane**, a model ("Misa-Misa") from Kansai whose parents were
   murdered by a burglar that Kira later killed. She has the eyes, traded with **Rem**.
   (Ep 11) [`misa-amane`]
3. Light joins the task force and confirms a second Kira; the second Kira's reply to a staged
   "Kira" message mentions **Shinigami**. (Ep 12) [`light-joins-task-force`]
4. Gelus's story (Ep 12). [`gelus-sacrifice`]
5. **Aoyama**: following the second Kira's diary, Light goes with Matsuda and friends; Misa
   sees that Light's lifespan is invisible to her eyes — the mark of a notebook owner — and
   comes to his home. Light accepts her devotion intending to use it; Rem threatens to kill
   him if Misa is harmed. (Eps 13–14) [`aoyama`]

### 08 — Confinement and Memory Loss · `confinement`

Episodes 15–17.

1. Misa meets L at the university and sees his real name, but is **arrested** before she can
   tell Light. Held blindfolded and bound, she gives up ownership of her notebook on Rem's
   advice and loses her memories of it — but not her love for Light. (Ep 15) [`misa-arrested`]
2. **The exchange in the woods**: Light trades notebooks with Rem; she leaves with his
   original, and the notebook that had been Misa's — now tied to Ryuk — is buried. (Eps 15–16;
   the anime makes the design explicit in Ep 25) [`notebook-exchange`]
3. Light asks to be **confined**; Soichiro is confined too. Light relinquishes ownership and
   loses his memories; after a pause the killings resume. Light and Misa are held for more than
   fifty days. (Ep 16) [`light-confined`]
4. **Mock execution**: Soichiro threatens to shoot Light and himself; blanks. Both are released;
   Light is **handcuffed to L**. (Eps 17–18) [`mock-execution`]

**Notebook ownership chain — Part I** (for the ownership diagram):

| Step      | Notebook that fell to Light (originally Sidoh's)                          | Gelus's notebook (Misa's)                                 | Rem's own notebook                                |
| --------- | ------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| Eps 1–11  | Light owns it; Ryuk attached                                              | Rem carries it to Misa; Misa owns it                      | Rem keeps it                                      |
| Ep 15     | —                                                                         | Misa relinquishes; memories lost                          | —                                                 |
| Eps 15–16 | Rem leaves with it                                                        | Buried in the woods; Ryuk now tied to it                  | —                                                 |
| Ep 16     | Light relinquishes; memories lost                                         | —                                                         | —                                                 |
| Ep 17     | Rem gives it to **Higuchi** (Yotsuba)                                     | —                                                         | —                                                 |
| Ep 24     | Seized after Higuchi's arrest; Light touches it and **remembers**         | Misa digs it up, remembers, second eye deal **with Ryuk** | —                                                 |
| Ep 25     | Held by the task force                                                    | Misa's                                                    | Rem writes Watari's and L's names; Light takes it |
| Ep 28–29  | Exchanged to Mello for Sayu; recovered in the raid; **returned to Sidoh** | —                                                         | —                                                 |

### 09 — Yotsuba Arc · `yotsuba`

Episodes 17–24.

1. **The Yotsuba eight**: executives of the Yotsuba Group meet weekly to choose which rivals
   die; one of them — **Kyosuke Higuchi**, head of technology development — holds the
   notebook Rem gave him. The others: Reiji Namikawa, Masahiko Kida, Shingo Mido, Takeshi Ooi,
   Arayoshi Hatori, Suguru Shimura, Eiichi Takahashi. (Ep 17) [`yotsuba-eight`]
2. Kill patterns favour Yotsuba's profits. As the police withdraw, **Aizawa leaves** the task
   force to keep his post; L recruits **Aiber** (con artist) and **Wedy** (thief). (Ep 18)
   [`aiber-and-wedy`]
3. **Matsuda** infiltrates as Misa's manager, is caught, and fakes his death with a staged
   fall from a balcony. A wavering executive is killed. (Ep 19) [`matsuda-infiltrates`]
4. Surveillance of the meetings; **Reiji Namikawa** is persuaded to stall the killings; Misa
   is sent in. (Ep 20)
5. Rem shows Misa who the third Kira is and tells her of her past; Misa gets **Higuchi's
   confession**. (Eps 20–21) [`misa-exposes-higuchi`]
6. **Sakura TV trap**: Matsuda as the anonymous insider promising to name Kira. (Ep 22)
   [`sakura-tv-trap`]
7. Higuchi makes the **eye deal with Rem** in his car; Aizawa and Ide block the road; after the
   arrest Watari shoots the gun from his hand. (Eps 23–24) [`higuchi-captured`]
8. Everyone who touches the notebook sees Rem; **Light touches it and remembers**; he kills
   Higuchi with a scrap in his **wristwatch**. (Ep 24; manga date **28 October 2004**)
   [`light-revives`]
9. The two **fake rules**: the 13-day rule and "destroying the notebook kills all who touched
   it". The 13-day rule appears to clear Light and Misa; handcuffs off, Misa freed. (Ep 24)
   [`false-rules`]

### 10 — The End of L · `end-of-l`

Episodes 24–26.

1. Misa digs up the buried notebook, recovers her memories, and makes a **second eye deal,
   with Ryuk**, halving her remaining life again. (Ep 24) [`misa-second-deal`]
2. L questions Rem and plans to **test the 13-day rule** on a condemned prisoner. Rem sees that
   only L's death can now save Misa. (Ep 25) [`thirteen-day-test`]
3. _(Anime only)_ Rain on the headquarters roof; L speaks of isolation and lies; he dries
   Light's feet. (Ep 25) [`rain-on-the-roof`]
4. **Rem writes Watari's and L's names** and crumbles to dust. Watari dies first; L dies in
   Light's arms, his suspicion confirmed. (Ep 25; manga date **5 November 2004**) [`rem-kills-l`]
5. Light takes Rem's notebook, deletes L's recorded account, becomes the **new L**; L's death
   is kept secret; the remaining Yotsuba executives, **Aiber and Wedy** are killed. (Ep 26)
   [`light-becomes-l`]

Treatment: restraint. The deaths are quiet; avoid spectacle (SPEC §7, chapter 10).

### 11 — Successors: Near and Mello · `successors`

Episodes 26–30.

1. L's systems alert **Roger Ruvie** at **Wammy's House**, the orphanage for gifted children in
   **Winchester** founded by Watari (**Quillsh Wammy**). Roger tells **Near** and **Mello**;
   Mello refuses to work with Near and leaves. (Eps 26–27) [`wammys-house`]
2. **Five years later** (manga 2009; anime 2012): Light works at the National Police Agency and
   secretly serves as L; Kira has an open following. (Ep 26) [`five-years-later`]
3. Near forms the **SPK (Special Provision for Kira)** from FBI and CIA agents with the US
   President's backing; he lets the task force know he knows L is dead. (Ep 27) [`spk-founded`]
4. Mello, allied with the Mafia, kidnaps the **NPA director** (Light kills him) and then
   **Sayu**. (Ep 27) [`mello-kidnappings`]
5. **The notebook exchange**: Soichiro carries the notebook to Los Angeles, Light tracking him,
   and trades it for Sayu, who returns traumatised. Mello kills most of the SPK. (Ep 28)
   [`sayu-exchange`]
6. Sidoh arrives; the 13-day rule is revealed to be false. (Eps 28–29) [`sidoh-notebook`]
7. **Soichiro's eye deal** with Ryuk; the raid; he sees Mello's real name but is shot; Mello
   escapes by explosion, scarred. Dying, Soichiro sees Light's lifespan and believes him
   innocent — Light had given up ownership beforehand. (Ep 29; Soichiro dies **11 November
   2009** in the manga chronology) [`soichiro-raid`]
8. Mello enters SPK HQ with **Halle Lidner** as hostage, retrieves his only photograph, and
   tells Near that Shinigami are real and the 13-day rule is a lie. (Ep 30) [`mello-visits-near`]

### 12 — The New Kira Era · `new-kira`

Episodes 30–32.

1. **Kira's Kingdom** on Sakura TV; **Hitoshi Demegawa**, the station's director and Kira's
   self-appointed spokesman, sends followers against the SPK's New York HQ; the SPK escapes by
   scattering banknotes; Misa fails to see Near's face. (Eps 30–31) [`kiras-kingdom`]
2. **Aizawa** shares information with Near and asks to put Light and Misa under watch again;
   killings continue regardless. (Ep 31) [`aizawa-doubts`]
3. **Teru Mikami**, a prosecutor spotted on _Kira's Kingdom_, holds the notebook that had been
   Misa's; Near calls him **X-Kira**; he kills Demegawa. (Eps 31–32) [`mikami-x-kira`]
4. Mikami's past: shaped by bullying and trauma into an absolute moralist. (Ep 32)
5. **Kiyomi Takada** — NHN newscaster, Light's university girlfriend — becomes Kira's
   spokesperson; Light reveals himself to Mikami through her and asks her to be the goddess of
   his new world. (Ep 32) [`takada-spokesperson`]

### 13 — Final Strategy · `final-strategy`

Episodes 33–35.

1. Near moves to Japan as bait; reasons that X-Kira has the eyes and takes orders through
   Takada; places **Lidner** as her bodyguard. Misa and Takada clash. (Ep 33) [`near-to-japan`]
2. **Gevanni** watches Mikami write names on schedule, finds the notebook in a **gym locker**,
   photographs every page; Near confirms the handwriting. (Eps 33–34) [`gevanni-shadows-mikami`]
3. Light and Takada communicate by **written notes** in supervised meetings; Aizawa marks the
   notepads. Takada receives notebook pages. Light arranges for Mikami to carry a **decoy
   notebook** while the real one is hidden. The SPK takes Misa into its keeping. (Eps 33–34)
   [`notes-and-decoys`]
4. **Mello and Matt abduct Takada**; Matt is shot dead by her bodyguards; Takada kills Mello
   with a hidden page. Light writes her name on a scrap from his watch (she burns herself and
   the evidence); **Mikami independently writes her name in the real notebook**, retrieving it
   from hiding — the slip that lets Gevanni find and replace it. (Ep 35; revealed Ep 37; manga
   date **26 January 2010**) [`takada-abducted`]

### 14 — Final Confrontation · `confrontation`

Episode 36.

1. **The Yellow Box**: an abandoned warehouse where Near gathers the SPK (Near, Rester,
   Gevanni, Lidner) and the task force (Light, Aizawa, Matsuda, Mogi, Ide). Manga date
   **28 January 2010**; the episode title "1.28" marks the day. [`yellow-box`]
2. Mikami, outside, looks through a gap in the door with his eyes and writes every name except
   Light's. Near says the notebook has been tampered with; Light, believing his own
   counter-plan has held, declares victory as the 40 seconds run out.

Treatment: preserve suspense; make the two layers of decoy legible.

### 15 — The Fall of Kira · `fall`

Episode 37 (plus the manga epilogue).

1. **No one dies.** Near explains that Mikami's trip to the real notebook led Gevanni to it and
   it was replaced with a copy; the only name missing is Light's. Mikami is seized; Light
   confesses. [`nobody-dies`]
2. **Matsuda shoots Light** several times as he reaches for the scrap in his watch, anguished
   over Soichiro's sacrifice. [`matsuda-fires`]
3. _(Anime)_ Mikami stabs himself with his pen; Light escapes in the confusion.
   [`mikami-anime-death`]
4. **Ryuk writes Light's name** in his own notebook, as promised in Ep 1; Light dies of a heart
   attack. [`ryuk-keeps-his-promise`]
5. _(Anime)_ Light, at sunset, glimpses his younger self and dies on a **warehouse stairway**,
   seeing L. [`the-stairway`]
6. _(Anime)_ Misa stands beyond the railing of a rooftop; nothing more is shown.
   [`misa-at-the-edge`]
7. _(Manga only)_ **One year later**: crime has returned to its old level; Near is the new L
   with Roger as his Watari; the task force members wrestle with what they did; Matsuda
   speculates about Near and Mikami, Ide dismisses it; Kira's worshippers gather under the
   moon. [`one-year-later`]

---

## 3. Anime vs manga differences

The site must label these. Most of Part II is compressed (manga chapters 60–108 become roughly
twelve episodes), so the list covers what the site depicts.

1. **Light's death — place and manner.**
   - _Manga:_ inside the Yellow Box. Shot by Matsuda, Light begs Mikami and then Ryuk to kill
     everyone; Mikami refuses him, and Ryuk writes Light's name instead. Light dies on the
     floor, terrified, in front of Near and the task force.
   - _Anime:_ Light never asks Ryuk for anything. He escapes during the confusion of Mikami's
     suicide, staggers along a road at sunset (glimpsing his younger self), and dies on a
     warehouse stairway, seeing L; Ryuk writes his name from a high vantage point. The death
     is quiet. Screenwriter Toshiki Inoue has said the ending was first written like the
     manga's and changed at the director's wish (per the Japanese Wikipedia article on Light).
2. **Mikami's death.** _Manga:_ arrested; dies in prison about ten days later after losing his
   mind (guidebook date 7 February 2010). _Anime:_ stabs himself with his pen at the warehouse.
3. **The ending and epilogue.** _Manga:_ a final chapter set one year later (crime returns,
   Near as L with Roger, Matsuda's speculation, Kira worshippers under the moon). _Anime:_ ends
   on Light's death, Ryuk, Misa on the rooftop; no one-year-later epilogue.
4. **Misa's fate.** _Manga:_ she is not seen after Light's death; _How to Read 13_ dates her
   death to a little over a year after his, and Ohba suggested despair and suicide as a
   possibility. _Anime:_ she stands beyond a rooftop railing at sunset; the official anime
   analysis guide lists her death date as unknown. Neither version shows her death.
5. **L's final episode.** The anime adds the rain-soaked rooftop conversation and the scene in
   which L dries Light's feet (Ep 25). The manga goes directly to Rem's decision.
6. **Calendar.** The anime moves every date three years later (see §5).
7. **Naomi Misora.** _Manga:_ her end is implied off-page. _Anime:_ follows her final walk.
   Body never found in either.
8. **Aiber's death.** _Manga:_ liver cancer in a Paris hospital. _Anime:_ heart attack at home
   in front of his wife and son.
9. **Takada's death — what is the same.** In both versions Light writes her name on a hidden
   scrap and Mikami, acting alone, writes it in the real notebook; that second entry is what
   exposes the real notebook. Do not present this as an anime/manga difference.
10. **Part II compression.** The anime omits or merges manga subplots — for example, the manga's
    US President David Hoope (whose suicide in the manga follows a failed attack on Mello) is
    merged in adaptation with his successor. Do not depict manga-only Part II subplots without
    a "Manga" label.

---

## 4. Do not claim

| Do not claim                                                                                                                                 | What is actually established                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Near used the Death Note to control Mikami (or to kill him).                                                                                 | Only **Matsuda's speculation** in the manga epilogue; Ide notes there is no proof, and _How to Read 13_ leaves it to the reader. The anime has no epilogue and Mikami dies by his own hand.                            |
| Misa died on a stated date or by a stated means; or that the anime shows her death.                                                          | Manga: not shown; guidebook gives a death date a little over a year after Light's. Anime: ambiguous rooftop image; analysis guide says unknown. Fan claims of a specific day are not canon.                            |
| L's real name is spoken in the anime or manga.                                                                                               | "L Lawliet" was published in _How to Read 13_; no character says it. Same caution for Near ("Nate River"), Matt ("Mail Jeevas"), Mello's spelling ("Mihael Keehl"), the SPK agents' and Aiber's and Wedy's real names. |
| Light dies inside the Yellow Box in the anime / on a stairway in the manga.                                                                  | The reverse: anime — stairway after fleeing; manga — the warehouse floor.                                                                                                                                              |
| Mikami dies in prison in the anime, or at the warehouse in the manga.                                                                        | Anime — pen, at the warehouse; manga — prison, about ten days later.                                                                                                                                                   |
| Light asked Ryuk to save him in the anime, or Ryuk killed him out of friendship.                                                             | Anime: Light asks nothing. Ryuk acts on the promise made in Ep 1, once Light is no longer entertaining; assign no other motive.                                                                                        |
| The 13-day rule or the "destroying it kills everyone" rule is real.                                                                          | Both are fakes written into the notebook at Light's instruction (rules doc).                                                                                                                                           |
| The notebook Light found was Ryuk's own.                                                                                                     | It was Sidoh's; Ryuk kept his own and used it to write Light's name.                                                                                                                                                   |
| Gelus gave Misa his notebook.                                                                                                                | Gelus turned to dust; Rem carried his notebook to her.                                                                                                                                                                 |
| Matsuda killed Light.                                                                                                                        | Matsuda wounded him; Ryuk's entry killed him.                                                                                                                                                                          |
| Soichiro died knowing or suspecting Light was Kira.                                                                                          | He died believing Light innocent, having seen his lifespan.                                                                                                                                                            |
| Misa killed L, or wrote L's name.                                                                                                            | Rem wrote it. Misa only saw it.                                                                                                                                                                                        |
| Takada's death differs between versions in who wrote her name.                                                                               | Both Light and Mikami wrote it in both versions.                                                                                                                                                                       |
| Light has a son; Mikami killed Light; Near and Mello are one person.                                                                         | These belong to the live-action films/drama, not the anime or manga.                                                                                                                                                   |
| Anything from _Relight 1/2_, _Another Note_, _L: Change the World_, the C-Kira (2008) or a-Kira (2020) one-shots as part of the anime story. | Separate works; cite them only as such.                                                                                                                                                                                |
| Dates in the anime's calendar equal the manga's.                                                                                             | The anime runs three years later.                                                                                                                                                                                      |
| Personal "IQ" figures, ethnicities, gender statements about Shinigami, or other trivia not checked here.                                     | Not verified; leave out.                                                                                                                                                                                               |

---

## 5. Dates: two calendars

Manga dates are from the guidebook chronology (via the Japanese Wikipedia character list and
the English Wikipedia articles); anime years follow the three-year shift recorded there.

| Event                              | Manga               | Anime                                         |
| ---------------------------------- | ------------------- | --------------------------------------------- |
| Light picks up the notebook        | 28 Nov 2003         | 2006                                          |
| Lind L. Tailor dies                | 5 Dec 2003          | 2006                                          |
| Raye Penber and the FBI agents die | 27 Dec 2003         | 2006                                          |
| Naomi Misora dies                  | 2 Jan 2004          | 2007                                          |
| Ukita dies at Sakura TV            | 18 Apr 2004         | 2007                                          |
| Higuchi dies                       | 28 Oct 2004         | 2007                                          |
| L and Watari die                   | 5 Nov 2004          | 2007                                          |
| Wedy / Aiber die                   | 10 Jan / 7 Apr 2005 | 2008                                          |
| Yotsuba executives die             | Apr 2005            | 2008                                          |
| SPK founded; Part II begins        | 2009                | 2012                                          |
| Soichiro dies                      | 11 Nov 2009         | Nov 2012 (raid set for 10 Nov 2012 on screen) |
| Mello, Matt and Takada die         | 26 Jan 2010         | 2013                                          |
| Yellow Box; Light dies             | 28 Jan 2010         | 28 Jan 2013 ("1.28")                          |
| Mikami dies (manga only)           | 7 Feb 2010          | —                                             |

Birth dates (guidebook; anime year in brackets): Light 28 Feb 1986 (1989); L 31 Oct 1979
(1982); Misa 25 Dec 1984 (1987); Near 24 Aug 1991 (1994); Mello 13 Dec 1989 (1992).

---

## 6. Confidence notes and open questions

Facts confirmed by fewer than two independent sources, or resolved by judgment:

- **"Both give the freshman address" at To-Oh** (Ep 9) — consistent with the manga and a fan
  chronology; not independently confirmed for the anime's staging.
- **The five officers who meet L** (Ep 5): Wikipedia confirms "five"; the names are from the
  manga and consistent with later episodes.
- **First-appearance episodes** in `characters.ts` for minor characters (Soichiro and Sayu
  Ep 2; the task force detectives Ep 3; Naomi Ep 6; Takada Ep 32) are best estimates — no
  accessible source lists anime debuts. Takada's university-days cameo is manga Part I; no
  source confirms an anime appearance before Ep 32.
- **Near's real name** is in the Wikipedia character lists and creator commentary; which
  supplementary volume first printed it could not be confirmed, so the data says "official
  supplementary material". L's (_How to Read 13_), Mello's (_How to Read 13_) and Matt's
  (_How to Read 13_, p. 27) are sourced.
- **Notebook decoy mechanics** (Eps 33–36): the data states only what two sources support —
  Mikami carried a decoy, the real notebook was hidden, Takada had real pages, Mikami's trip to
  the real one exposed it. Finer details of who wrote what each day are omitted.
- **Light picks up the notebook on 28 November 2003** — from fan chronologies derived from the
  manga; consistent with the guidebook-based dates around it.
- **Research environment:** Anime News Network, the Death Note Fandom wiki, Viz Media, TV
  Tropes, MyAnimeList and IMDb failed TLS verification from this environment, so their pages
  were seen only as search-result snippets and are **not** cited as checked sources.

---

## 7. Sources

Pages fetched and checked for this document:

- Wikipedia — List of Death Note episodes (English titles, Japanese titles, air dates, episode
  summaries): https://en.wikipedia.org/wiki/List_of_Death_Note_episodes
- Wikipedia (Japanese) — DEATH NOTE (アニメ) (Japanese titles, air dates, staff):
  https://ja.wikipedia.org/wiki/DEATH_NOTE_(アニメ)
- Wikipedia (Italian) — Episodi di Death Note (detailed summaries, Eps 2, 11–37):
  https://it.wikipedia.org/wiki/Episodi_di_Death_Note
- Wikipedia (Spanish) — Episodios de Death Note (Eps 11–15, 26–29; Gelus in Ep 12; anime 2012
  dates): https://es.wikipedia.org/wiki/Anexo:Episodios_de_Death_Note
- Wikipedia (French) — Liste des épisodes de Death Note (Eps 35–37; "X-Kira"):
  https://fr.wikipedia.org/wiki/Liste_des_épisodes_de_Death_Note
- Wikipedia — Death Note (series, plot, anime run, _How to Read 13_, one-shots):
  https://en.wikipedia.org/wiki/Death_Note
- Wikipedia (Japanese) — DEATH NOTE (in-story years with anime variants):
  https://ja.wikipedia.org/wiki/DEATH_NOTE
- Wikipedia — List of Death Note characters (roles, aliases, real names, deaths, differences):
  https://en.wikipedia.org/wiki/List_of_Death_Note_characters
- Wikipedia (Japanese) — DEATH NOTEの登場人物 (Japanese names, guidebook birth/death dates with
  anime-year variants, Matt's name source): https://ja.wikipedia.org/wiki/DEATH_NOTEの登場人物
- Wikipedia (Japanese) — 夜神月 (Light's dates; manga vs anime death; Inoue on the ending):
  https://ja.wikipedia.org/wiki/夜神月
- Wikipedia — Light Yagami: https://en.wikipedia.org/wiki/Light_Yagami
- Wikipedia — L (Death Note): https://en.wikipedia.org/wiki/L_(Death_Note)
- Wikipedia — Misa Amane (fate in manga, anime and guidebooks):
  https://en.wikipedia.org/wiki/Misa_Amane
- Wikipedia — Mello (Death Note): https://en.wikipedia.org/wiki/Mello_(Death_Note)
- Wikipedia — Ryuk (Death Note): https://en.wikipedia.org/wiki/Ryuk_(Death_Note)
- Wikipedia — List of Death Note chapters (volume summaries, confinement plan):
  https://en.wikipedia.org/wiki/List_of_Death_Note_chapters
- Gwern Branwen — "Death Note's Ending" (the epilogue speculation is left to the reader, per
  _How to Read 13_): https://gwern.net/Death%20Note%20Ending
- Netflix title page (English titles, Eps 1–10): https://www.netflix.com/title/70204970
- Fan chronology compiled from the manga (cross-reference only; never sole source):
  https://www.goodreads.com/topic/show/22669218-timeline

Corroborating search results (seen as snippets, not fetched): Peacock and Tubi episode
listings (English titles), Death Note Fandom wiki (first victim Kurou Otoharada; notebook
swap), TV Tropes recaps (Eps 24, 25, 37), Anime News Network encyclopedia entry.
