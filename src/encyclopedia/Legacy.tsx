import { Link } from 'react-router';

const ESSAYS: ReadonlyArray<{ title: string; body: readonly string[] }> = [
  {
    title: 'Justice without appeal',
    body: [
      'Kira’s promise is simple: the guilty die, and fear does the rest. What the story never lets us forget is everything that promise removes — trials, evidence, mistakes that can be corrected, the possibility that a person might change.',
      'It does not answer whether the world is better under Kira. It shows a world that becomes quieter and more frightened at the same time, and leaves the judgement with us.',
    ],
  },
  {
    title: 'The god complex',
    body: [
      'Light begins by punishing criminals and ends by killing anyone who stands in his way — investigators, rivals, allies who have outlived their usefulness. The notebook does not change his intelligence; it changes what he believes he is entitled to.',
      'His stated goal, to become the god of a new world, is the point at which justice turns into self-worship.',
    ],
  },
  {
    title: 'Power reveals',
    body: [
      'Every new owner shows a different face of the same power. The Yotsuba executives turn it into a business plan. Misa uses it out of devotion. Mikami wields it with a zealot’s certainty. The notebook stays the same; the people holding it do not.',
    ],
  },
  {
    title: 'Two minds',
    body: [
      'Light and L are drawn as opposites — order and disorder, charm and eccentricity, a son of the police and a detective without a face — yet they mirror each other. Both are proud, both hate to lose, and both are willing to bend rules to win: L baits Kira with a condemned man and puts suspects under surveillance and confinement.',
      'Their duel is fought almost entirely through conversation, deduction and bluff, which is what makes it so tense.',
    ],
  },
  {
    title: 'Fear and the crowd',
    body: [
      'The most unsettling force in Death Note may be the public. Television profits from Kira, followers gather in his name, and institutions decide that resisting him is not worth the risk. Kira needs believers as much as he needs a notebook.',
    ],
  },
];

/** Chapter 19 — psychology, philosophy and legacy; closes the notebook and opens the tribute. */
export function Legacy() {
  return (
    <div className="legacy">
      <div className="lf-intro">
        <p>
          Death Note asks a question it never fully answers: if you could punish the guilty without
          consequence, should you? Its power lies less in the notebook than in the people who argue
          over it.
        </p>
      </div>

      <div className="essays">
        {ESSAYS.map((e) => (
          <section key={e.title} className="essay">
            <h3 className="essay__title">{e.title}</h3>
            {e.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}
        <section className="essay">
          <h3 className="essay__title">Anime and manga</h3>
          <p>
            The anime follows the manga closely but differs in its final chapters. In the anime,
            Light escapes the warehouse and dies alone on a stairway, seeing L; in the manga, he
            dies on the warehouse floor. Mikami stabs himself in the anime and dies later in prison
            in the manga. The anime adds the rooftop scene in the rain before L’s death, and sets
            its calendar three years later than the manga’s.
          </p>
          <p>
            The manga’s epilogue includes Matsuda wondering whether Near tampered with Mikami’s
            notebook — speculation voiced by a character, never confirmed.
          </p>
        </section>
        <section className="essay">
          <h3 className="essay__title">Why it stays with us</h3>
          <p>
            Because it refuses to make the choice easy. It gives its most dangerous idea to its most
            persuasive character, lets the people who stop him be flawed, and ends without telling
            us what to feel. Long after the last page, the question remains — and so does the
            notebook.
          </p>
        </section>
      </div>

      <div className="closing" aria-labelledby="closing-title">
        <div className="closing__book" aria-hidden="true">
          <span className="closing__cover closing__cover--left" />
          <span className="closing__cover closing__cover--right" />
        </div>
        <p className="mono-label">The notebook closes</p>
        <h3 id="closing-title" className="closing__title">
          The story belongs to the people who made it.
        </h3>
        <p className="closing__text">
          This experience ends with a separate page — a thank-you to Tsugumi Ohba and Takeshi Obata,
          who created Death Note.
        </p>
        <Link className="button button--primary closing__cta" to="/tribute">
          Visit the tribute to its creators
        </Link>
      </div>
    </div>
  );
}
