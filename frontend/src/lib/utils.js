export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(n) {
  if (n == null) return "—";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function gradeColor(grade) {
  const map = { "A+": "#34d399", A: "#34d399", B: "#fbbf24", C: "#fb923c", D: "#f87171", F: "#f87171" };
  return map[grade] || "#8892a8";
}

export function scoreColor(score) {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#fbbf24";
  if (score >= 40) return "#fb923c";
  return "#f87171";
}

export const PACKAGE_COLORS = [
  "#4f9cf9", "#34d399", "#fb923c", "#a78bfa", "#fbbf24",
];

export function packageColor(idx) {
  return PACKAGE_COLORS[idx % PACKAGE_COLORS.length];
}
