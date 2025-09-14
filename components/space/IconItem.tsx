export default function IconItem({
  sectionIndex,
  iconIndex,
}: {
  sectionIndex: number;
  iconIndex: number;
}) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        height: '100%',
        width: '100%',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        userSelect: 'none',
      }}
      title={`Section ${sectionIndex + 1} - Icon ${iconIndex + 1}`}
    >
      S{sectionIndex + 1}-I{iconIndex + 1}
    </div>
  );
}
