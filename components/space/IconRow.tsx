import { Virtuoso } from 'react-virtuoso';
import IconItem from './IconItem';

const NUM_ICONS = 40;
const ICON_SIZE = 64;   // content size
const ICON_GAP = 8;     // spacing between icons
const ROW_HEIGHT = ICON_SIZE; // the scroller height

export default function IconRow({ sectionIndex }: { sectionIndex: number }) {
  return (
    <div style={{ width: '100%' }}>
      <Virtuoso
        totalCount={NUM_ICONS}
        horizontalDirection
        itemContent={(iconIndex) => (
          <IconItem sectionIndex={sectionIndex} iconIndex={iconIndex} />
        )}
        // The horizontal list needs a fixed height to measure correctly
        style={{ height: ROW_HEIGHT }}
        components={{
          // Provide layout classes so items render inline horizontally:
          List: ({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                whiteSpace: 'nowrap',
                // avoid vertical jitter
                display: 'block',
              }}
            />
          ),
          Item: ({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                display: 'inline-block',
                width: ICON_SIZE,
                height: ICON_SIZE,
                marginRight: ICON_GAP,
                verticalAlign: 'top',
              }}
            />
          ),
        }}
        computeItemKey={(index) => `section-${sectionIndex}-icon-${index}`}
        overscan={200}
      />
    </div>
  );
}
