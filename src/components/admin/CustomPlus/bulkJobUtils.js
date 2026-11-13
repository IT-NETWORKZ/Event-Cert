// Small helpers shared by CustomPastRecords and CustomStatus

// API dates are UTC; add "Z" when the server leaves it out so the browser shows local time
export const parseUtc = (v) => {
  if (!v) return null;
  const s = String(v);
  const d = new Date(/[zZ]$|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDateTime = (v) => {
  const d = parseUtc(v);
  return d ? d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "-";
};

// sent | failed | warn | processing | scheduled | pending
export const statusKind = (status) => {
  const s = String(status || "").toLowerCase();
  if (/^fail|cancel/.test(s)) return "failed";
  if (/error|partial/.test(s)) return "warn";
  if (/sent|success|complete|deliver|done/.test(s)) return "sent";
  if (/process|running|progress/.test(s)) return "processing";
  if (/schedul/.test(s)) return "scheduled";
  return "pending";
};

// a job that is still going to change (keep refreshing it)
export const isJobActive = (status) => ["pending", "processing", "scheduled"].includes(statusKind(status));

export const percentDone = (job) =>
  job.total > 0 ? Math.min(100, Math.round(((job.sent + job.failed) / job.total) * 100)) : 0;
