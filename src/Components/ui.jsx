import { useState } from "react";

// ── Theme tokens ──────────────────────────────────────────────
export const theme = {
  bg: "#0f1117",
  surface: "#13162a",
  card: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.15)",
  text: "#ffffff",
  textMuted: "#64748b",
  textSub: "#94a3b8",
};

// ── Status badge ──────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    active: { bg: "rgba(16,185,129,0.15)", color: "#10b981", label: "Active" },
    inactive: {
      bg: "rgba(239,68,68,0.15)",
      color: "#ef4444",
      label: "Inactive",
    },
    paid: { bg: "rgba(16,185,129,0.15)", color: "#10b981", label: "Paid" },
    unpaid: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "Unpaid" },
    partial: {
      bg: "rgba(245,158,11,0.15)",
      color: "#f59e0b",
      label: "Partial",
    },
    pending: {
      bg: "rgba(245,158,11,0.15)",
      color: "#f59e0b",
      label: "Pending",
    },
    approved: {
      bg: "rgba(16,185,129,0.15)",
      color: "#10b981",
      label: "Approved",
    },
    rejected: {
      bg: "rgba(239,68,68,0.15)",
      color: "#ef4444",
      label: "Rejected",
    },
    received: {
      bg: "rgba(16,185,129,0.15)",
      color: "#10b981",
      label: "Received",
    },
    available: {
      bg: "rgba(16,185,129,0.15)",
      color: "#10b981",
      label: "Available",
    },
    occupied: {
      bg: "rgba(99,102,241,0.15)",
      color: "#818cf8",
      label: "Occupied",
    },
    maintenance: {
      bg: "rgba(245,158,11,0.15)",
      color: "#f59e0b",
      label: "Maintenance",
    },
    admitted: {
      bg: "rgba(99,102,241,0.15)",
      color: "#818cf8",
      label: "Admitted",
    },
    discharged: {
      bg: "rgba(16,185,129,0.15)",
      color: "#10b981",
      label: "Discharged",
    },
    OPD: { bg: "rgba(6,182,212,0.15)", color: "#22d3ee", label: "OPD" },
    hold: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "Hold" },
    reserved: {
      bg: "rgba(168,85,247,0.15)",
      color: "#c084fc",
      label: "Reserved",
    },
    "checked-in": {
      bg: "rgba(16,185,129,0.15)",
      color: "#10b981",
      label: "Checked In",
    },
    "checked-out": {
      bg: "rgba(100,116,139,0.15)",
      color: "#94a3b8",
      label: "Checked Out",
    },
    "on-leave": {
      bg: "rgba(245,158,11,0.15)",
      color: "#f59e0b",
      label: "On Leave",
    },
    due: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "Due" },
    low: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "Low Stock" },
    normal: { bg: "rgba(16,185,129,0.15)", color: "#10b981", label: "Normal" },
  };
  const s = map[status] || {
    bg: "rgba(100,116,139,0.15)",
    color: "#94a3b8",
    label: status,
  };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
};

