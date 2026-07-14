export function clsx(...args) {
  return args.filter(Boolean).join(' ');
}

export function formatNumber(n) {
  return new Intl.NumberFormat().format(n);
}

export const statusConfig = {
  received:   { label: 'Received',   bg: '#f1f3f7', color: '#4b5669' },
  ocr:        { label: 'OCR',        bg: '#eeedfe', color: '#534ab7' },
  extracting: { label: 'Extracting', bg: '#e6f1fb', color: '#185fa5' },
  extracted:  { label: 'Extracted',  bg: '#e6f1fb', color: '#185fa5' },
  validated:  { label: 'Validated',  bg: '#faeeda', color: '#854f0b' },
  loaded:     { label: 'Loaded',     bg: '#eaf3de', color: '#3b6d11' },
  failed:     { label: 'Failed',     bg: '#fcebeb', color: '#a32d2d' },
  queued:     { label: 'Queued',     bg: '#f1f3f7', color: '#4b5669' },
  processing: { label: 'Processing', bg: '#faeeda', color: '#854f0b' },
};

export const patientStatusConfig = {
  normal:   { label: 'Normal',   bg: '#eaf3de', color: '#3b6d11' },
  abnormal: { label: 'Abnormal', bg: '#fcebeb', color: '#a32d2d' },
  review:   { label: 'Review',   bg: '#faeeda', color: '#854f0b' },
};

export const flagConfig = {
  critical:   { label: 'Critical',   bg: '#fcebeb', color: '#a32d2d' },
  high:       { label: 'High',       bg: '#faeeda', color: '#854f0b' },
  low:        { label: 'Low',        bg: '#faeeda', color: '#854f0b' },
  borderline: { label: 'Borderline', bg: '#faeeda', color: '#854f0b' },
  normal:     { label: 'Normal',     bg: '#eaf3de', color: '#3b6d11' },
};
