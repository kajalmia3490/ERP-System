import { useState, useEffect, useRef } from "react";
import AuthPages from "./AuthPages";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import {
  NotificationProvider,
  useNotifications,
  NotificationPanel,
  ToastContainer,
} from "./context/NotificationContext";

// ── Modules ───────────────────────────────────────────────────
import HotelManagement from "./modules/HotelManagement";
import HospitalManagement from "./modules/HospitalManagement";
import {
  SchoolManagement,
  Accounting,
  Inventory,
} from "./modules/SchoolAccountingInventory";
import {
  HRManagement,
  Payroll,
  LeaveManagement,
} from "./modules/HRPayrollLeave";
import {
  StockManagement,
  SalesManagement,
  Purchase,
  Reporting,
  UserManagement,
} from "./modules/StockSalesPurchaseReportingUsers";
import AnalyticsDashboard from "./modules/AnalyticsDashboard";
import Settings from "./modules/Settings";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const rolePermissions = {
  super_admin: ["all"],
  manager: ["hotel", "inventory", "stock", "reporting", "sales", "analytics"],
  hr_manager: ["hr", "payroll", "leave", "reporting"],
  accountant: ["accounting", "reporting", "analytics"],
  sales: ["sales", "inventory"],
};

const ALL_MODULES = [
  {
    id: "hotel",
    name: "Hotel Management",
    icon: "🏨",
    color: "#6366f1",
    stat: { label: "Active Rooms", value: "75%", up: true, change: "+12%" },
  },
  {
    id: "hospital",
    name: "Hospital Management",
    icon: "🏥",
    color: "#ec4899",
    stat: { label: "Patients", value: "47", up: true, change: "+8%" },
  },
  {
    id: "school",
    name: "School Management",
    icon: "🏫",
    color: "#f59e0b",
    stat: { label: "Students", value: "1,240", up: true, change: "+3%" },
  },
  {
    id: "accounting",
    name: "Accounting",
    icon: "📊",
    color: "#10b981",
    stat: { label: "Net Balance", value: "৳4.2M", up: true, change: "+18%" },
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: "📦",
    color: "#3b82f6",
    stat: { label: "Items", value: "3,847", up: false, change: "-2%" },
  },
  {
    id: "hr",
    name: "HR Management",
    icon: "👥",
    color: "#8b5cf6",
    stat: { label: "Employees", value: "284", up: true, change: "+5%" },
  },
  {
    id: "payroll",
    name: "Payroll / Salary",
    icon: "💰",
    color: "#f97316",
    stat: { label: "Monthly", value: "৳8.7M", up: true, change: "+2%" },
  },
  {
    id: "leave",
    name: "Leave Management",
    icon: "📅",
    color: "#06b6d4",
    stat: { label: "Pending", value: "12", up: false, change: "+4" },
  },
  {
    id: "stock",
    name: "Stock Management",
    icon: "🏪",
    color: "#84cc16",
    stat: { label: "Low Stock", value: "3", up: true, change: "-5" },
  },
  {
    id: "sales",
    name: "Sales Management",
    icon: "📈",
    color: "#ef4444",
    stat: { label: "Today", value: "৳142K", up: true, change: "+22%" },
  },
  {
    id: "purchase",
    name: "Purchase",
    icon: "🛒",
    color: "#0ea5e9",
    stat: { label: "Open POs", value: "18", up: true, change: "+3" },
  },
  {
    id: "reporting",
    name: "Reporting",
    icon: "📋",
    color: "#a855f7",
    stat: { label: "Reports", value: "94", up: true, change: "+14%" },
  },
  {
    id: "user_management",
    name: "User Management",
    icon: "🔐",
    color: "#64748b",
    stat: { label: "Users", value: "42", up: true, change: "+6" },
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: "🔬",
    color: "#f43f5e",
    stat: { label: "KPIs", value: "24", up: true, change: "Live" },
  },
  {
    id: "settings",
    name: "Settings",
    icon: "⚙️",
    color: "#94a3b8",
    stat: { label: "Config", value: "—", up: true, change: "—" },
  },
];

