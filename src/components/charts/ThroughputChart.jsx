import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { throughputData } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--color-bg-primary)',
      border: '0.5px solid var(--color-border)',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 12,
    }}>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{payload[0].value} docs</div>
    </div>
  );
};

export default function ThroughputChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={throughputData} barSize={20} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-bg-tertiary)' }} />
        <Bar dataKey="docs" fill="#185fa5" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
