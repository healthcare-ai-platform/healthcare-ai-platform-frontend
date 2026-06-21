import Topbar from '../components/layout/Topbar';
import MetricCard from '../components/ui/MetricCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ThroughputChart from '../components/charts/ThroughputChart';
import { statusConfig } from '../utils/helpers';
import { useFetch } from '../hooks/useApi';
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

function Skeleton({ height = 16, width = '100%', style = {} }) {
  return (
    <div style={{
      height, width, borderRadius: 6,
      background: 'var(--color-bg-tertiary)',
      animation: 'pulse 1.5s ease-in-out infinite',
      ...style,
    }} />
  );
}

export default function Dashboard() {
  const { data: kpis,     loading: kpisLoading }   = useFetch('/api/v1/dashboard/kpis');
  const { data: stages,   loading: stagesLoading } = useFetch('/api/v1/dashboard/pipeline-stages');
  const { data: alertsData, loading: alertsLoading } = useFetch('/api/v1/dashboard/alerts');
  const { data: throughput, loading: tpLoading }   = useFetch('/api/v1/dashboard/throughput');
  const { data: tenantsPage, loading: tenantsLoading } = useFetch('/api/v1/tenants/?page_size=10');
  const { data: queuePage,   loading: queueLoading }   = useFetch('/api/v1/queue/?page_size=7');

  const tenants = tenantsPage?.items ?? [];
  const queue   = queuePage?.items ?? [];

  return (
    <div className={styles.page}>
      <Topbar title="Operations overview" subtitle="Today · live data" />

      <div className={styles.content}>
        <div className={styles.metrics}>
          {kpisLoading ? (
            [1,2,3,4].map(i => <Skeleton key={i} height={80} style={{ borderRadius: 12 }} />)
          ) : kpis ? (
            <>
              <MetricCard label="Documents today"    value={kpis.documentsToday.toLocaleString()} delta={`↑ ${kpis.documentsDelta} vs yesterday`}  deltaType="positive" />
              <MetricCard label="Avg turnaround"     value={kpis.avgTurnaround}                   delta={`↓ ${kpis.turnaroundDelta} faster`}         deltaType="positive" />
              <MetricCard label="Extraction success" value={kpis.extractionSuccess}               delta={`${kpis.successDelta}`}                      deltaType="warning" />
              <MetricCard label="DLQ backlog"        value={kpis.dlqBacklog.toString()}           delta={`↑ ${kpis.dlqDelta}`}                        deltaType="negative" />
            </>
          ) : null}
        </div>

        <div className={styles.row}>
          <Card title="Processing queue" subtitle="Live · refreshes every 5s">
            <div>
              {queueLoading ? (
                [1,2,3,4,5].map(i => <Skeleton key={i} height={36} style={{ marginBottom: 8 }} />)
              ) : queue.map(doc => {
                const s = statusConfig[doc.status] ?? { label: doc.status, bg: '#f1f3f7', color: '#4b5669' };
                return (
                  <div key={doc.id} className={styles.queueRow}>
                    <div className={styles.queueInfo}>
                      <span className={styles.queueId}>{doc.id.slice(0, 8)}</span>
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
            {stagesLoading ? (
              [1,2,3,4,5,6].map(i => <Skeleton key={i} height={32} style={{ marginBottom: 8 }} />)
            ) : (stages ?? []).map(stage => (
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
            {tpLoading
              ? <Skeleton height={180} />
              : <ThroughputChart data={throughput ?? []} />
            }
          </Card>

          <Card title="Recent alerts" subtitle="Last 4 hours">
            {alertsLoading ? (
              [1,2,3,4,5].map(i => <Skeleton key={i} height={52} style={{ marginBottom: 8 }} />)
            ) : (alertsData ?? []).map(alert => (
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
            {tenantsLoading ? (
              [1,2,3,4,5].map(i => <Skeleton key={i} height={96} style={{ borderRadius: 10 }} />)
            ) : tenants.map(t => (
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
