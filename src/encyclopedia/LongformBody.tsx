import type { ChapterId } from '@/data/types';
import './encyclopedia.css';

/**
 * Body of the long-form archive chapters (16–19). The interactive archive
 * interfaces are mounted here as they are completed (see PROGRESS.md).
 */
export function LongformBody({ id }: { id: ChapterId }) {
  switch (id) {
    case 'rulebook':
      return (
        <div className="lf-intro">
          <p>
            The notebook comes with instructions. Some appear on screen in the anime; many more are written only in the
            manga and its official guidebook. This archive gathers them in plain language, labels where each one comes
            from, and marks the two rules that were never true.
          </p>
        </div>
      );
    case 'eyes':
      return (
        <div className="lf-intro">
          <p>
            A Shinigami sees every human’s name and remaining lifespan. A human can share that sight — at a price that
            shapes the fates of Misa, Higuchi, Soichiro Yagami and Mikami.
          </p>
        </div>
      );
    case 'archive':
      return (
        <div className="lf-intro">
          <p>
            Detectives, gods of death, believers and bystanders. Each profile follows a person through the story — who
            they were, what they wanted, and what the notebook made of them.
          </p>
        </div>
      );
    case 'legacy':
      return (
        <div className="lf-intro">
          <p>
            Death Note asks a question it never fully answers: if you could punish the guilty without consequence,
            should you? Its power lies less in the notebook than in the people who argue over it.
          </p>
        </div>
      );
    default:
      return null;
  }
}
