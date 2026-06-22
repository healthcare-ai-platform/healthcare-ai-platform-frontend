import { useState, useEffect, useCallback, useRef } from 'react';
import Topbar from '../components/layout/Topbar';
import { uploadPdf, listDocuments } from '../api/documents';
import styles from './Documents.module.css';

const REPORT_TYPES = [
  { value: 'lab_report',        label: 'Lab Report' },
  { value: 'radiology',         label: 'Radiology' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
  { value: 'prescription',      label: 'Prescription' },
  { value: 'clinical_note',     label: 'Clinical Note' },
  { value: 'pathology',         label: 'Pathology' },
];

const STATUS_FILTERS = ['all', 'received', 'ocr', 'extracting', 'loaded', 'failed'];

const STATUS_CONFIG = {
  received:   { label: 'Received',   bg: 'var(--color-blue-50)',   color: 'var(--color-blue-500)' },
  ocr:        { label: 'OCR',        bg: '#faeeda',                color: '#854f0b' },
  extracting: { label: 'Extracting', bg: '#faeeda',                color: '#854f0b' },
  loaded:     { label: 'Loaded',     bg: 'var(--color-green-50)',  color: 'var(--color-green-500)' },
  failed:     { label: 'Failed',     bg: 'var(--color-red-50)',    color: 'var(--color-red-500)' },
};

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Documents() {
  const inputRef    = useRef(null);
  const [dragging, setDragging]     = useState(false);
  const [file, setFile]             = useState(null);
  const [reportType, setReportType] = useState('lab_report');
  const [uploading, setUploading]   = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError]   = useState('');

  const [docs, setDocs]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingDocs, setLoadingDocs]   = useState(true);
  const [docsError, setDocsError]       = useState('');

  const PAGE_SIZE = 15;

  const loadDocs = useCallback(async () => {
    setLoadingDocs(true);
    setDocsError('');
    try {
      const data = await listDocuments({ page, pageSize: PAGE_SIZE, status: statusFilter });
      setDocs(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      setDocsError(e.message);
    } finally {
      setLoadingDocs(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  function pickFile(f) {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setUploadError('Only PDF files are accepted.');
      return;
    }
    setFile(f);
    setUploadError('');
    setUploadResult(null);
  }

  function onDragOver(e) { e.preventDefault(); setDragging(true); }
  function onDragLeave()  { setDragging(false); }
  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  }
  function onInputChange(e) { pickFile(e.target.files[0]); }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const result = await uploadPdf(file, reportType);
      setUploadResult(result);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      await loadDocs();
    } catch (e) {
      setUploadError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function clearUpload() {
    setFile(null);
    setUploadResult(null);
    setUploadError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className={styles.page}>
      <Topbar title="Documents" subtitle="Upload and track medical documents" />
      <div className={styles.content}>

        {/* ── Upload card ── */}
        <div className={styles.uploadCard}>
          <div className={styles.uploadCardHeader}>
            <div className={styles.uploadCardTitle}>Upload PDF</div>
            <div className={styles.uploadCardSub}>PDF files only · processed asynchronously</div>
          </div>

          <div className={styles.uploadBody}>
            {uploadResult ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}><CheckIcon /></div>
                <div>
                  <div className={styles.successTitle}>Upload queued</div>
                  <div className={styles.successSub}>
                    Document ID: <span className={styles.mono}>{uploadResult.upload_id}</span>
                  </div>
                </div>
                <button className={styles.btnSecondary} onClick={clearUpload}>
                  Upload another
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ''} ${file ? styles.dropZoneHasFile : ''}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => !file && inputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && !file && inputRef.current?.click()}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    className={styles.fileInput}
                    onChange={onInputChange}
                  />
                  {file ? (
                    <div className={styles.filePreview}>
                      <div className={styles.filePill}>
                        <span className={styles.filePillIcon}>PDF</span>
                        <span className={styles.filePillName}>{file.name}</span>
                        <span className={styles.filePillSize}>
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                        <button
                          className={styles.filePillRemove}
                          onClick={e => { e.stopPropagation(); clearUpload(); }}
                          title="Remove"
                        >✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.dropZoneContent}>
                      <div className={styles.dropIcon}><UploadIcon /></div>
                      <div className={styles.dropTitle}>Drag & drop or click to select</div>
                      <div className={styles.dropSub}>PDF files only</div>
                    </div>
                  )}
                </div>

                <div className={styles.uploadControls}>
                  <label className={styles.controlLabel}>
                    Report type
                    <select
                      className={styles.select}
                      value={reportType}
                      onChange={e => setReportType(e.target.value)}
                    >
                      {REPORT_TYPES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    className={styles.btnPrimary}
                    onClick={handleUpload}
                    disabled={!file || uploading}
                  >
                    {uploading ? 'Uploading…' : 'Upload'}
                  </button>
                </div>

                {uploadError && (
                  <div className={styles.uploadError}>{uploadError}</div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Document list ── */}
        <div className={styles.listSection}>
          <div className={styles.listHeader}>
            <div>
              <div className={styles.listTitle}>All documents</div>
              <div className={styles.listSub}>{total} total</div>
            </div>
            <div className={styles.filterRow}>
              {STATUS_FILTERS.map(s => (
                <button
                  key={s}
                  className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ''}`}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                >
                  {s === 'all' ? 'All' : (STATUS_CONFIG[s]?.label || s)}
                </button>
              ))}
            </div>
          </div>

          {docsError && <div className={styles.docsError}>{docsError}</div>}

          <div className={styles.tableCard}>
            {loadingDocs ? (
              <div className={styles.tableEmpty}>Loading…</div>
            ) : docs.length === 0 ? (
              <div className={styles.tableEmpty}>
                No documents found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}
              </div>
            ) : (
              <>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Document ID</th>
                      <th>Report type</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Tenant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map(doc => {
                      const sc = STATUS_CONFIG[doc.status] || { label: doc.status, bg: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' };
                      return (
                        <tr key={doc.id} className={styles.tableRow}>
                          <td>
                            <span className={styles.docId}>{doc.id.slice(0, 8)}…</span>
                          </td>
                          <td className={styles.reportType}>{doc.name}</td>
                          <td>
                            <span className={styles.sourceTag}>{doc.type}</span>
                          </td>
                          <td>
                            <span
                              className={styles.statusBadge}
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              {sc.label}
                            </span>
                          </td>
                          <td className={styles.tenant}>{doc.tenant}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.pageBtn}
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      ← Prev
                    </button>
                    <span className={styles.pageInfo}>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      className={styles.pageBtn}
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
