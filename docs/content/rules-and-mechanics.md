# Rules and mechanics — source document

The human-readable reference behind `src/data/rules.ts` (65 rules: 39 `both`, 26 `manga`,
2 of them false rules). Every rule on the site traces to a row below. All rule text is an
original plain-language paraphrase; nothing here reproduces the official wording.

Researched 6–7 November 2026. Spoilers for the whole anime throughout.

## 1. How to read the references

### Numbering (`ref`)

- **How to Use I–LXVI.** The manga closes many chapters with a full-page “How to Use It” rule
  page. In the tankōbon these run from I (volume 1) to LXVI (volume 11). `ref` uses that
  numbering: “How to Use XVII · 1” is item 1 on page XVII. Numbering follows the Death Note
  Wiki’s _Manga Chapter Rules_ table, checked against a complete volume-by-volume copy of it
  and spot-checked rule by rule (XII, XIII, XV, XVII, XXXV and XXXVIII confirmed by
  independent search results).
- **Volume 12** ends with two unnumbered rule pages (every human dies and goes to Mu; the dead
  never return). `ref` is “—”.
- **How to Use LXVII** is the wiki’s number for the rules introduced by the 2020 one-shot
  (“a-Kira”). Used only for the buying-and-selling rule.
- **How to Read 13** (the 2006 guidebook) recompiles the same rules by subject, with its own
  internal numbering; the wiki notes the Japanese text matches the chapter pages. We cite the
  How to Use numbers because they are printed both in the volumes and on the anime’s rule
  cards. No rule in the dataset is guidebook-only.
- **“—”** is used for the two false rules (they were written into the notebook in the story,
  not printed as rule pages), for “a second trade, a second halving” (shown in the story,
  implied by V · 3 and XII · 2, but never stated as a rule) and for the volume 12 pages.
- **Known printing quirks** in the English numbering: XIX printed as “XVIV”; XXXIX and XLII
  each appear twice; one XLII precedes XLI. We avoided citing the duplicated numbers; their
  content is folded into the rules that cite XXX and XVIII.

### Canon labels (`canon`)

- **`both`** — in the manga, and verified in the anime in one of two ways:
  1. **On-screen rule cards.** The anime shows numbered How to Use rules on screen around its
     commercial breaks. The Death Note Wiki lists them per episode; we verified these cards:

     | Ep. | Title         | Rules shown       |
     | --- | ------------- | ----------------- |
     | 1   | Rebirth       | I, II             |
     | 2   | Confrontation | III               |
     | 3   | Dealings      | IV · 1            |
     | 6   | Unraveling    | IV · 2–3          |
     | 9   | Encounter     | V · 4, VI · 1     |
     | 11  | Assault       | VII · 2–3         |
     | 13  | Confession    | IX · 1–2          |
     | 14  | Friend        | X · 1–2           |
     | 16  | Decision      | XI · 3, XII · 1   |
     | 17  | Execution     | XII · 2, XIII · 1 |
     | 20  | Makeshift     | XV · 2, XVI · 1   |

  2. **The story itself** states or plays out the rule (checked against Wikipedia’s episode
     summaries and the wiki’s transcripts), e.g. the Eye trade (Ep. 3), Gelus (Ep. 12), the
     false rules (Ep. 24), lending (Ep. 29), Ryuk writing Light’s name (Ep. 37).
- **`manga`** — could not be verified in the anime. This means _unverified in the anime_, not
  proven absent: cards for rules after XVI (Eps. 21–37) could not be confirmed, so every rule
  from XVII onward is `manga` unless the story itself shows it.
- **`anime`** — not used. No anime-only rule or anime-specific rule wording was found.

### Research limits

Fandom (the Death Note Wiki), Viz Media, Anime News Network, TV Tropes and Madhouse pages
failed TLS verification from the research environment (“unable to verify the first
certificate”). Their content was checked through search-engine retrieval of the same pages;
Wikipedia (English and Japanese), the full copy of the wiki’s rule table and a How to Read 13
subject compilation were fetched directly. Facts were kept only where two sources agreed or
where a single source was the primary listing (the wiki’s per-episode rule cards).

## 2. The rulebook

Rows are generated from `src/data/rules.ts`; the source key follows the tables. Italic text is
the optional `detail` field.

### Writing a Name

_What makes an entry count: a true name, a face held in mind, a page that is real._

