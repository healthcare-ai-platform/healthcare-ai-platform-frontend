export const kpiData = {
  documentsToday: 1284,
  documentsDelta: '+12%',
  avgTurnaround: '4.2 min',
  turnaroundDelta: '-0.8 min',
  extractionSuccess: '97.3%',
  successDelta: '-0.4% vs target',
  dlqBacklog: 18,
  dlqDelta: '+6 since 9am',
};

export const pipelineQueue = [
  { id: 'PT-2041', name: 'CBC Report', type: 'Lab', status: 'loaded', tenant: 'City General' },
  { id: 'PT-1892', name: 'Discharge Summary', type: 'Clinical', status: 'extracting', tenant: 'Apollo Diagnostics' },
  { id: 'PT-2209', name: 'Prescription', type: 'Rx', status: 'ocr', tenant: 'Sunrise Clinic' },
  { id: 'PT-1773', name: 'Referral Note', type: 'Clinical', status: 'failed', tenant: 'Metro Health' },
  { id: 'PT-2310', name: 'Lipid Panel', type: 'Lab', status: 'queued', tenant: 'City General' },
  { id: 'PT-2311', name: 'MRI Report', type: 'Imaging', status: 'queued', tenant: 'Riverside Care' },
  { id: 'PT-2312', name: 'HbA1c Result', type: 'Lab', status: 'loaded', tenant: 'Apollo Diagnostics' },
  { id: 'PT-2313', name: 'ECG Report', type: 'Cardiology', status: 'extracting', tenant: 'City General' },
  { id: 'PT-2314', name: 'Thyroid Panel', type: 'Lab', status: 'failed', tenant: 'Metro Health' },
  { id: 'PT-2315', name: 'Chest X-Ray Note', type: 'Imaging', status: 'queued', tenant: 'Sunrise Clinic' },
];

export const pipelineStages = [
  { name: 'Received', count: 312, color: '#185fa5', pct: 100 },
  { name: 'OCR complete', count: 289, color: '#0f6e56', pct: 93 },
  { name: 'LLM extracted', count: 271, color: '#534ab7', pct: 87 },
  { name: 'Validated', count: 264, color: '#3b6d11', pct: 85 },
  { name: 'Loaded to Redshift', count: 258, color: '#185fa5', pct: 83 },
  { name: 'Failed / DLQ', count: 18, color: '#a32d2d', pct: 6 },
];

export const alerts = [
  { id: 1, type: 'error', title: 'DLQ spike — City General Hospital', detail: '6 documents failed LLM extraction', time: '11:42 AM' },
  { id: 2, type: 'warning', title: 'SLA breach risk — Apollo Diagnostics', detail: 'Turnaround at 7.1 min, threshold 8 min', time: '10:58 AM' },
  { id: 3, type: 'success', title: 'Backlog cleared — Sunrise Clinic', detail: 'Queue returned to 0 after retry run', time: '09:31 AM' },
  { id: 4, type: 'warning', title: 'Schema validation errors — Lab batch', detail: 'Missing units field in 12 CBC reports', time: '08:14 AM' },
  { id: 5, type: 'error', title: 'OCR timeout — Metro Health Labs', detail: '3 high-res scans exceeded 60s limit', time: '07:50 AM' },
];

export const tenants = [
  { id: 't1', initials: 'CG', name: 'City General Hospital', docs: 412, sla: 'ok', color: '#185fa5', bg: '#e6f1fb', failures: 6, avgTime: '3.8 min' },
  { id: 't2', initials: 'AD', name: 'Apollo Diagnostics', docs: 298, sla: 'risk', color: '#854f0b', bg: '#faeeda', failures: 1, avgTime: '7.1 min' },
  { id: 't3', initials: 'SC', name: 'Sunrise Clinic', docs: 241, sla: 'ok', color: '#534ab7', bg: '#eeedfe', failures: 0, avgTime: '3.2 min' },
  { id: 't4', initials: 'MH', name: 'Metro Health Labs', docs: 187, sla: 'ok', color: '#993556', bg: '#fbeaf0', failures: 4, avgTime: '4.5 min' },
  { id: 't5', initials: 'RC', name: 'Riverside Care', docs: 146, sla: 'ok', color: '#854f0b', bg: '#faeeda', failures: 0, avgTime: '4.1 min' },
];

