import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PanelWrapper, LoadingPanel } from "../shared/index.jsx";
import { formatNumber, packageColor } from "../../lib/utils.js";

const PERIODS = [
  { label: "1M", value: "last-month" },
  { label: "3M", value: "last-3-months" },
  { label: "6M", value: "last-6-months" },
  { label: "1Y", value: "last-year" },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-bright)", borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ fontSize: 13, fontWeight: 600, color: p.color }}>
          {p.name}: {formatNumber(p.value)}
        </div>
      ))}
    </div>
  );
}

export function DownloadChart({ historyData, packageNames, onPeriodChange, loading }) {
  const [period, setPeriod] = useState("last-month");

  function handlePeriod(p) {
    setPeriod(p);
    onPeriodChange?.(p);
  }

    const merged = React.useMemo(() => {
    if (!historyData?.length) return [];
    // Find first package that has actual data
    const baseData = historyData.find(h => h?.downloads?.length > 0);
    if (!baseData) return [];
    return baseData.downloads.map((d, i) => {
      const obj = { date: d.day };
      historyData.forEach((pkg, idx) => {
        const name = pkg.package || packageNames[idx] || `pkg${idx}`;
        obj[name] = pkg.downloads?.[i]?.downloads ?? 0;
      });
      return obj;
    });
  }, [historyData, packageNames]);

  const periodActions = (
    <div style={{ display: "flex", gap: 4 }}>
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => handlePeriod(p.value)}
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid",
            borderColor: period === p.value ? "var(--accent)" : "var(--border-bright)",
            background: period === p.value ? "var(--accent-dim)" : "transparent",
            color: period === p.value ? "var(--accent)" : "var(--text-muted)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >{p.label}</button>
      ))}
    </div>
  );

  return (
    <PanelWrapper title="Download Trends" actions={periodActions}>
      {loading ? (
        <div style={{ height: 220 }}><LoadingPanel lines={4} /></div>
      ) : merged.length === 0 ? (
        <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={merged} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              {packageNames.map((name, i) => (
                <linearGradient key={name} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={packageColor(i)} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={packageColor(i)} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tickFormatter={formatNumber} tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={<CustomTooltip />} />
            {packageNames.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />}
            {packageNames.map((name, i) => (
              <Area
                key={name}
                type="monotone"
                dataKey={name}
                stroke={packageColor(i)}
                strokeWidth={2}
                fill={`url(#grad-${i})`}
                dot={false}
                activeDot={{ r: 4, fill: packageColor(i) }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </PanelWrapper>
  );
}