| ID                        | Rule (plain language)                                                                                                                                                                                                                                                                                             | Ref                           | Canon | Sources         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----- | --------------- |
| `name-written-dies`       | **A name becomes a death.** Any person whose name is written in the notebook will die. _It is the first instruction inside the cover, written in English._                                                                                                                                                        | How to Use I · 1              | both  | S1, S2, S3, S4  |
| `face-in-mind`            | **The face must be in mind.** An entry only works if the writer pictures the victim’s face while writing the name — so others who happen to share that name are safe.                                                                                                                                             | How to Use I · 2              | both  | S1, S2, S3, S5  |
| `any-writing-instrument`  | **Any ink will do.** Anything that leaves legible writing directly on the page counts: pen, pencil, cosmetics, even blood.                                                                                                                                                                                        | How to Use VII · 2            | both  | S1, S2, S6      |
| `one-name-one-page`       | **One name, one page.** A name split across separate pages has no effect, though the front and back of a single sheet count as one page. _The cause and circumstances may continue on other pages, provided the writer keeps the victim’s name in mind (How to Use LIV)._                                         | How to Use LIII · 1–2; LIV    | manga | S1, S2, S7      |
| `circumstances-first`     | **Circumstances first, name later.** The cause and details may be written before the name, which must then be added in front of them. The writer has about 19 days to do so.                                                                                                                                      | How to Use VIII · 1           | manga | S1, S2, S7      |
| `four-mistakes`           | **Four mistakes.** If a person’s name is misspelled four times, the Death Note can no longer kill that person. _A later rule closes the loophole: deliberate misspellings protect no one and kill the writer instead._                                                                                            | How to Use IX · 2             | both  | S1, S2, S8, S7  |
| `deliberate-misspelling`  | **No misspelling on purpose.** Immunity comes only from honest mistakes. Misspelling a name four times on purpose kills the writer, and the intended victim gains no protection.                                                                                                                                  | How to Use XXXV · 1–2         | manga | S1, S2, S9      |
| `same-name-two-notebooks` | **Two notebooks, one name.** If the same person is written in two or more notebooks and the entries are completed within 0.06 seconds of each other, they count as simultaneous — and the person does not die. _Otherwise, whichever entry was completed first is the one that takes effect (How to Use XV · 1)._ | How to Use XV · 1–2           | both  | S1, S2, S10, S9 |
| `corrections`             | **Corrections, not reprieves.** Within 6 minutes 40 seconds, the time and circumstances of a death may be changed by striking them through with two straight lines. The name itself can never be cancelled: erasers, correction fluid and overwriting change nothing.                                             | How to Use XI · 1–2; XLI; LXI | manga | S1, S2, S7, S5  |

### Cause and Timing

_How death arrives once the name is written, and how far the writer may steer it._

| ID                        | Rule (plain language)                                                                                                                                                                                                                                                                                                                                                   | Ref                                | Canon | Sources          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----- | ---------------- |
| `forty-seconds`           | **Forty seconds to name a cause.** A cause of death written within 40 seconds of the name will come to pass.                                                                                                                                                                                                                                                            | How to Use I · 3                   | both  | S1, S2, S3, S4   |
| `heart-attack-default`    | **The default is a heart attack.** If no cause is written, the victim dies of a heart attack.                                                                                                                                                                                                                                                                           | How to Use I · 4                   | both  | S1, S2, S3, S11  |
| `six-forty-details`       | **Six minutes forty for the details.** Once the cause is written, the writer has 6 minutes and 40 seconds to set down the circumstances of the death.                                                                                                                                                                                                                   | How to Use I · 5                   | both  | S1, S2, S3, S5   |
| `scheduled-heart-attack`  | **A heart attack on schedule.** When the cause is a heart attack, a time of death written within the next 40 seconds lets the death be scheduled rather than immediate. _The official English wording is unclear about the earliest possible moment; what it establishes is that the time of death can be set._                                                         | How to Use III · 1                 | both  | S1, S2, S12, S13 |
| `physically-possible`     | **Only what is possible.** Written circumstances only come true if the victim could physically carry them out, or could plausibly be expected to. Otherwise the victim simply dies of a heart attack. _Not even Shinigami know exactly where that line falls; an owner has to find it by experiment (How to Use VI · 2)._                                               | How to Use VI · 1                  | both  | S1, S2, S14, S13 |
| `suicide-is-valid`        | **Suicide counts.** Suicide is accepted as a cause of death, since any human could conceivably take their own life.                                                                                                                                                                                                                                                     | How to Use X · 1                   | both  | S1, S2, S15, S16 |
| `no-collateral-deaths`    | **One name, one death.** If the death as written would directly kill people whose names were not written, the victim dies of a heart attack instead. _The manga applies the same safeguard to vague accidents: “dies in an accident” brings a natural-looking accident 6 minutes 40 seconds later, unless it would claim others (How to Use XXVI · 1–2)._               | How to Use X · 2                   | both  | S1, S2, S15, S7  |
| `no-reprieve`             | **No reprieve.** Once a name has been written, that person’s death cannot be prevented.                                                                                                                                                                                                                                                                                 | How to Use XI · 3                  | both  | S1, S2, S17      |
| `twenty-three-days`       | **The 23-day horizon.** Circumstances and a time of death can only be arranged within 23 days. The notebook cannot schedule a death further ahead than that. _Known as the 23-day rule. The exception is a named disease that naturally takes longer to kill (How to Use XXVIII · 1)._                                                                                  | How to Use XXVII · 2               | manga | S1, S2, S7, S5   |
| `death-by-disease`        | **Death by disease.** A named disease needs enough time to run its course; if too little is allowed, the victim has a heart attack 6 minutes 40 seconds later. Writing “disease” without naming one produces a fitting illness.                                                                                                                                         | How to Use XXVII · 1–2; XXVIII · 1 | manga | S1, S2, S7       |
| `destroying-saves-no-one` | **Destroying the notebook saves no one.** A completed entry still comes true if the notebook is destroyed afterwards. Destroying it mid-entry does not help either: the victim dies of a heart attack, or of the cause already written. _Compare the false rule Light planted, which claimed that destroying the notebook would kill everyone who had ever touched it._ | How to Use LXII · 1–3              | manga | S1, S2, S7       |

### Ownership

_Who a notebook belongs to, who can see its Shinigami, and how a claim is lost._

