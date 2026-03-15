import { useState } from "react";
import { ModuleLayout, StatCard, Tabs } from "../components/ui";
import { PrintButton, exportToCSV } from "../utils/printExport";

export const COLOR = "#6366f1";

// ── SVG Pie Chart ─────────────────────────────────────────────
function PieChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const cx = size / 2,
    cy = size / 2,
    r = size / 2 - 20;

  const slices = data.map((d) => {
    const start = cumulative;
    const angle = (d.value / total) * 360;
    cumulative += angle;
    const startRad = (start - 90) * (Math.PI / 180);
    const endRad = (start + angle - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startRad),
      y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad),
      y2 = cy + r * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;
    return {
      ...d,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,
      pct: ((d.value / total) * 100).toFixed(1),
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width={size} height={size}>
          {slices.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              stroke="var(--bg-card)"
              strokeWidth="2"
              className="transition-all hover:opacity-80"
            />
          ))}
          {/* Center label */}
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="18"
            fontWeight="700"
          >
            {total.toLocaleString()}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="11"
          >
            Total
          </text>
        </svg>
      </div>
      <div className="space-y-2 flex-1">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-xs" style={{ color: "var(--text-sub)" }}>
                {s.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {s.value.toLocaleString()}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: `${s.color}22`, color: s.color }}
              >
                {s.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Donut Chart ───────────────────────────────────────────────
function DonutChart({ data, size = 160, label, value }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const cx = size / 2,
    cy = size / 2;
  const outerR = size / 2 - 10,
    innerR = size / 2 - 32;

  const slices = data.map((d) => {
    const start = cumulative;
    const angle = (d.value / total) * 360;
    cumulative += angle;
    const toR = (deg) => (deg - 90) * (Math.PI / 180);
    const x1o = cx + outerR * Math.cos(toR(start)),
      y1o = cy + outerR * Math.sin(toR(start));
    const x2o = cx + outerR * Math.cos(toR(start + angle)),
      y2o = cy + outerR * Math.sin(toR(start + angle));
    const x1i = cx + innerR * Math.cos(toR(start + angle)),
      y1i = cy + innerR * Math.sin(toR(start + angle));
    const x2i = cx + innerR * Math.cos(toR(start)),
      y2i = cy + innerR * Math.sin(toR(start));
    const lg = angle > 180 ? 1 : 0;
    return {
      ...d,
      path: `M ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${lg} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${innerR} ${innerR} 0 ${lg} 0 ${x2i} ${y2i} Z`,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size}>
          {slices.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              stroke="var(--bg-card)"
              strokeWidth="2"
            />
          ))}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="16"
            fontWeight="700"
          >
            {value}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="10"
          >
            {label}
          </text>
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {data.map((d, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: d.color }}
            />
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────
function BarChart({ data, height = 140, showValues = true }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          {showValues && (
            <span
              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: d.color || COLOR }}
            >
              {d.value.toLocaleString()}
            </span>
          )}
          <div
            className="w-full rounded-t transition-all hover:opacity-80"
            style={{
              height: `${(d.value / max) * (height - 30)}px`,
              background: d.gradient || d.color || COLOR,
              minHeight: "4px",
            }}
          />
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "11px",
              whiteSpace: "nowrap",
            }}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Line Chart ────────────────────────────────────────────────
