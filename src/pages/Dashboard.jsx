import Topbar from '../components/layout/Topbar';
import MetricCard from '../components/ui/MetricCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ThroughputChart from '../components/charts/ThroughputChart';
import { kpiData, pipelineQueue, pipelineStages, alerts, tenants } from '../data/mockData';
import { statusConfig } from '../utils/helpers';
import { useLiveMetric } from '../hooks/useLive';
import styles from './Dashboard.module.css';

function AlertIcon({ type }) {
  const map = {
    error:   { icon: '✕', bg: '#fcebeb', color: '#a32d2d' },
    warning: { icon: '!', bg: '#faeeda', color: '#854f0b' },
    success: { icon: '✓', bg: '#eaf3de', color: '#3b6d11' },
  };
  const c = map[type] || map.warning;
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 8,
      background: c.bg, color: c.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 600, flexShrink: 0,
    }}>{c.icon}</div>
  );
}

export default function Dashboard() {
  const liveQueue = useLiveMetric(312, 8);

  return (
    <div className={styles.page}>
      <Topbar title="Operations overview" subtitle="Today · June 20, 2026" />

      <div className={styles.content}>
        <div className={styles.metrics}>
          <MetricCard label="Documents today" value="1,284" delta="↑ 12% vs yesterday" deltaType="positive" />
          <MetricCard label="Avg turnaround" value="4.2 min" delta="↓ 0.8 min faster" deltaType="positive" />
          <MetricCard label="Extraction success" value="97.3%" delta="↓ 0.4% vs target" deltaType="warning" />
          <MetricCard label="DLQ backlog" value="18" delta="↑ 6 since 9am" deltaType="negative" />
        </div>

        <div className={styles.row}>
          <Card title="Processing queue" subtitle="Live · refreshes every 5s">
            <div>
              {pipelineQueue.slice(0, 7).map(doc => {
                const s = statusConfig[doc.status];
                return (
                  <div key={doc.id} className={styles.queueRow}>
                    <div className={styles.queueInfo}>
                      <span className={styles.queueId}>{doc.id}</span>
                      <span className={styles.queueName}>{doc.name}</span>
                      <span className={styles.queueType}>{doc.type}</span>
                    </div>
                    <Badge label={s.label} bg={s.bg} color={s.color} />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Pipeline stages" subtitle="All tenants · last hour">
            {pipelineStages.map(stage => (
              <div key={stage.name} className={styles.stageRow}>
                <div className={styles.stageMeta}>
                  <div className={styles.stageDot} style={{ background: stage.color }} />
                  <span className={styles.stageName}>{stage.name}</span>
                  <span className={styles.stageCount}>{stage.count}</span>
                </div>
                <div className={styles.progressBg}>
                  <div className={styles.progressFill} style={{ width: `${stage.pct}%`, background: stage.color }} />
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className={styles.row}>
          <Card title="Document throughput" subtitle="Hourly volume today">
            <ThroughputChart />
          </Card>

          <Card title="Recent alerts" subtitle="Last 4 hours">
            {alerts.map(alert => (
              <div key={alert.id} className={styles.alertRow}>
                <AlertIcon type={alert.type} />
                <div className={styles.alertBody}>
                  <div className={styles.alertTitle}>{alert.title}</div>
                  <div className={styles.alertDetail}>{alert.detail}</div>
                </div>
                <div className={styles.alertTime}>{alert.time}</div>
              </div>
            ))}
          </Card>
        </div>

        <Card title="Tenants by volume" subtitle="Today · all facilities">
          <div className={styles.tenantGrid}>
            {tenants.map(t => (
              <div key={t.id} className={styles.tenantCard}>
                <div className={styles.tenantTop}>
                  <div className={styles.tenantAvatar} style={{ background: t.bg, color: t.color }}>{t.initials}</div>
                  <div>
                    <div className={styles.tenantName}>{t.name}</div>
                    <div className={styles.tenantDocs}>{t.docs} docs today</div>
                  </div>
                  <Badge
                    label={t.sla === 'ok' ? 'SLA ok' : 'At risk'}
                    bg={t.sla === 'ok' ? '#eaf3de' : '#faeeda'}
                    color={t.sla === 'ok' ? '#3b6d11' : '#854f0b'}
                    style={{ marginLeft: 'auto' }}
                  />
                </div>
                <div className={styles.tenantStats}>
                  <div><span className={styles.statLabel}>Avg time</span><span className={styles.statVal}>{t.avgTime}</span></div>
                  <div><span className={styles.statLabel}>Failures</span><span className={styles.statVal} style={{ color: t.failures > 0 ? '#a32d2d' : undefined }}>{t.failures}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