| ID                     | Rule (plain language)                                                                                                                                                                             | Ref                  | Canon | Sources               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----- | --------------------- |
| `human-world-property` | **Finders keepers.** Once a notebook touches the ground of the human world, it becomes the property of the human world, and the person who takes it up becomes its owner.                         | How to Use II · 1    | both  | S1, S2, S3, S4        |
| `owner-sees-shinigami` | **The owner sees its Shinigami.** The owner of a notebook can see and hear the Shinigami it came from.                                                                                            | How to Use II · 2    | both  | S1, S2, S3, S4        |
| `touch-to-see`         | **Touch the notebook, see the god.** Anyone who touches a notebook, even a single torn page, can see and hear its Shinigami, whether or not they own it.                                          | How to Use III · 2   | both  | S1, S2, S12, S18, S19 |
| `haunted-until-death`  | **Haunted until death.** The Shinigami a notebook came from stays with its owner until the owner dies.                                                                                            | How to Use IV · 1    | both  | S1, S2, S20           |
| `lost-490-days`        | **The 490-day grace period.** An owner whose notebook is lost or stolen loses ownership unless they recover it within 490 days.                                                                   | How to Use XII · 1   | both  | S1, S2, S17, S5       |
| `ownership-passes`     | **When the owner dies.** If an owner dies while the notebook is lent out, ownership passes to whoever holds it. Someone who steals a notebook and kills its owner likewise becomes the new owner. | How to Use XIV · 1–2 | manga | S1, S2, S5            |

### Memory

_What is forgotten when a notebook is given up, and what brings it back._

| ID                        | Rule (plain language)                                                                                                                                                                                                                                                | Ref                      | Canon | Sources               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ----- | --------------------- |
| `giving-up-erases-memory` | **To give it up is to forget.** A person who gives up ownership forgets everything connected with the notebook — and only that. The rest of their memories from the same period remain.                                                                              | How to Use XII · 2; XXII | both  | S1, S2, S21, S22, S23 |
| `touch-to-remember`       | **A touch brings it back.** Lost memories return when the person regains ownership of the notebook they used, or simply touches it again. _During the Yotsuba case Rem brings Misa a portion of a notebook: Misa can see Rem again, but her memories do not return._ | How to Use XXXVII · 1–2  | both  | S1, S2, S24, S19      |
| `six-restorations`        | **Six chances to remember.** Memories of a notebook can be recovered this way up to six times per notebook. After that they are gone for good, and the person would have to use it as if for the first time.                                                         | How to Use XXXVIII · 1–2 | manga | S1, S2, S5            |
| `no-kill-no-forgetting`   | **No kill, no forgetting.** Memory loss only touches someone who has killed with the notebook. An owner who never used it keeps their memories when ownership ends, though they lose sight of its Shinigami and any Eyes they traded for.                            | How to Use XLVII         | manga | S1, S2, S5            |

### Pages and Passage

_Lending, torn pages, and notebooks moving between hands and worlds._

| ID                            | Rule (plain language)                                                                                                                                                                                                                                                                                                                 | Ref                   | Canon | Sources                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----- | -------------------------- |
| `pages-and-scraps`            | **A scrap is enough.** A single page, or even a torn fragment of one, carries the notebook’s full power.                                                                                                                                                                                                                              | How to Use VII · 1    | both  | S1, S2, S25, S19, S26, S27 |
| `lending`                     | **Lending without letting go.** An owner may lend the notebook to someone else and remain its owner. _The Shinigami stays with the owner rather than the borrower (How to Use XIII · 2), and only an owner can trade for the Eyes._                                                                                                   | How to Use XIII · 1–2 | both  | S1, S2, S21, S28           |
| `notebook-outlives-shinigami` | **The notebook outlives its god.** When a Shinigami dies, its notebook remains — and keeps its power.                                                                                                                                                                                                                                 | How to Use XVII · 2   | both  | S1, S2, S29, S30           |
| `shinigami-retrieval`         | **A Shinigami may come to collect.** A Shinigami whose notebook has ended up in human hands may stay in the human world until it gets the notebook back. _The manga spells out the conditions: the Shinigami must touch the notebook and haunt whoever holds it, waiting for that person to die or give it up (How to Use XLIV · 2)._ | How to Use XLIII · 1  | both  | S1, S2, S31, S28           |
| `no-buying-or-selling`        | **Not for sale.** A Death Note may not be bought or sold. Anyone who sells one, or buys one, dies. _Added by the King of Death in the 2020 one-shot set after the main story, long after the anime._                                                                                                                                  | How to Use LXVII      | manga | S1, S2, S32, S5            |

### The Eyes

_The Shinigami Eyes: what the trade costs, what it reveals, what it cannot._

| ID                         | Rule (plain language)                                                                                                                                                                                                                                                                    | Ref                  | Canon | Sources                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----- | ------------------------------------ |
| `eye-deal`                 | **The Eyes, for half a life.** An owner may give the Shinigami half of their remaining life in exchange for its eyes, which reveal the name and lifespan of anyone whose face they see.                                                                                                  | How to Use V · 3     | both  | S1, S2, S33, S34, S35, S28, S36, S37 |
| `owners-lifespans-hidden`  | **Owners’ lifespans stay hidden.** The Eyes cannot show the lifespan of anyone who owns a Death Note — the viewer included.                                                                                                                                                              | How to Use XVIII · 2 | both  | S1, S2, S38, S28, S39                |
| `eyes-lost-with-ownership` | **The Eyes go; the price stays.** Giving up ownership takes the Eyes away along with the memories, but the half of a lifetime already paid is never returned.                                                                                                                            | How to Use XII · 2   | both  | S1, S2, S21, S5                      |
| `trade-again`              | **A second trade, a second halving.** Someone who has lost the Eyes can trade for them again, paying half of whatever life remains at that point. _There is no numbered rule for this; it follows from How to Use V · 3 and XII · 2 and is shown in the story._                          | —                    | both  | S34, S19, S5, S39                    |
| `more-than-half-a-face`    | **More than half a face.** The Eyes need more than half of a person’s face in view. A partly hidden face still works if enough of it can be seen.                                                                                                                                        | How to Use XX · 1    | manga | S1, S2, S39                          |
| `photographs-not-drawings` | **Photographs, never drawings.** A photograph works however old it is, though its clarity and size can matter. A drawing never works, however lifelike.                                                                                                                                  | How to Use XX · 2    | manga | S1, S2, S39                          |
| `keener-sight`             | **Keener sight.** Whatever their eyesight before, a person with the Eyes gains vision of 3.6 or better on the decimal scale used in Japanese eye tests.                                                                                                                                  | How to Use XXI       | manga | S1, S2, S5                           |
| `true-name-original-span`  | **The true name, the original span.** The Eyes show the name needed to kill a person — their true name, even if it appears in no official register — and the lifespan they were originally meant to have. _A life shortened indirectly by the notebook still shows its original length._ | How to Use XXX · 1–2 | manga | S1, S2, S39, S35                     |
| `borrowers-cannot-trade`   | **Borrowers cannot trade.** Only an owner can make the Eye trade; someone who has merely borrowed a notebook cannot.                                                                                                                                                                     | How to Use XIII · 3  | manga | S1, S2, S39                          |