const MODULE_MAP = {
  hotel: HotelManagement,
  hospital: HospitalManagement,
  school: SchoolManagement,
  accounting: Accounting,
  inventory: Inventory,
  hr: HRManagement,
  payroll: Payroll,
  leave: LeaveManagement,
  stock: StockManagement,
  sales: SalesManagement,
  purchase: Purchase,
  reporting: Reporting,
  user_management: UserManagement,
  analytics: AnalyticsDashboard,
  settings: Settings,
};

// Bottom nav items (mobile)
const BOTTOM_NAV = [
  { id: "dashboard", icon: "⊞", label: "Home" },
  { id: "sales", icon: "📈", label: "Sales" },
  { id: "analytics", icon: "🔬", label: "Analytics" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const hasAccess = (user, id) => {
  if (id === "settings") return true; // everyone can access settings
  const p = user.permissions || rolePermissions[user.role] || [];
  return p.includes("all") || p.includes(id);
};

// ─────────────────────────────────────────────────────────────
// SMALL HELPERS
// ─────────────────────────────────────────────────────────────
const Spark = ({ data, color }) => {
  const max = Math.max(...data),
    min = Math.min(...data),
    range = max - min || 1;
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 64},${24 - ((v - min) / range) * 24}`,
    )
    .join(" ");
  return (
    <svg width="64" height="24">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
};

const BarMini = ({ data }) => {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div className="flex items-end gap-1.5" style={{ height: "96px" }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full rounded-t"
            style={{
              height: `${(d.v / max) * 80}px`,
              background:
                i === data.length - 1
                  ? "linear-gradient(to top,#6366f1,#a855f7)"
                  : "rgba(99,102,241,0.4)",
            }}
          />
          <span style={{ color: "var(--text-faint)", fontSize: "10px" }}>
            {d.l}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// THEME TOGGLE BUTTON
// ─────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        fontSize: "16px",
      }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATION BELL
// ─────────────────────────────────────────────────────────────
function NotifBell({ onNavigate }) {
  const { unread } = useNotifications();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <span style={{ fontSize: "16px" }}>🔔</span>
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: "#ef4444", fontSize: "10px" }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <NotificationPanel
          onClose={() => setOpen(false)}
          onNavigate={(mod) => {
            onNavigate(mod);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE DROPDOWN
// ─────────────────────────────────────────────────────────────
function ProfileDropdown({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);
  const roleColors = {
    super_admin: "#6366f1",
    manager: "#10b981",
    hr_manager: "#f59e0b",
    accountant: "#ec4899",
    sales: "#3b82f6",
  };
  const rc = roleColors[user.role] || "#64748b";
  const initials =
    user.avatar ||
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg,${rc},${rc}bb)` }}
        >
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p
            className="text-xs font-semibold leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            {user.name}
          </p>
          <p
            className="text-xs mt-0.5 capitalize"
            style={{ color: "var(--text-muted)" }}
          >
            {user.role?.replace(/_/g, " ")}
          </p>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          ▾
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 w-68 rounded-2xl overflow-hidden z-40"
            style={{
              background: "var(--modal-bg)",
              border: "1px solid var(--border)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              width: "260px",
            }}
          >
            {/* User header */}
            <div
              className="p-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg,${rc},${rc}bb)`,
                    fontSize: "16px",
                  }}
                >
                  {initials}
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {user.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {user.email}
                  </p>
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 capitalize"
                    style={{ background: `${rc}22`, color: rc }}
                  >
                    {user.role?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div
              className="p-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              {[
                { icon: "📱", label: "Phone", val: user.phone || "—" },
                {
                  icon: "🏢",
                  label: "Department",
                  val: user.department || "—",
                },
                { icon: "📅", label: "Joined", val: user.createdAt || "—" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 px-1">
                  <span className="text-sm">{r.icon}</span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {r.label}:
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {r.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Permissions */}
            <div
              className="p-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <p
                className="text-xs font-medium mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Permissions
              </p>
              <div className="flex flex-wrap gap-1">
                {(user.permissions?.[0] === "all"
                  ? ["All Access"]
                  : user.permissions || []
                ).map((p) => (
                  <span
                    key={p}
                    className="text-xs px-2 py-0.5 rounded-md"
                    style={{ background: `${rc}20`, color: rc }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={() => {
                  setOpen(false);
                  onNavigate("settings");
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors"
                style={{ color: "var(--text-primary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--row-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span>⚙️</span>
                <span className="text-sm">Settings</span>
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(239,68,68,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span>🚪</span>
                <span className="text-sm" style={{ color: "#ef4444" }}>
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────
function Sidebar({ open, user, currentPage, onNavigate }) {
  const { isDark } = useTheme();
  return (
    <aside
      className="fixed top-0 left-0 h-full z-30 flex flex-col overflow-hidden transition-all duration-300 hidden md:flex"
      style={{
        width: open ? "220px" : "60px",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{
          minHeight: "60px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
        >
          E
        </div>
        {open && (
          <div>
            <p className="text-white font-bold text-sm leading-none">
              ERP System
            </p>
            <p style={{ color: "#6366f1", fontSize: "11px" }}>Pro v2.0</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* Dashboard */}
        <div className="px-2 mb-1">
          <SidebarBtn
            id="dashboard"
            icon="⊞"
            label="Dashboard"
            active={currentPage === "dashboard"}
            color="#6366f1"
            expanded={open}
            onNavigate={onNavigate}
            accessible
          />
        </div>

        {open && (
          <p
            className="px-4 py-1.5 text-xs uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Modules
          </p>
        )}

        <div className="px-2 space-y-0.5">
          {ALL_MODULES.filter((m) => m.id !== "settings").map((m) => (
            <SidebarBtn
              key={m.id}
              id={m.id}
              icon={m.icon}
              label={m.name}
              color={m.color}
              active={currentPage === m.id}
              expanded={open}
              onNavigate={onNavigate}
              accessible={hasAccess(user, m.id)}
            />
          ))}
        </div>

        {open && (
          <p
            className="px-4 py-1.5 mt-2 text-xs uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            System
          </p>
        )}
        <div className="px-2">
          <SidebarBtn
            id="settings"
            icon="⚙️"
            label="Settings"
            active={currentPage === "settings"}
            color="#94a3b8"
            expanded={open}
            onNavigate={onNavigate}
            accessible
          />
        </div>
      </nav>
    </aside>
  );
}

function SidebarBtn({
  id,
  icon,
  label,
  active,
  color,
  expanded,
  onNavigate,
  accessible,
}) {
  return (
    <button
      onClick={() => accessible && onNavigate(id)}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group relative"
      style={{
        background: active ? `${color}25` : "transparent",
        border: active ? `1px solid ${color}44` : "1px solid transparent",
        color: active
          ? color
          : accessible
            ? "rgba(255,255,255,0.4)"
            : "rgba(255,255,255,0.15)",
        cursor: accessible ? "pointer" : "not-allowed",
        opacity: accessible ? 1 : 0.5,
      }}
      title={!expanded ? label : ""}
    >
      <span className="text-base flex-shrink-0" style={{ fontSize: "17px" }}>
        {icon}
      </span>
      {expanded && (
        <>
          <span className="text-xs font-medium truncate flex-1 text-left">
            {label}
          </span>
          {!accessible && (
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
              🔒
            </span>
          )}
        </>
      )}
      {/* tooltip for collapsed */}
      {!expanded && (
        <span
          className="absolute left-14 z-50 px-2 py-1 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
          style={{
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// MOBILE BOTTOM NAV
// ─────────────────────────────────────────────────────────────
function MobileBottomNav({ user, currentPage, onNavigate }) {
  const { unread } = useNotifications();
  const items = [
    { id: "dashboard", icon: "⊞", label: "Home" },
    {
      id: "sales",
      icon: "📈",
      label: "Sales",
      access: hasAccess(user, "sales"),
    },
    {
      id: "analytics",
      icon: "🔬",
      label: "Analytics",
      access: hasAccess(user, "analytics"),
    },
    { id: "notifications_panel", icon: "🔔", label: "Alerts", badge: unread },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden"
      style={{
        background: "var(--bg-sidebar)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {items.map((item) => {
        const active = currentPage === item.id;
        const acc = item.access !== false;
        return (
          <button
            key={item.id}
            onClick={() => acc && onNavigate(item.id)}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 relative transition-all"
            style={{ color: active ? "#a5b4fc" : "rgba(255,255,255,0.35)" }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span style={{ fontSize: "10px", fontWeight: active ? 600 : 400 }}>
              {item.label}
            </span>
            {item.badge > 0 && (
              <span
                className="absolute top-2 right-1/4 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: "#ef4444", fontSize: "9px" }}
              >
                {item.badge > 9 ? "9+" : item.badge}
              </span>
            )}
            {active && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ background: "#6366f1" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────
function DashboardPage({ user, onNavigate }) {
  const accessible = ALL_MODULES.filter((m) => hasAccess(user, m.id));
  const [hovMod, setHovMod] = useState(null);

  const kpis = [
    {
      icon: "💹",
      label: "Revenue",
      value: "৳12.4M",
      change: "+18.5%",
      up: true,
      color: "#6366f1",
      spark: [65, 72, 68, 80, 95, 88, 100],
    },
    {
      icon: "📤",
      label: "Expenses",
      value: "৳8.1M",
      change: "+6.2%",
      up: false,
      color: "#ef4444",
      spark: [40, 45, 42, 50, 60, 55, 65],
    },
    {
      icon: "💎",
      label: "Net Profit",
      value: "৳4.3M",
      change: "+34.1%",
      up: true,
      color: "#10b981",
      spark: [25, 28, 26, 32, 38, 35, 42],
    },
    {
      icon: "👤",
      label: "Employees",
      value: "284",
      change: "+12",
      up: true,
      color: "#f59e0b",
      spark: [260, 265, 268, 270, 275, 280, 284],
    },
    {
      icon: "🛒",
      label: "Orders",
      value: "1,247",
      change: "+22%",
      up: true,
      color: "#ec4899",
      spark: [80, 90, 85, 100, 110, 105, 120],
    },
    {
      icon: "📦",
      label: "Stock Items",
      value: "3,847",
      change: "-2%",
      up: false,
      color: "#3b82f6",
      spark: [400, 395, 390, 385, 388, 382, 380],
    },
  ];

  const chartData = [
    { l: "Jan", v: 85 },
    { l: "Feb", v: 92 },
    { l: "Mar", v: 88 },
    { l: "Apr", v: 102 },
    { l: "May", v: 115 },
    { l: "Jun", v: 108 },
    { l: "Jul", v: 124 },
  ];

  const activities = [
    {
      action: "New order #INV-0891 created",
      user: "Rahim Uddin",
      time: "2m ago",
      color: "#10b981",
    },
    {
      action: "Leave approved for Karim Hossain",
      user: "Admin",
      time: "15m ago",
      color: "#3b82f6",
    },
    {
      action: "Stock alert: Rice below reorder",
      user: "System",
      time: "32m ago",
      color: "#f59e0b",
    },
    {
      action: "Salary disbursed for July 2024",
      user: "Admin",
      time: "1h ago",
      color: "#10b981",
    },
    {
      action: "Room 204 checked out",
      user: "Front Desk",
      time: "2h ago",
      color: "#6366f1",
    },
    {
      action: "Journal entry #JE-00234 posted",
      user: "Fatema Begum",
      time: "3h ago",
      color: "#10b981",
    },
  ];

  // mini pie data (svg)
  const pieData = [
    { v: 416, c: "#ef4444" },
    { v: 280, c: "#6366f1" },
    { v: 195, c: "#ec4899" },
    { v: 148, c: "#f59e0b" },
    { v: 201, c: "#64748b" },
  ];
  const pieTotal = pieData.reduce((s, d) => s + d.v, 0);
  let cum = 0;
  const pieSlices = pieData.map((d) => {
    const start = cum,
      angle = (d.v / pieTotal) * 360;
    cum += angle;
    const r = 60,
      cx = 70,
      cy = 70;
    const s1 = ((start - 90) * Math.PI) / 180,
      e1 = ((start + angle - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s1),
      y1 = cy + r * Math.sin(s1);
    const x2 = cx + r * Math.cos(e1),
      y2 = cy + r * Math.sin(e1);
    return {
      ...d,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5"
      style={{ paddingBottom: "80px" }}
    >
      {/* Welcome banner */}
      <div
        className="relative rounded-2xl p-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#1e1b4b,#312e81)",
          border: "1px solid rgba(99,102,241,0.3)",
        }}
      >
        <div
          className="absolute right-0 top-0 w-56 h-56 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle,#6366f1,transparent)",
            transform: "translate(25%,-25%)",
          }}
        />
        <div className="relative z-10">
          <p className="text-indigo-300 text-sm">Welcome back 👋</p>
          <h2 className="text-white text-xl font-bold mt-0.5">{user.name}</h2>
          <p className="text-indigo-300 text-xs mt-1 capitalize">
            {user.role?.replace(/_/g, " ")} · {accessible.length} modules
            accessible
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {accessible.slice(0, 5).map((m) => (
              <button
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className="text-xs px-2.5 py-1 rounded-full text-white font-medium transition-all hover:scale-105"
                style={{
                  background: `${m.color}44`,
                  border: `1px solid ${m.color}66`,
                }}
              >
                {m.icon} {m.name}
              </button>
            ))}
            {accessible.length > 5 && (
              <span
                className="text-xs px-2.5 py-1 rounded-full text-indigo-300"
                style={{ background: "rgba(99,102,241,0.2)" }}
              >
                +{accessible.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k, i) => (
          <div
            key={i}
            className="rounded-xl p-3 space-y-2"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${k.color}20`, fontSize: "16px" }}
              >
                {k.icon}
              </div>
              <Spark data={k.spark} color={k.color} />
            </div>
            <div>
              <p
                className="font-bold"
                style={{ color: "var(--text-primary)", fontSize: "15px" }}
              >
                {k.value}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {k.label}
              </p>
            </div>
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
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
        {/* Bar chart */}
        <div
          className="lg:col-span-1 rounded-2xl p-4"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3
                className="font-semibold text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Monthly Revenue
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                ৳ in Lakh
              </p>
            </div>
            <button
              onClick={() => onNavigate("analytics")}
              className="text-xs px-2 py-1 rounded-lg transition-colors"
              style={{ color: "#818cf8", background: "rgba(99,102,241,0.1)" }}
            >
              View More →
            </button>
          </div>
          <BarMini data={chartData} />
        </div>

        {/* Pie chart */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            className="font-semibold text-sm mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Revenue Sources
          </h3>
          <div className="flex items-center gap-4">
            <svg width="140" height="140" className="flex-shrink-0">
              {pieSlices.map((s, i) => (
                <path
                  key={i}
                  d={s.path}
                  fill={s.c}
                  stroke="var(--bg-card)"
                  strokeWidth="2"
                />
              ))}
              <text
                x="70"
                y="65"
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="14"
                fontWeight="700"
              >
                ৳12.4M
              </text>
              <text
                x="70"
                y="82"
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
              >
                Total
              </text>
            </svg>
            <div className="space-y-1.5 flex-1">
              {[
                { c: "#ef4444", l: "Sales", v: "৳4.16M" },
                { c: "#6366f1", l: "Hotel", v: "৳2.80M" },
                { c: "#ec4899", l: "Hospital", v: "৳1.95M" },
                { c: "#f59e0b", l: "School", v: "৳1.48M" },
                { c: "#64748b", l: "Others", v: "৳2.01M" },
              ].map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ background: r.c }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-sub)" }}
                    >
                      {r.l}
                    </span>
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {r.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            className="font-semibold text-sm mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Activity
          </h3>
          <div className="space-y-2.5">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: a.color }}
                />
                <div>
                  <p
                    className="text-xs leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {a.action}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {a.time} · {a.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            Month-by-Month Comparison
          </h3>
          <button
            onClick={() => onNavigate("analytics")}
            className="text-xs px-2 py-1 rounded-lg"
            style={{ color: "#818cf8", background: "rgba(99,102,241,0.1)" }}
          >
            Full Analytics →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--input-bg)" }}>
                {[
                  "Month",
                  "Revenue",
                  "Expense",
                  "Profit",
                  "Margin",
                  "Growth",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left font-medium uppercase tracking-wide"
                    style={{ color: "var(--text-muted)", fontSize: "11px" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Jan", "৳85L", "৳52L", "৳33L", "38.8%", "—"],
                ["Feb", "৳92L", "৳58L", "৳34L", "37.0%", "↑ +৳7L"],
                ["Mar", "৳88L", "৳55L", "৳33L", "37.5%", "↓ -৳4L"],
                ["Apr", "৳102L", "৳62L", "৳40L", "39.2%", "↑ +৳14L"],
                ["May", "৳115L", "৳71L", "৳44L", "38.3%", "↑ +৳13L"],
                ["Jun", "৳108L", "৳68L", "৳40L", "37.0%", "↓ -৳7L"],
                ["Jul", "৳124L", "৳81L", "৳43L", "34.7%", "↑ +৳16L"],
              ].map((row, i) => (
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
                  <td
                    className="px-4 py-2.5 font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {row[0]}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: "#6366f1" }}>
                    {row[1]}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: "#ef4444" }}>
                    {row[2]}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: "#10b981" }}>
                    {row[3]}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(16,185,129,0.12)",
                        color: "#10b981",
                      }}
                    >
                      {row[4]}
                    </span>
                  </td>
                  <td
                    className="px-4 py-2.5"
                    style={{
                      color: row[5].startsWith("↑")
                        ? "#10b981"
                        : row[5] === "—"
                          ? "var(--text-muted)"
                          : "#ef4444",
                    }}
                  >
                    {row[5]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            All Modules
          </h3>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {accessible.length} accessible
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {ALL_MODULES.map((mod) => {
            const acc = hasAccess(user, mod.id);
            const hov = hovMod === mod.id;
            return (
              <div
                key={mod.id}
                onMouseEnter={() => acc && setHovMod(mod.id)}
                onMouseLeave={() => setHovMod(null)}
                onClick={() => acc && onNavigate(mod.id)}
                className="relative rounded-xl p-3 transition-all duration-200 select-none"
                style={{
                  background: hov ? `${mod.color}15` : "var(--bg-card)",
                  border: `1px solid ${hov ? mod.color + "44" : "var(--border)"}`,
                  transform: hov ? "translateY(-2px)" : "none",
                  boxShadow: hov ? `0 8px 24px ${mod.color}18` : "none",
                  cursor: acc ? "pointer" : "not-allowed",
                  opacity: acc ? 1 : 0.35,
                }}
              >
                {!acc && (
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.25)" }}
                  >
                    <span
                      style={{ fontSize: "12px", color: "var(--text-muted)" }}
                    >
                      🔒
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-1.5">
                  <span style={{ fontSize: "22px" }}>{mod.icon}</span>
                  <div className="text-right">
                    <p
                      className="font-bold text-xs leading-none"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {mod.stat.value}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: mod.stat.up ? "#10b981" : "#f59e0b" }}
                    >
                      {mod.stat.up ? "↑" : "↓"} {mod.stat.change}
                    </p>
                  </div>
                </div>
                <p
                  className="font-semibold leading-tight"
                  style={{ color: "var(--text-primary)", fontSize: "11px" }}
                >
                  {mod.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)", fontSize: "10px" }}
                >
                  {mod.stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP SHELL  (inside providers)
// ─────────────────────────────────────────────────────────────
function AppShell({ user, onLogout }) {
  const { isDark } = useTheme();
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebar] = useState(false);
  const [time, setTime] = useState(new Date());
  const [notifPanelOpen, setNotifPanel] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const navigate = (id) => {
    if (id === "notifications_panel") {
      setNotifPanel(true);
      return;
    }
    setPage(id);
  };

  const activeMod = ALL_MODULES.find((m) => m.id === page);
  const ModComp = MODULE_MAP[page];
  const denied =
    page !== "dashboard" &&
    ModComp &&
    !hasAccess(user, page) &&
    page !== "settings";

  return (
    <div
      style={{
        background: "var(--bg-base)",
        minHeight: "100vh",
        fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        user={user}
        currentPage={page}
        onNavigate={navigate}
      />

      {/* Main area */}
      <div
        className="flex flex-col transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? "220px" : "60px",
          minHeight: "100vh",
        }}
        // on mobile, no sidebar margin
      >
        {/* ── TOPBAR ── */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-5"
          style={{
            background: "var(--topbar-bg)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border)",
            height: "60px",
          }}
        >
          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Sidebar toggle (desktop) */}
            <button
              onClick={() => setSidebar((o) => !o)}
              className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <span style={{ fontSize: "14px" }}>
                {sidebarOpen ? "◀" : "▶"}
              </span>
            </button>

            {/* Breadcrumb */}
            {activeMod ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage("dashboard")}
                  className="text-xs transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  Dashboard
                </button>
                <span style={{ color: "var(--text-faint)" }}>›</span>
                <span className="text-xs">{activeMod.icon}</span>
                <span
                  className="font-semibold text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {activeMod.name}
                </span>
              </div>
            ) : (
              <h1
                className="font-bold text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                📊 ERP Dashboard
              </h1>
            )}
          </div>

          {/* Right: clock, theme, notif, profile */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs hidden lg:block"
              style={{ color: "var(--text-faint)" }}
            >
              {time.toLocaleTimeString("en-BD", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <ThemeToggle />
            <NotifBell onNavigate={navigate} />
            <ProfileDropdown
              user={user}
              onLogout={onLogout}
              onNavigate={navigate}
            />
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main
          className="flex-1 overflow-auto"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {page === "dashboard" ? (
            <DashboardPage user={user} onNavigate={navigate} />
          ) : denied ? (
            <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
              <p style={{ fontSize: "48px" }}>🔒</p>
              <p
                className="font-bold text-xl mt-3"
                style={{ color: "var(--text-primary)" }}
              >
                Access Denied
              </p>
              <p
                className="text-sm mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                You don't have permission for this module
              </p>
              <button
                onClick={() => setPage("dashboard")}
                className="mt-5 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#a855f7)",
                }}
              >
                ← Back to Dashboard
              </button>
            </div>
          ) : ModComp ? (
            <ModComp />
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <p style={{ fontSize: "48px" }}>🚧</p>
              <p
                className="font-bold text-xl mt-3"
                style={{ color: "var(--text-primary)" }}
              >
                Coming Soon
              </p>
              <button
                onClick={() => setPage("dashboard")}
                className="mt-5 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#a855f7)",
                }}
              >
                ← Back
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav user={user} currentPage={page} onNavigate={navigate} />

      {/* Notification panel (mobile trigger) */}
      {notifPanelOpen && (
        <NotificationPanel
          onClose={() => setNotifPanel(false)}
          onNavigate={navigate}
        />
      )}

      {/* Live toast popups */}
      <ToastContainer />

      {/* Global CSS for CSS variables + mobile sidebar fix */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @media (max-width: 768px) {
          [data-sidebar] { display: none !important; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT — wraps with providers
// ─────────────────────────────────────────────────────────────
export default function ERPApp() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const s = sessionStorage.getItem("erp_user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user) => {
    setLoggedInUser(user);
    try {
      sessionStorage.setItem("erp_user", JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    try {
      sessionStorage.removeItem("erp_user");
    } catch {}
  };

  if (!loggedInUser)
    return (
      <ThemeProvider>
        <AuthPages onLogin={handleLogin} />
      </ThemeProvider>
    );

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppShell user={loggedInUser} onLogout={handleLogout} />
      </NotificationProvider>
    </ThemeProvider>
  );
}
