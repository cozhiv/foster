import { Virtuoso } from 'react-virtuoso';
import SectionRow from './SectionRow';

const NUM_SECTIONS = 40;
const SECTION_HEIGHT = 132; // row height incl. header + inner list

export default function SectionList() {
  return (
    <div style={{ height: '100vh' }}>
      <Virtuoso
        totalCount={NUM_SECTIONS}
        itemContent={(index) => <SectionRow index={index} />}
        // Optional tuning:
        overscan={200} // px
        style={{ height: '100%' }}
        computeItemKey={(index) => `section-${index}`}
      // If rows are truly fixed, you can hint size via CSS to help layout
      />
    </div>
  );
}

