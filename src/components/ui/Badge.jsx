export default function Badge({ label, bg, color, style }) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 500,
      padding: '2px 9px',
      borderRadius: 100,
      background: bg,
      color,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {label}
    </span>
  );
}