### Lifespan

_The quiet arithmetic of years that lies beneath every entry._

| ID                     | Rule (plain language)                                                                                                                                                                                                                                          | Ref                       | Canon | Sources     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----- | ----------- |
| `life-flows-one-way`   | **Life flows one way.** A Shinigami lengthens its own life by writing human names in its notebook. Humans cannot extend their lives this way; for them the notebook can only cost life. _The anime’s account of Gelus rests on the same economy of lifespans._ | How to Use V · 1–2        | manga | S1, S2, S29 |
| `no-death-beyond-fate` | **No death beyond fate.** A death cannot be set for later than the end of the victim’s original lifespan. If it is, the victim dies when that lifespan runs out.                                                                                               | How to Use LVII           | manga | S1, S2, S7  |
| `ripples`              | **Ripples.** A death caused by the notebook can indirectly lengthen other people’s lives, even when no one intends it. For a human writer there is no penalty.                                                                                                 | How to Use LVIII · 1; LIX | manga | S1, S2, S7  |

### Shinigami

_What the gods of death may do, must do, and are forbidden to do._

| ID                       | Rule (plain language)                                                                                                                                                                                                                                                                                                     | Ref                        | Canon | Sources               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----- | --------------------- |
| `shinigami-neutral`      | **Neither help nor hindrance.** In principle, the Shinigami attached to a notebook does nothing to help or to prevent the deaths written in it.                                                                                                                                                                           | How to Use IV · 3          | both  | S1, S2, S40, S33      |
| `no-duty-to-explain`     | **No duty to explain.** A Shinigami need not explain the notebook or its rules to its owner unless asked.                                                                                                                                                                                                                 | How to Use IV · 4          | manga | S1, S2                |
| `thirty-nine-days`       | **Thirty-nine days.** A Shinigami must show itself to a human who has used its notebook within 39 days of that first use.                                                                                                                                                                                                 | How to Use IV · 2          | both  | S1, S2, S40, S4       |
| `beyond-weapons`         | **Beyond the reach of weapons.** A knife through the heart or a bullet to the head cannot kill a Shinigami. Other ways exist, but most Shinigami do not know them.                                                                                                                                                        | How to Use V · 4           | both  | S1, S2, S14, S18      |
| `shinigami-know-little`  | **Even the gods are guessing.** Shinigami understand surprisingly little about the notebook — including the exact limits on which circumstances will work.                                                                                                                                                                | How to Use VII · 3; VI · 2 | both  | S1, S2, S6            |
| `keeps-own-notebook`     | **Every Shinigami keeps one.** A Shinigami must always own at least one notebook, which may never be lent to a human or written in by one. _Shinigami may swap notebooks among themselves (How to Use XVI · 2)._                                                                                                          | How to Use XVI · 1         | both  | S1, S2, S10, S41      |
| `love-is-fatal`          | **Love is fatal.** A Shinigami that kills with its notebook in order to lengthen the life of a human it cares for will die — though the human’s life is extended. _A later rule restates it: a Shinigami that deliberately extends a human’s life dies, while a human who does the same does not (How to Use LVIII · 2)._ | How to Use XVII · 1        | both  | S1, S2, S29, S42, S30 |
| `who-may-kill-an-owner`  | **Only one may kill the owner.** A Shinigami watching from its own realm cannot kill a notebook’s owner, nor can one that comes to the human world for that purpose. Only the Shinigami that brought the notebook to that human may do it.                                                                                | How to Use XXXIV · 1–3     | manga | S1, S2                |
| `the-bringer-may-end-it` | **The bringer may end it.** The Shinigami that brought a notebook to the human world and gave it to a human may kill that owner with its own notebook — for instance, because it has come to dislike them.                                                                                                                | How to Use LX              | both  | S1, S2, S4, S43       |
| `names-are-not-told`     | **Names are not for telling.** A Shinigami must not tell humans the names or lifespans it sees.                                                                                                                                                                                                                           | How to Use XVIII · 3       | manga | S1, S2, S39           |

### Limits

_Ages, thresholds and the boundaries no entry can cross._