function LineChart({ series, labels, height = 120 }) {
  const allVals = series.flatMap((s) => s.data);
  const max = Math.max(...allVals),
    min = Math.min(...allVals),
    range = max - min || 1;
  const w = 100,
    h = height;
  const pts = (data) =>
    data
      .map(
        (v, i) =>
          `${(i / (data.length - 1)) * w},${h - 20 - ((v - min) / range) * (h - 30)}`,
      )
      .join(" ");

  return (
    <div>
      <svg
        width="100%"
        viewBox={`0 0 100 ${h}`}
        preserveAspectRatio="none"
        style={{ height }}
      >
        {series.map((s, si) => (
          <g key={si}>
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pts(s.data)}
            />
            {s.data.map((v, i) => (
              <circle
                key={i}
                cx={(i / (s.data.length - 1)) * 100}
                cy={h - 20 - ((v - min) / range) * (h - 30)}
                r="0.8"
                fill={s.color}
              />
            ))}
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {labels.map((l, i) => (
          <span
            key={i}
            className="text-xs"
            style={{ color: "var(--text-muted)", fontSize: "10px" }}
          >
            {l}
          </span>
        ))}
      </div>
      <div className="flex gap-4 mt-2 flex-wrap">
        {series.map((s, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--text-sub)" }}
          >
            <span
              className="w-4 h-0.5 inline-block rounded"
              style={{ background: s.color }}
            />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Comparison Table ──────────────────────────────────────────
function ComparisonTable({ title, rows, headers }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      <div
        className="px-4 py-3"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h4
          className="font-semibold text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--input-bg)" }}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left text-xs uppercase tracking-wider font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-t transition-colors"
                style={{ borderColor: "var(--border)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--row-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="px-4 py-2.5 text-xs"
                    style={{
                      color:
                        j === 0 ? "var(--text-primary)" : "var(--text-sub)",
                    }}
                  >
                    {typeof cell === "object" ? cell : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── MAIN ANALYTICS DASHBOARD ──────────────────────────────────
export default function AnalyticsDashboard() {
  const [tab, setTab] = useState("overview");
  const [period, setPeriod] = useState("monthly");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const revenueData = {
    monthly: [85, 92, 88, 102, 115, 108, 124],
    quarterly: [265, 305, 232],
  };

  const expenseData = {
    monthly: [52, 58, 55, 62, 71, 68, 81],
    quarterly: [165, 196, 149],
  };

  const labels = period === "monthly" ? months : ["Q1", "Q2", "Q3"];
  const revArr =
    period === "monthly" ? revenueData.monthly : revenueData.quarterly;
  const expArr =
    period === "monthly" ? expenseData.monthly : expenseData.quarterly;

  // ── PIE DATA ──
  const revenueSources = [
    { label: "Sales", value: 416000, color: "#ef4444" },
    { label: "Hotel", value: 280000, color: "#6366f1" },
    { label: "Hospital", value: 195000, color: "#ec4899" },
    { label: "School", value: 148000, color: "#f59e0b" },
    { label: "Others", value: 201000, color: "#64748b" },
  ];

  const expenseBreakdown = [
    { label: "Salaries", value: 280000, color: "#8b5cf6" },
    { label: "Rent", value: 45000, color: "#06b6d4" },
    { label: "Utilities", value: 22000, color: "#f97316" },
    { label: "Purchase", value: 185000, color: "#3b82f6" },
    { label: "Others", value: 78000, color: "#64748b" },
  ];

  const deptPerformance = [
    {
      label: "Sales",
      value: 416,
      color: "#ef4444",
      gradient: "linear-gradient(to top,#ef4444,#f87171)",
    },
    {
      label: "IT",
      value: 310,
      color: "#3b82f6",
      gradient: "linear-gradient(to top,#3b82f6,#60a5fa)",
    },
    {
      label: "HR",
      value: 180,
      color: "#8b5cf6",
      gradient: "linear-gradient(to top,#8b5cf6,#a78bfa)",
    },
    {
      label: "Admin",
      value: 95,
      color: "#f59e0b",
      gradient: "linear-gradient(to top,#f59e0b,#fcd34d)",
    },
    {
      label: "Accounts",
      value: 210,
      color: "#10b981",
      gradient: "linear-gradient(to top,#10b981,#34d399)",
    },
  ];

  const moduleUsage = [
    { label: "Sales", value: 89, color: "#ef4444" },
    { label: "Hotel", value: 76, color: "#6366f1" },
    { label: "HR", value: 72, color: "#8b5cf6" },
    { label: "Payroll", value: 68, color: "#f97316" },
    { label: "Inv.", value: 61, color: "#3b82f6" },
    { label: "Reports", value: 55, color: "#a855f7" },
    { label: "Stock", value: 48, color: "#84cc16" },
  ];

  const kpis = [
    {
      icon: "💹",
      label: "Total Revenue",
      value: "৳12.4M",
      change: "+18.5%",
      up: true,
      color: "#6366f1",
    },
    {
      icon: "📤",
      label: "Total Expenses",
      value: "৳8.1M",
      change: "+6.2%",
      up: false,
      color: "#ef4444",
    },
    {
      icon: "💎",
      label: "Net Profit",
      value: "৳4.3M",
      change: "+34.1%",
      up: true,
      color: "#10b981",
    },
    {
      icon: "📊",
      label: "Profit Margin",
      value: "34.7%",
      change: "+4.2%",
      up: true,
      color: "#f59e0b",
    },
    {
      icon: "🛒",
      label: "Total Orders",
      value: "1,247",
      change: "+22%",
      up: true,
      color: "#ec4899",
    },
    {
      icon: "👥",
      label: "Avg. Order Value",
      value: "৳9,942",
      change: "+8%",
      up: true,
      color: "#06b6d4",
    },
  ];

  const comparisonRows = months.map((m, i) => [
    m,
    `৳${revArr[i]}L`,
    `৳${expArr[i]}L`,
    `৳${revArr[i] - expArr[i]}L`,
    <span
      key={i}
      className="text-xs px-2 py-0.5 rounded-full"
      style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}
    >
      {(((revArr[i] - expArr[i]) / revArr[i]) * 100).toFixed(1)}%
    </span>,
    <span
      key={i}
      className={`text-xs font-medium`}
      style={{
        color:
          revArr[i] > (i > 0 ? revArr[i - 1] : revArr[i])
            ? "#10b981"
            : "#ef4444",
      }}
    >
      {i > 0
        ? revArr[i] > revArr[i - 1]
          ? `↑ +${revArr[i] - revArr[i - 1]}L`
          : `↓ -${revArr[i - 1] - revArr[i]}L`
        : "—"}
    </span>,
  ]);

  const topModules = [
    ["Hotel Management", "৳2.80M", "✅ Active", "128 rooms", "+12%"],
    ["Sales Management", "৳4.16M", "✅ Active", "1,247 orders", "+22%"],
    ["Hospital Management", "৳1.95M", "✅ Active", "47 patients", "+8%"],
    ["School Management", "৳1.48M", "✅ Active", "1,240 students", "+3%"],
    ["Payroll / HR", "৳8.70M", "✅ Active", "284 employees", "+5%"],
  ];

  const csvData = months.map((m, i) => ({
    Month: m,
    Revenue: `${revArr[i]}L`,
    Expense: `${expArr[i]}L`,
    Profit: `${revArr[i] - expArr[i]}L`,
  }));

  return (
    <ModuleLayout
      title="Analytics Dashboard"
      icon="📊"
      color={COLOR}
      actions={
        <div className="flex items-center gap-2">
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
            }}
          >
            {["monthly", "quarterly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background:
                    period === p ? "rgba(99,102,241,0.3)" : "transparent",
                  color: period === p ? "#a5b4fc" : "var(--text-muted)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <PrintButton
            onPrint={() => window.print()}
            onExportCSV={() => exportToCSV(csvData, "analytics_report")}
          />
        </div>
      }
    >
      <Tabs
        tabs={[
          { id: "overview", label: "📊 Overview" },
          { id: "revenue", label: "💹 Revenue" },
          { id: "modules", label: "◈ Modules" },
          { id: "comparison", label: "⚖️ Comparison" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="space-y-5">
          {/* KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {kpis.map((k, i) => (
              <div
                key={i}
                className="rounded-xl p-3"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="text-xl mb-2">{k.icon}</div>
                <p
                  className="font-bold text-base"
                  style={{ color: "var(--text-primary)" }}
                >
                  {k.value}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {k.label}
                </p>
                <span
                  className="text-xs mt-1 inline-block px-1.5 py-0.5 rounded"
                  style={{
                    background: k.up
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.15)",
                    color: k.up ? "#10b981" : "#ef4444",
                  }}
                >
                  {k.up ? "↑" : "↓"} {k.change}
                </span>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Line chart */}
            <div
              className="lg:col-span-2 rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Revenue vs Expense
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ৳ in Lakh — {period}
                  </p>
                </div>
              </div>
              <LineChart
                series={[
                  { name: "Revenue", data: revArr, color: "#6366f1" },
                  { name: "Expense", data: expArr, color: "#ef4444" },
                  {
                    name: "Profit",
                    data: revArr.map((r, i) => r - expArr[i]),
                    color: "#10b981",
                  },
                ]}
                labels={labels}
                height={130}
              />
            </div>

            {/* Donut */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Expense Breakdown
              </h3>
              <DonutChart
                data={expenseBreakdown}
                size={140}
                label="Total"
                value="৳610K"
              />
            </div>
          </div>

          {/* Pie charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Revenue by Source
              </h3>
              <PieChart data={revenueSources} size={160} />
            </div>
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Department Performance
              </h3>
              <BarChart data={deptPerformance} height={150} />
            </div>
          </div>
        </div>
      )}

      {/* ── REVENUE ── */}
      {tab === "revenue" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Revenue Sources — Pie
              </h3>
              <PieChart data={revenueSources} size={180} />
            </div>
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Monthly Revenue Bar
              </h3>
              <BarChart
                data={months.map((m, i) => ({
                  label: m,
                  value: revArr[i],
                  color: "#6366f1",
                  gradient: `linear-gradient(to top,#6366f1,#a855f7)`,
                }))}
                height={160}
              />
            </div>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Revenue Trend — Detailed
            </h3>
            <LineChart
              series={[
                { name: "Revenue", data: revArr, color: "#6366f1" },
                {
                  name: "Target",
                  data: revArr.map((v) => Math.round(v * 0.85)),
                  color: "#06b6d4",
                },
              ]}
              labels={labels}
              height={140}
            />
          </div>

          {/* Revenue table */}
          <ComparisonTable
            title="Revenue Breakdown by Source (৳)"
            headers={[
              "Source",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Total",
            ]}
            rows={revenueSources.map((s) => {
              const vals = months.map(() =>
                Math.round((s.value / 7) * (0.8 + Math.random() * 0.4)),
              );
              return [
                <span key={s.label} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{ background: s.color }}
                  />
                  {s.label}
                </span>,
                ...vals.map((v) => `৳${v.toLocaleString()}`),
                <strong key="t">৳{s.value.toLocaleString()}</strong>,
              ];
            })}
          />
        </div>
      )}

      {/* ── MODULES ── */}
      {tab === "modules" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Module Usage (%)
              </h3>
              <div className="space-y-3">
                {moduleUsage.map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "var(--text-sub)" }}>
                        {m.label}
                      </span>
                      <span style={{ color: m.color }}>{m.value}%</span>
                    </div>
                    <div
                      className="h-2 rounded-full"
                      style={{ background: "var(--input-bg)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${m.value}%`, background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Module Activity — Donut
              </h3>
              <DonutChart
                data={moduleUsage.slice(0, 5)}
                size={160}
                label="Active"
                value="13"
              />
            </div>
          </div>

          <ComparisonTable
            title="Top Performing Modules"
            headers={["Module", "Revenue", "Status", "Records", "Growth"]}
            rows={topModules}
          />
        </div>
      )}

      {/* ── COMPARISON ── */}
      {tab === "comparison" && (
        <div className="space-y-4">
          <ComparisonTable
            title={`Month-by-Month Comparison (${period})`}
            headers={[
              "Period",
              "Revenue",
              "Expense",
              "Profit",
              "Margin",
              "Growth",
            ]}
            rows={comparisonRows}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                This Year vs Last Year
              </h3>
              <p
                className="text-xs mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Revenue comparison (৳ Lakh)
              </p>
              <LineChart
                series={[
                  { name: "2024", data: revArr, color: "#6366f1" },
                  {
                    name: "2023",
                    data: revArr.map((v) => Math.round(v * 0.82)),
                    color: "#94a3b8",
                  },
                ]}
                labels={labels}
                height={120}
              />
            </div>

            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Expense Categories Trend
              </h3>
              <p
                className="text-xs mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Top expense categories over time
              </p>
              <LineChart
                series={[
                  {
                    name: "Salaries",
                    data: [38, 40, 40, 42, 45, 44, 47],
                    color: "#8b5cf6",
                  },
                  {
                    name: "Purchase",
                    data: [22, 25, 23, 28, 32, 28, 35],
                    color: "#3b82f6",
                  },
                  {
                    name: "Rent",
                    data: [6, 6, 6, 6, 6, 6, 6],
                    color: "#f59e0b",
                  },
                ]}
                labels={months}
                height={120}
              />
            </div>
          </div>

          {/* Summary boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Best Month",
                value: "July 2024",
                icon: "🏆",
                color: "#f59e0b",
              },
              {
                label: "Highest Growth",
                value: "+34.1%",
                icon: "📈",
                color: "#10b981",
              },
              {
                label: "Peak Revenue",
                value: "৳124L",
                icon: "💹",
                color: "#6366f1",
              },
              {
                label: "Lowest Expense",
                value: "Jan (৳52L)",
                icon: "📉",
                color: "#06b6d4",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: `${s.color}10`,
                  border: `1px solid ${s.color}30`,
                }}
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <p
                  className="font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.value}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}
