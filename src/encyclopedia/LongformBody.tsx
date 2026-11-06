import type { ChapterId } from '@/data/types';
import { CharacterArchive } from './CharacterArchive';
import { EyesMechanics } from './EyesMechanics';
import { Legacy } from './Legacy';
import { Rulebook } from './Rulebook';
import './encyclopedia.css';

/** Body of the long-form archive chapters (16–19). */
export function LongformBody({ id }: { id: ChapterId }) {
  switch (id) {
    case 'rulebook':
      return <Rulebook />;
    case 'eyes':
      return <EyesMechanics />;
    case 'archive':
      return <CharacterArchive />;
    case 'legacy':
      return <Legacy />;
    default:
      return null;
  }
}