| ID                        | Rule (plain language)                                                                                                                                                                                                                                                                                     | Ref                 | Canon | Sources         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----- | --------------- |
| `neither-heaven-nor-hell` | **Neither Heaven nor Hell.** A human who uses the Death Note can go to neither Heaven nor Hell.                                                                                                                                                                                                           | How to Use II · 3   | both  | S1, S2, S3, S41 |
| `too-young`               | **Too young to be written.** The Death Note has no effect on anyone less than 780 days old — a little over two years.                                                                                                                                                                                     | How to Use IX · 1   | both  | S1, S2, S8, S5  |
| `too-old`                 | **Beyond its reach by age.** Nobody aged 124 or older can be killed with the Death Note.                                                                                                                                                                                                                  | How to Use XXIX · 1 | manga | S1, S2, S5, S7  |
| `final-twelve-minutes`    | **The final twelve minutes.** Nor can it kill someone whose original lifespan has less than 12 minutes left to run.                                                                                                                                                                                       | How to Use XXIX · 2 | manga | S1, S2, S5, S7  |
| `six-notebooks`           | **Six at most.** No more than six Death Notes can be at work in the human world at once, not counting the Shinigami’s own. A seventh stays powerless until one of the six is burned or taken back to the Shinigami realm. _A single Shinigami may hand notebooks to no more than three humans at a time._ | How to Use XLIX–LII | manga | S1, S2          |
| `nothingness`             | **Nothingness.** Every human dies in the end. Afterwards they go to Mu — nothingness — and once dead, no one ever returns. _From the unnumbered rule pages that close the final volume. The anime never states it outright._                                                                              | —                   | manga | S1, S2, S44     |

### False Rules

_Two lines Light had written into the notebook to mislead his pursuers._

| ID                  | Rule (plain language)                                                                                                                                                                                                                                                                                                         | Ref | Canon                 | Sources            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --------------------- | ------------------ |
| `thirteen-day-rule` | **The thirteen-day rule.** Claims that anyone who has written in the notebook must write another name within 13 days of the last, or die. _False. Light had Ryuk write it into the notebook so that he and Misa — held in custody for more than fifty days without writing anything — would appear innocent._                 | —   | both · **false rule** | S19, S28, S45, S46 |
| `destruction-rule`  | **Destroy it, and all who touched it die.** Claims that if the notebook is made unusable — torn up or burned — everyone who has ever touched it will die. _False, and written in at Light’s instruction alongside the thirteen-day rule. If believed, it makes destroying the notebook fatal to everyone who has handled it._ | —   | both · **false rule** | S19, S46, S5       |

### Source key