// ── Module wrapper ─────────────────────────────────────────────
export const ModuleLayout = ({ title, icon, color, children, actions }) => (
  <div
    className="min-h-screen"
    style={{
      background: "#0f1117",
      color: "#fff",
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
    }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${color}22`, border: `1px solid ${color}44` }}
          >
            {icon}
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">{title}</h1>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Manage and track all records
            </p>
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  </div>
);

// ── Stat card ─────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, sub, color }) => (
  <div
    className="rounded-2xl p-4 flex items-center gap-4"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
      style={{ background: `${color}22`, border: `1px solid ${color}44` }}
    >
      {icon}
    </div>
    <div>
      <p className="text-white text-xl font-bold leading-none">{value}</p>
      <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>
        {label}
      </p>
      {sub && (
        <p className="text-xs mt-0.5" style={{ color }}>
          {sub}
        </p>
      )}
    </div>
  </div>
);

// ── Table wrapper ─────────────────────────────────────────────
export const Table = ({ headers, children, empty }) => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ border: "1px solid rgba(255,255,255,0.07)" }}
  >
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.05)" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider whitespace-nowrap"
                style={{ color: "#64748b" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {empty && (
        <div className="py-12 text-center" style={{ color: "#64748b" }}>
          {empty}
        </div>
      )}
    </div>
  </div>
);

export const TR = ({ children, onClick }) => (
  <tr
    onClick={onClick}
    className="border-t transition-colors"
    style={{
      borderColor: "rgba(255,255,255,0.05)",
      cursor: onClick ? "pointer" : "default",
    }}
    onMouseEnter={(e) => {
      if (onClick) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
    }}
  >
    {children}
  </tr>
);

export const TD = ({ children, className = "" }) => (
  <td className={`px-4 py-3 ${className}`} style={{ color: "#cbd5e1" }}>
    {children}
  </td>
);

// ── Button ────────────────────────────────────────────────────
export const Btn = ({
  children,
  onClick,
  variant = "primary",
  color,
  size = "md",
  disabled,
}) => {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const variants = {
    primary: {
      background: color || "linear-gradient(135deg,#6366f1,#a855f7)",
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: "rgba(255,255,255,0.06)",
      color: "#cbd5e1",
      border: "1px solid rgba(255,255,255,0.12)",
    },
    danger: {
      background: "rgba(239,68,68,0.15)",
      color: "#ef4444",
      border: "1px solid rgba(239,68,68,0.3)",
    },
    success: {
      background: "rgba(16,185,129,0.15)",
      color: "#10b981",
      border: "1px solid rgba(16,185,129,0.3)",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl font-medium transition-all hover:opacity-80 active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${sizes[size]}`}
      style={{
        ...variants[variant],
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
};

// ── Search + filter bar ───────────────────────────────────────
export const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative flex-1">
    <span
      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
      style={{ color: "#64748b" }}
    >
      🔍
    </span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    />
  </div>
);

// ── Modal ─────────────────────────────────────────────────────
export const Modal = ({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      />
      <div
        className={`relative w-full ${width} rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto`}
        style={{
          background: "#1a1d2e",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
            style={{ color: "#64748b" }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── Form input ────────────────────────────────────────────────
export const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}) => (
  <div>
    <label
      className="block text-xs font-medium mb-1.5"
      style={{ color: "#94a3b8" }}
    >
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    />
  </div>
);

export const Select = ({ label, value, onChange, options }) => (
  <div>
    <label
      className="block text-xs font-medium mb-1.5"
      style={{ color: "#94a3b8" }}
    >
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none appearance-none"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "#1a1d2e" }}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

// ── Tabs ──────────────────────────────────────────────────────
export const Tabs = ({ tabs, active, onChange }) => (
  <div
    className="flex gap-1 p-1 rounded-xl"
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
        style={{
          background: active === t.id ? "rgba(99,102,241,0.3)" : "transparent",
          color: active === t.id ? "#a5b4fc" : "#64748b",
          border:
            active === t.id
              ? "1px solid rgba(99,102,241,0.4)"
              : "1px solid transparent",
        }}
      >
        {t.label}
      </button>
    ))}
  </div>
);

// ── Empty state ───────────────────────────────────────────────
export const Empty = ({ icon, message }) => (
  <div className="py-16 text-center">
    <p className="text-4xl mb-3">{icon}</p>
    <p style={{ color: "#64748b" }}>{message}</p>
  </div>
);

// ── Progress bar ──────────────────────────────────────────────
export const ProgressBar = ({ value, max, color }) => (
  <div
    className="h-1.5 rounded-full w-full"
    style={{ background: "rgba(255,255,255,0.07)" }}
  >
    <div
      className="h-full rounded-full"
      style={{
        width: `${Math.min((value / max) * 100, 100)}%`,
        background: color,
      }}
    />
  </div>
);

// ── Avatar ────────────────────────────────────────────────────
export const Avatar = ({ name, size = "sm" }) => {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const s = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${s} rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
    >
      {initials}
    </div>
  );
};

// ── Currency format ───────────────────────────────────────────
export const taka = (n) => `৳${Number(n).toLocaleString("en-BD")}`;

// ── Confirm dialog ────────────────────────────────────────────
export const useConfirm = () => {
  const [state, setState] = useState({
    open: false,
    message: "",
    resolve: null,
  });
  const confirm = (message) =>
    new Promise((resolve) => setState({ open: true, message, resolve }));
  const handleClose = (result) => {
    state.resolve?.(result);
    setState({ open: false, message: "", resolve: null });
  };
  const Dialog = () =>
    state.open ? (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => handleClose(false)}
        />
        <div
          className="relative rounded-2xl p-6 w-full max-w-sm z-10"
          style={{
            background: "#1a1d2e",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p className="text-white text-center mb-5">{state.message}</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleClose(false)}
              className="flex-1 py-2 rounded-xl text-sm"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
            >
              Cancel
            </button>
            <button
              onClick={() => handleClose(true)}
              className="flex-1 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444" }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    ) : null;
  return { confirm, Dialog };
};