export const throughputData = [
  { hour: '12am', docs: 12 },
  { hour: '2am', docs: 8 },
  { hour: '4am', docs: 5 },
  { hour: '6am', docs: 42 },
  { hour: '8am', docs: 198 },
  { hour: '10am', docs: 287 },
  { hour: '12pm', docs: 312 },
  { hour: '2pm', docs: 198 },
  { hour: '4pm', docs: 145 },
  { hour: '6pm', docs: 77 },
];

export const patients = [
  { id: 'PT-2041', name: 'Ravi Sharma', age: 54, doctor: 'Dr. Mehta', hospital: 'City General', lastReport: 'CBC Report', date: 'Jun 20', status: 'normal', reports: 8 },
  { id: 'PT-1892', name: 'Sunita Verma', age: 38, doctor: 'Dr. Patel', hospital: 'Apollo Diagnostics', lastReport: 'Discharge Summary', date: 'Jun 20', status: 'review', reports: 12 },
  { id: 'PT-2209', name: 'Arjun Nair', age: 62, doctor: 'Dr. Singh', hospital: 'Sunrise Clinic', lastReport: 'Prescription', date: 'Jun 19', status: 'normal', reports: 4 },
  { id: 'PT-1773', name: 'Priya Iyer', age: 45, doctor: 'Dr. Kumar', hospital: 'Metro Health', lastReport: 'Referral Note', date: 'Jun 19', status: 'abnormal', reports: 6 },
  { id: 'PT-2310', name: 'Deepak Joshi', age: 71, doctor: 'Dr. Mehta', hospital: 'City General', lastReport: 'Lipid Panel', date: 'Jun 18', status: 'abnormal', reports: 15 },
  { id: 'PT-2311', name: 'Kavya Reddy', age: 29, doctor: 'Dr. Rao', hospital: 'Riverside Care', lastReport: 'MRI Report', date: 'Jun 18', status: 'normal', reports: 2 },
  { id: 'PT-2312', name: 'Manish Gupta', age: 48, doctor: 'Dr. Patel', hospital: 'Apollo Diagnostics', lastReport: 'HbA1c Result', date: 'Jun 17', status: 'review', reports: 9 },
  { id: 'PT-2313', name: 'Anita Desai', age: 66, doctor: 'Dr. Singh', hospital: 'City General', lastReport: 'ECG Report', date: 'Jun 17', status: 'abnormal', reports: 11 },
];

export const auditLogs = [
  { id: 1, user: 'Dr. Mehta', action: 'Viewed patient report', resource: 'PT-2041 CBC', ip: '10.0.1.42', time: '11:58 AM', tenant: 'City General' },
  { id: 2, user: 'admin@healthai', action: 'Exported dataset', resource: 'June analytics', ip: '10.0.0.1', time: '11:30 AM', tenant: 'System' },
  { id: 3, user: 'analyst@apollo', action: 'Filtered patient cohort', resource: 'HbA1c > 7.5', ip: '10.0.2.11', time: '11:12 AM', tenant: 'Apollo Diagnostics' },
  { id: 4, user: 'Dr. Singh', action: 'Viewed patient report', resource: 'PT-2313 ECG', ip: '10.0.3.88', time: '10:45 AM', tenant: 'City General' },
  { id: 5, user: 'ops@sunrise', action: 'Triggered manual retry', resource: 'DLQ batch #44', ip: '10.0.4.22', time: '09:32 AM', tenant: 'Sunrise Clinic' },
  { id: 6, user: 'admin@healthai', action: 'Created new user', resource: 'dr.rao@riverside', ip: '10.0.0.1', time: '09:10 AM', tenant: 'System' },
];