- **S1** — [Death Note Wiki — Manga Chapter Rules (How to Use numbering)](https://deathnote.fandom.com/wiki/Rules_of_the_Death_Note/Manga_Chapter_Rules)
- **S2** — [How to Use I–LXVII by volume (copy of the wiki table)](https://shirodevil.blogspot.com/2021/07/the-rules-of-death-note.html)
- **S3** — [Anime, Ep. 1 “Rebirth” — rule card, How to Use I–II](https://deathnote.fandom.com/wiki/Rebirth)
- **S4** — [Anime, Ep. 1 “Rebirth”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S5** — [Japanese Wikipedia — DEATH NOTE (rules overview)](https://ja.wikipedia.org/wiki/DEATH_NOTE)
- **S6** — [Anime, Ep. 11 “Assault” — rule card, How to Use VII · 2–3](https://deathnote.fandom.com/wiki/Assault)
- **S7** — [How to Read 13 rules grouped by subject](https://startracex.github.io/dn/notes/how-to-use-it)
- **S8** — [Anime, Ep. 13 “Confession” — rule card, How to Use IX · 1–2](https://deathnote.fandom.com/wiki/Confessions)
- **S9** — [Death Note Wiki — rules as compiled in How to Read 13](https://deathnote.fandom.com/wiki/Rules_of_the_Death_Note/How_to_Read_Rules)
- **S10** — [Anime, Ep. 20 “Makeshift” — rule card, How to Use XV · 2, XVI · 1](https://deathnote.fandom.com/wiki/Makeshift)
- **S11** — [Anime, Ep. 2 “Confrontation”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S12** — [Anime, Ep. 2 “Confrontation” — rule card, How to Use III](https://deathnote.fandom.com/wiki/Confrontation)
- **S13** — [Anime, Ep. 4 “Pursuit” — transcript (prisoner experiments)](https://deathnote.fandom.com/wiki/Pursuit/Transcript)
- **S14** — [Anime, Ep. 9 “Encounter” — rule card, How to Use V · 4, VI · 1](https://deathnote.fandom.com/wiki/Encounter)
- **S15** — [Anime, Ep. 14 “Friend” — rule card, How to Use X · 1–2](https://deathnote.fandom.com/wiki/Friend)
- **S16** — [Anime, Ep. 7 “Overcast”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S17** — [Anime, Ep. 16 “Decision” — rule card, How to Use XI · 3, XII · 1](<https://deathnote.fandom.com/wiki/Decision_(episode)>)
- **S18** — [Anime, Ep. 4 “Pursuit”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S19** — [Anime, Ep. 24 “Revival”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S20** — [Anime, Ep. 3 “Dealings” — rule card, How to Use IV · 1](https://deathnote.fandom.com/wiki/Dealings)
- **S21** — [Anime, Ep. 17 “Execution” — rule card, How to Use XII · 2, XIII · 1](https://deathnote.fandom.com/wiki/Execution)
- **S22** — [Anime, Ep. 15 “Wager”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S23** — [Anime, Ep. 16 “Decision”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S24** — [Anime, Ep. 21 “Performance”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S25** — [Anime, Ep. 8 “Glare”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S26** — [Anime, Ep. 33 “Scorn”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S27** — [Anime, Ep. 35 “Malice”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S28** — [Anime, Ep. 29 “Father”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S29** — [Anime, Ep. 12 “Love” — Gelus](<https://deathnote.fandom.com/wiki/Love_(episode)>)
- **S30** — [Anime, Ep. 25 “Silence”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S31** — [Anime, Ep. 28 “Impatience”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S32** — [Death Note Wiki — The a-Kira Story (2020 one-shot)](https://deathnote.fandom.com/wiki/The_a-Kira_Story)
- **S33** — [Anime, Ep. 3 “Dealings”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S34** — [Anime, Ep. 11 “Assault”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S35** — [Anime, Ep. 23 “Frenzy”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S36** — [Death Note Wiki — Kyosuke Higuchi](https://deathnote.fandom.com/wiki/Kyosuke_Higuchi)
- **S37** — [Death Note Wiki — Teru Mikami](https://deathnote.fandom.com/wiki/Teru_Mikami)
- **S38** — [Anime, Ep. 13 “Confession”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S39** — [Death Note Wiki — Shinigami Eyes](https://deathnote.fandom.com/wiki/Shinigami_Eyes)
- **S40** — [Anime, Ep. 6 “Unraveling” — rule card, How to Use IV · 2–3](https://deathnote.fandom.com/wiki/Unraveling)
- **S41** — [Death Note Wiki — Ryuk](https://deathnote.fandom.com/wiki/Ryuk)
- **S42** — [Anime, Ep. 12 “Love”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S43** — [Anime, Ep. 37 “New World”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S44** — [Death Note Wiki — Talk: Mu (manga and anime on the afterlife)](https://deathnote.fandom.com/wiki/Talk:Mu)
- **S45** — [Anime, Ep. 30 “Justice”](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
- **S46** — [Death Note Wiki — Fake Death Note Rules](https://deathnote.fandom.com/wiki/Fake_Death_Note_Rules)

## 3. Shinigami Eyes and supernatural mechanics

Source material for Chapter 17. Every step cites the rule ids above.

### 3.1 The trade, step by step

1. **Who can trade.** Only a notebook’s _owner_, and only with the Shinigami attached to that
   notebook (`eye-deal`). A borrower cannot (`borrowers-cannot-trade`, manga).
2. **The price.** Half of the owner’s _remaining_ life — not half of a whole life
   (`eye-deal`). The owner is never told the figure: a Shinigami may not reveal lifespans to
   humans (`names-are-not-told`, manga).
3. **What is gained.** Looking at a face reveals that person’s name and lifespan
   (`eye-deal`). The name shown is the one the notebook needs — the true name, registered or
   not — and the lifespan is the one the person was originally meant to have
   (`true-name-original-span`, manga). Eyesight itself sharpens to 3.6 or better
   (`keener-sight`, manga).
4. **Conditions of sight.** More than half of the face must be visible
   (`more-than-half-a-face`, manga). Photographs work however old; drawings never do
   (`photographs-not-drawings`, manga).
5. **The blind spot.** The Eyes cannot show the lifespan of any Death Note owner, the viewer
   included (`owners-lifespans-hidden`). An unreadable lifespan therefore marks an owner.
6. **Losing them.** Giving up ownership removes the Eyes with the memories; the life already
   paid is never refunded (`eyes-lost-with-ownership`).
7. **Trading again.** A former holder who regains a notebook can trade again, paying half of
   what is left at that moment (`trade-again`). Two trades leave a quarter of the remaining
   life; three, an eighth.

**Illustrative arithmetic** (invented figures, for the diagram only — the story never states
anyone’s numbers): 60 years remaining → first trade → 30 → second trade → 15.

### 3.2 Worked examples from the story

| Who                     | Shinigami | What happens                                                                                                                                                                                                                                | Anime          |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **Light**               | Ryuk      | Ryuk offers the trade early on; Light declines and keeps his full span.                                                                                                                                                                     | Ep. 3          |
| **Misa** (first trade)  | Rem       | Arrives as the second Kira already holding the Eyes; spots Light as Kira because his lifespan is the one she cannot see.                                                                                                                    | Eps. 11, 13    |
| **Misa** (second trade) | Ryuk      | After digging up the notebook Light buried, her memories return and she trades again — halving what remained a second time.                                                                                                                 | Ep. 24         |
| **Higuchi**             | Rem       | Writes Matsuda’s cover name in his notebook and nothing happens; he then trades for the Eyes, which let him kill on sight of a face — and L orders his capture.                                                                             | Ep. 23         |
| **Soichiro**            | Ryuk      | Trades to learn Mello’s true name during the raid, sees it, but is shot before he can write it. Dying, he can see Light’s lifespan — Light had given up ownership and borrowed Misa’s notebook — and dies believing his son cannot be Kira. | Ep. 29         |
| **Mikami**              | Ryuk      | Takes over Misa’s notebook and trades with Ryuk. At the warehouse he writes the names of everyone present except Light’s; Near’s team has tampered with the notebook, so no one dies.                                                       | Eps. 32, 36–37 |

What each example teaches: Light’s refusal shows the price is optional; Misa shows the blind
spot and the re-trade; Higuchi shows why a true name matters; Soichiro shows ownership as a
switch that turns the blind spot on and off; Mikami shows that the Eyes give names, but only a
genuine notebook kills.

### 3.3 Shinigami and the economy of lifespans

- **Shinigami live on human lifespans.** Writing a human’s name adds that human’s remaining
  life to the Shinigami’s own; humans cannot use the notebook to lengthen their lives
  (`life-flows-one-way`, manga text; the anime’s Gelus story rests on it).
- **The fatal exception.** A Shinigami that kills to lengthen the life of a human it cares
  for dies, and the human’s life is extended (`love-is-fatal`). Gelus dies saving Misa from a
  stalker (Ep. 12); Rem dies killing L and Watari to protect Misa, as Light had engineered
  (Ep. 25).
- **No ordinary death.** Knives and bullets do nothing (`beyond-weapons`); the bus hijacker
  fires at Ryuk in Ep. 4.
- **Neutral by principle.** A Shinigami does not, in principle, help or prevent the deaths in
  its notebook (`shinigami-neutral`), and need not explain the rules unless asked
  (`no-duty-to-explain`, manga). Ryuk tells Light he is not on his side (Ep. 3).
- **The last word.** The Shinigami that brought a notebook to its owner may kill that owner
  (`the-bringer-may-end-it`); the manga adds that no other Shinigami may
  (`who-may-kill-an-owner`). Ryuk promises Light this at their first meeting and keeps the
  promise in Ep. 37.
- **Notebooks outlast their gods** (`notebook-outlives-shinigami`): Rem brings Misa the
  notebook Gelus left; Light quietly takes Rem’s after her death (Ep. 25). Every Shinigami must
  keep one notebook of its own (`keeps-own-notebook`); the one that falls to Light is a second
  notebook Ryuk had obtained.

### 3.4 Ownership, touch and memory — Light’s confinement gambit

1. A notebook that lands in the human world belongs to whoever takes it up; its Shinigami can
   be seen by the owner (`human-world-property`, `owner-sees-shinigami`) and by anyone who
   touches it, even a scrap (`touch-to-see`).
2. Giving up ownership erases notebook memories — and only those (`giving-up-erases-memory`).
   Misa (Ep. 15) and then Light (Ep. 16) renounce their notebooks while confined; Light
   emerges sincerely hunting Kira.
3. Meanwhile Rem passes a notebook to Higuchi (Yotsuba), and Light buries Misa’s notebook.
4. Touching the notebook again restores the memories (`touch-to-remember`). Light handles the
   notebook seized from Higuchi and remembers everything; he kills Higuchi with a scrap hidden
   in his wristwatch (`pages-and-scraps`). Misa digs up the buried notebook and remembers too
   (Ep. 24). Earlier, a portion of a notebook brought by Rem let Misa see Rem again without
   restoring her memories (Ep. 21).
5. The task force reads the notebook’s rules, including the two false ones; the thirteen-day
   rule makes Light and Misa’s long, harmless confinement look like proof of innocence
   (`thirteen-day-rule`, Ep. 24).

## 4. Anime vs manga differences in rules

In substance both versions run on the same rulebook. The differences are in what is shown.

| Topic                       | Manga                                                                                                               | Anime                                                                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How rules are presented     | Full-page How to Use pages between chapters (I–LXVI, volumes 1–11), plus two unnumbered pages closing volume 12.    | Numbered rule cards around commercial breaks (verified for rules between I and XVI, Eps. 1–20), plus rules spoken by Ryuk and Rem, written inside the cover, or read aloud by the task force (Ep. 24).              |
| Coverage                    | Every rule in the dataset.                                                                                          | Rule cards after XVI unverified; 26 rules are therefore labelled `manga`, including the 23-day rule, the age and twelve-minute limits, six restorations of memory, deliberate misspelling and the six-notebook cap. |
| The afterlife               | The closing rule pages state that every human goes to Mu — nothingness — and the dead never return (`nothingness`). | Not stated outright. Only “neither Heaven nor Hell” (Ep. 1) is shown.                                                                                                                                               |
| The bringer’s right to kill | Ryuk writes Light’s name in the warehouse.                                                                          | Light escapes the warehouse wounded; Ryuk writes his name as he flees (Ep. 37). Same rule, different staging.                                                                                                       |
| Fate of the false rules     | Ryuk confirms both are lies and Near has the notebooks burned.                                                      | Sidoh tells Mello the thirteen-day rule is false (Ep. 29) and Near proposes testing it (Ep. 30); the burning is not shown.                                                                                          |
| Later additions             | The 2020 one-shot adds a ban on buying and selling notebooks (How to Use LXVII).                                    | Postdates the anime; not part of it.                                                                                                                                                                                |
| The 0.06-second rule        | The figure is 0.06 s in How to Read 13; a fan wiki reports earlier printings said 0.6 s (unconfirmed).              | The Ep. 20 card shows 0.06 s.                                                                                                                                                                                       |

## 5. Do not claim

1. That the **thirteen-day rule** or the **destruction rule** is real. Both are false rules
   Light had Ryuk write; label them as such every time they appear.
2. That Kira’s victims **always** die of heart attacks. A heart attack is only the default.
3. That a **name alone** is enough. The writer must picture the face; cover names fail
   (Higuchi and Matsuda’s alias, Ep. 23).
4. That the Eyes show **owners’ lifespans** or the holder’s own, or that the price can be
   **refunded**, or that a **borrower** can trade.
5. That giving up the notebook erases **all** memory of the period. Only notebook-related
   memories go.
6. That the anime states the 23-day rule, the 124-year or twelve-minute limits, the six-
   notebook cap, the six restorations of memory or Mu. These are verified only in the manga.
7. That anything can **undo** a Death Note death. The “Death Eraser” belongs only to the 2003
   pilot one-shot and exists in neither the serialized manga nor the anime.
8. That Light **becomes a Shinigami** after death. A fan theory with no canon basis.
9. That the figure Light sees in his final moments in the anime is **L’s ghost**. Describe
   what is shown; do not interpret it.
10. That the notebook **hypnotises or corrupts** its owner by supernatural means. No rule says
    so; an anime-only shot of Light putting the notebook down and picking it up again is
    sometimes read that way.
11. Rules from the **live-action** films (2006, 2016), the 2015 drama, the 2017 Netflix film,
    novels, games or the musical. Several of those change the rules.
12. Any rule from **fan-made lists** not traceable to a How to Use page; many such lists mix in
    the false rules, film rules and invented clauses.
13. That the anime gives **L’s full name**. “L Lawliet” first appears in How to Read 13.
14. **Motives** for Ryuk beyond what the story shows (mercy, affection, regret). State only
    that he writes Light’s name, as he said he would.
15. The wrong **Eye partners**: Higuchi traded with Rem; Soichiro and Mikami with Ryuk; Misa
    with Rem, then Ryuk. Light never traded.
16. Resolutions of tensions the story leaves open — for example how Rem’s threat to kill Light
    (Ep. 14) squares with How to Use XXXIV. Do not fill such gaps with fan explanations.
17. Exact lifespan numbers for any character. The story does not give them; diagrams must use
    clearly illustrative figures.

## 6. Open questions and deliberate exclusions

- **Rule cards after Ep. 20.** Not verifiable; later rules default to `manga`. If a reliable
  per-episode list for Eps. 21–37 is found, upgrade the matching rules to `both`.
- **How to Use III · 1** is labelled `both` because the Ep. 2 card is listed as “How to Use
  III” as a whole, not item by item.
- **XLIX–LII (six notebooks)** rests on the wiki table alone; one fan article calls the rule
  guidebook-only. Either way the label is `manga`.
- **LXVII** is the wiki’s number for the 2020 one-shot’s rules; unconfirmed elsewhere.
- **Boundaries:** “124 or older” follows the wiki table and Japanese Wikipedia (one fan list
  says “over 124”); “less than 12 minutes” follows the English rule lists (Japanese
  Wikipedia’s summary reads as “12 minutes or less”).
- **Excluded as trivia or too uncertain:** Shinigami genders and sleep (XXXVI, XLVIII);
  Shinigami law and offence levels (XLVI); reasons to linger in the human world and the
  82-hour clauses (XXIV); return to the Shinigami realm (LXIV); the guidebook in the
  Shinigami realm (LXV); cover colours (LXVI); children under six (XXV); splitting one entry
  across two notebooks (XXXII); recognising a Shinigami after losing possession (XXXIII);
  memory with several notebooks (XXIII); finding a human through the realm’s opening (XLV);
  the photo-of-the-dead rule (the second XXXIX); detecting the Eyes (LXIII); the other
  2020 one-shot clauses. Also excluded: Light writing in blood with the watch’s needle, which
  only fan sources describe.

## 7. Sources

Fetched directly:

- [Wikipedia — List of Death Note episodes](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes)
  (episode titles and summaries for every “Anime, Ep.” citation)
- [Wikipedia — Death Note](https://en.wikipedia.org/wiki/Death_Note)
- [Wikipedia — L (Death Note)](<https://en.wikipedia.org/wiki/L_(Death_Note)>) (L Lawliet from How to Read 13)
- [Japanese Wikipedia — DEATH NOTE](https://ja.wikipedia.org/wiki/DEATH_NOTE) (rules overview, false rules, ending)
- [Volume-by-volume copy of the wiki’s How to Use table](https://shirodevil.blogspot.com/2021/07/the-rules-of-death-note.html)
- [How to Read 13 rules grouped by subject](https://startracex.github.io/dn/notes/how-to-use-it)

Checked through search-engine retrieval (direct fetch blocked by TLS errors):

- [Death Note Wiki — Manga Chapter Rules](https://deathnote.fandom.com/wiki/Rules_of_the_Death_Note/Manga_Chapter_Rules)
- [Death Note Wiki — How to Read Rules](https://deathnote.fandom.com/wiki/Rules_of_the_Death_Note/How_to_Read_Rules)
- Death Note Wiki episode pages with rule cards: [Rebirth](https://deathnote.fandom.com/wiki/Rebirth),
  [Confrontation](https://deathnote.fandom.com/wiki/Confrontation),
  [Dealings](https://deathnote.fandom.com/wiki/Dealings),
  [Unraveling](https://deathnote.fandom.com/wiki/Unraveling),
  [Encounter](https://deathnote.fandom.com/wiki/Encounter),
  [Assault](https://deathnote.fandom.com/wiki/Assault),
  [Confessions](https://deathnote.fandom.com/wiki/Confessions),
  [Friend](https://deathnote.fandom.com/wiki/Friend),
  [Decision (episode)](<https://deathnote.fandom.com/wiki/Decision_(episode)>),
  [Execution](https://deathnote.fandom.com/wiki/Execution),
  [Makeshift](https://deathnote.fandom.com/wiki/Makeshift)
- Death Note Wiki: [Pursuit/Transcript](https://deathnote.fandom.com/wiki/Pursuit/Transcript),
  [Love (episode)](<https://deathnote.fandom.com/wiki/Love_(episode)>),
  [Shinigami Eyes](https://deathnote.fandom.com/wiki/Shinigami_Eyes),
  [Teru Mikami](https://deathnote.fandom.com/wiki/Teru_Mikami),
  [Kyosuke Higuchi](https://deathnote.fandom.com/wiki/Kyosuke_Higuchi),
  [Ryuk](https://deathnote.fandom.com/wiki/Ryuk),
  [Fake Death Note Rules](https://deathnote.fandom.com/wiki/Fake_Death_Note_Rules),
  [Talk:Mu](https://deathnote.fandom.com/wiki/Talk:Mu),
  [The a-Kira Story](https://deathnote.fandom.com/wiki/The_a-Kira_Story),
  [Taro Kagami](https://deathnote.fandom.com/wiki/Taro_Kagami) (pilot and the Death Eraser),
  [Rules of the Death Note/2017 film rules](https://deathnote.fandom.com/wiki/Rules_of_the_Death_Note/2017_film_rules)
- [Wikipedia — List of Death Note characters](https://en.wikipedia.org/wiki/List_of_Death_Note_characters)
  (warehouse finale: Mikami writes every name but Light’s)
