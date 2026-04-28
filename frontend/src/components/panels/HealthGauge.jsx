import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { PanelWrapper, LoadingPanel } from "../shared/index.jsx";
import { gradeColor, scoreColor, packageColor } from "../../lib/utils.js";

function SingleGauge({ name, health }) {
  const color = scoreColor(health?.total || 0);
  const gaugeData = [{ value: health?.total || 0, fill: color }];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 160, height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="90%"
            innerRadius="70%" outerRadius="100%"
            startAngle={180} endAngle={0}
            data={[{ value: 100, fill: "var(--bg-hover)" }, ...gaugeData]}
          >
            <RadialBar dataKey="value" cornerRadius={6} background={false} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {health?.total ?? "—"}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: gradeColor(health?.grade), marginTop: 2 }}>
            {health?.grade ?? ""}
          </div>
        </div>
      </div>

      {health?.breakdown && (
        <div style={{ width: "100%", marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(health.breakdown).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)", width: 90, textTransform: "capitalize", flexShrink: 0 }}>{key}</span>
              <div style={{ flex: 1, height: 4, background: "var(--bg-hover)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(val / 30) * 100}%`, background: color, borderRadius: 2, transition: "width 0.8s ease" }} />
              </div>
              <span style={{ fontSize: 11, color, fontWeight: 700, width: 24, textAlign: "right" }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HealthGauge({ packageData, packageNames, loading }) {
  if (loading) return <PanelWrapper title="Health Score"><LoadingPanel lines={4} /></PanelWrapper>;

  const items = packageNames.map((name, i) => ({ name, health: packageData[name]?.health, color: packageColor(i) }));

  return (
    <PanelWrapper title="Health Score">
      {items.length === 1 ? (
        <SingleGauge name={items[0].name} health={items[0].health} />
      ) : (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {items.map(({ name, health, color }) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 120 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color }}>{name}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: scoreColor(health?.total || 0) }}>{health?.total ?? "—"}</div>
              <span className={`badge badge-${health?.total >= 70 ? "green" : health?.total >= 50 ? "orange" : "red"}`}>{health?.grade || "?"}</span>
            </div>
          ))}
        </div>
      )}
    </PanelWrapper>
  );
}
