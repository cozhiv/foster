import IconRow from './IconRow';

export default function SectionRow({ index }: { index: number }) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        padding: '10px 16px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        Section {index + 1}
      </div>
      <IconRow sectionIndex={index} />
    </div>
  );
}
