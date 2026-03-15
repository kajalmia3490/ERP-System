import { useState, useEffect, useRef } from "react";

// ============================================================
// MOCK DATABASE - Replace with API calls when backend is ready
// ============================================================

const currentUser = {
  id: 1,
  name: "Admin User",
  email: "admin@erpsystem.com",
  avatar: "AU",
  role: "super_admin",
  permissions: ["all"],
};

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@erpsystem.com",
    role: "super_admin",
    permissions: ["all"],
    avatar: "AU",
    status: "active",
  },
  {
    id: 2,
    name: "Rahim Uddin",
    email: "rahim@erpsystem.com",
    role: "manager",
    permissions: ["hotel", "inventory", "reporting"],
    avatar: "RU",
    status: "active",
  },
  {
    id: 3,
    name: "Karim Hossain",
    email: "karim@erpsystem.com",
    role: "hr_manager",
    permissions: ["hr", "payroll", "leave"],
    avatar: "KH",
    status: "active",
  },
  {
    id: 4,
    name: "Fatema Begum",
    email: "fatema@erpsystem.com",
    role: "accountant",
    permissions: ["accounting", "reporting"],
    avatar: "FB",
    status: "active",
  },
  {
    id: 5,
    name: "Salam Sheikh",
    email: "salam@erpsystem.com",
    role: "sales",
    permissions: ["sales", "inventory"],
    avatar: "SS",
    status: "inactive",
  },
];

const allModules = [
  {
    id: "hotel",
    name: "Hotel Management",
    icon: "🏨",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.3)",
    route: "/hotel",
    stats: { label: "Active Rooms", value: "128", change: "+12%", up: true },
    description: "Room booking, guests & reservations",
  },
  {
    id: "hospital",
    name: "Hospital Management",
    icon: "🏥",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    border: "rgba(236,72,153,0.3)",
    route: "/hospital",
    stats: { label: "Patients Today", value: "47", change: "+8%", up: true },
    description: "Patients, doctors & appointments",
  },
  {
    id: "school",
    name: "School Management",
    icon: "🏫",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
    route: "/school",
    stats: { label: "Students", value: "1,240", change: "+3%", up: true },
    description: "Students, teachers & classes",
  },
  {
    id: "accounting",
    name: "Accounting",
    icon: "📊",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.3)",
    route: "/accounting",
    stats: {
      label: "Monthly Revenue",
      value: "৳4.2M",
      change: "+18%",
      up: true,
    },
    description: "Ledger, balance sheet & P&L",
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: "📦",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.3)",
    route: "/inventory",
    stats: { label: "Total Items", value: "3,847", change: "-2%", up: false },
    description: "Products, warehouses & tracking",
  },
  {
    id: "hr",
    name: "HR Management",
    icon: "👥",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.3)",
    route: "/hr",
    stats: { label: "Employees", value: "284", change: "+5%", up: true },
    description: "Recruitment & performance",
  },
  {
    id: "payroll",
    name: "Payroll / Salary",
    icon: "💰",
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.3)",
    route: "/payroll",
    stats: { label: "This Month", value: "৳8.7M", change: "+2%", up: true },
    description: "Salary processing & disbursement",
  },
  {
    id: "leave",
    name: "Leave Management",
    icon: "📅",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.3)",
    route: "/leave",
    stats: { label: "Pending Requests", value: "12", change: "+4", up: false },
    description: "Leave requests & approvals",
  },
  {
    id: "stock",
    name: "Stock Management",
    icon: "🏪",
    color: "#84cc16",
    bg: "rgba(132,204,22,0.12)",
    border: "rgba(132,204,22,0.3)",
    route: "/stock",
    stats: { label: "Low Stock Items", value: "23", change: "-5", up: true },
    description: "Stock levels & reorder points",
  },
  {
    id: "sales",
    name: "Sales Management",
    icon: "📈",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
    route: "/sales",
    stats: { label: "Today's Sales", value: "৳142K", change: "+22%", up: true },
    description: "Orders, invoices & reports",
  },
  {
    id: "purchase",
    name: "Purchase",
    icon: "🛒",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.12)",
    border: "rgba(14,165,233,0.3)",
    route: "/purchase",
    stats: { label: "Open POs", value: "18", change: "+3", up: true },
    description: "Purchase orders & vendors",
  },
  {
    id: "reporting",
    name: "Reporting",
    icon: "📋",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.3)",
    route: "/reporting",
    stats: { label: "Reports", value: "94", change: "+14%", up: true },
    description: "Analytics & data export",
  },
  {
    id: "user_management",
    name: "User Management",
    icon: "🔐",
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
    border: "rgba(100,116,139,0.3)",
    route: "/users",
    stats: { label: "Active Users", value: "42", change: "+6", up: true },
    description: "Roles, permissions & access",
  },
];

const recentActivities = [
  {
    id: 1,
    module: "sales",
    action: "New order #INV-2024-0891 created",
    user: "Rahim Uddin",
    time: "2 min ago",
    type: "success",
  },
  {
    id: 2,
    module: "hr",
    action: "Leave approved for Karim Hossain",
    user: "Admin",
    time: "15 min ago",
    type: "info",
  },
  {
    id: 3,
    module: "inventory",
    action: "Stock alert: Rice (50kg) below reorder",
    user: "System",
    time: "32 min ago",
    type: "warning",
  },
  {
    id: 4,
    module: "payroll",
    action: "Salary disbursed for March 2024",
    user: "Admin",
    time: "1 hr ago",
    type: "success",
  },
  {
    id: 5,
    module: "hotel",
    action: "Room 204 checked out - Jamal Ahmed",
    user: "Front Desk",
    time: "2 hr ago",
    type: "info",
  },
  {
    id: 6,
    module: "accounting",
    action: "Journal entry #JE-00234 posted",
    user: "Fatema Begum",
    time: "3 hr ago",
    type: "success",
  },
];

const chartData = [
  { month: "Jan", revenue: 85, expense: 52 },
  { month: "Feb", revenue: 92, expense: 58 },
  { month: "Mar", revenue: 88, expense: 55 },
  { month: "Apr", revenue: 102, expense: 62 },
  { month: "May", revenue: 115, expense: 71 },
  { month: "Jun", revenue: 108, expense: 68 },
  { month: "Jul", revenue: 124, expense: 81 },
];

const rolePermissions = {
  super_admin: ["all"],
  manager: ["hotel", "inventory", "reporting", "sales"],
  hr_manager: ["hr", "payroll", "leave", "reporting"],
  accountant: ["accounting", "reporting"],
  sales: ["sales", "inventory"],
};

// ============================================================
// HELPERS
// ============================================================

const hasAccess = (user, moduleId) => {
  if (user.role === "super_admin") return true;
  const perms = rolePermissions[user.role] || [];
  return perms.includes(moduleId) || perms.includes("all");
};

const activityTypeStyle = {
  success: {
    dot: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    label: "bg-emerald-500",
  },
  warning: {
    dot: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    label: "bg-amber-500",
  },
  info: { dot: "#3b82f6", bg: "rgba(59,130,246,0.1)", label: "bg-blue-500" },
};

// ============================================================
// MINI CHART COMPONENT
// ============================================================
const MiniBarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full rounded-sm"
            style={{
              height: `${(d.revenue / max) * 56}px`,
              background: "linear-gradient(to top, #6366f1, #a855f7)",
              opacity: i === data.length - 1 ? 1 : 0.5,
            }}
          />
          <div
            className="w-full rounded-sm"
            style={{
              height: `${(d.expense / max) * 56}px`,
              background: "rgba(239,68,68,0.5)",
              marginTop: "-100%",
            }}
          />
        </div>
      ))}
    </div>
  );
};

// ============================================================
// SPARKLINE COMPONENT
// ============================================================
const Sparkline = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80,
    h = 32;
  const pts = data
    .map(
      (v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`,
    )
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
};

// ============================================================
// MODAL COMPONENT
// ============================================================
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      />
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 z-10"
        style={{
          background: "#1a1d2e",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ============================================================
// USER SWITCHER - DEMO ONLY
// ============================================================
const UserSwitcher = ({ activeUser, onSwitch }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all hover:bg-white/10"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
        >
          {activeUser.avatar}
        </div>
        <span className="text-white font-medium hidden sm:block">
          {activeUser.name}
        </span>
        <span className="text-gray-400 text-xs hidden sm:block">
          ({activeUser.role.replace("_", " ")})
        </span>
        <span className="text-gray-400">▾</span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-72 rounded-xl overflow-hidden z-40 shadow-2xl"
          style={{
            background: "#1a1d2e",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="p-3 border-b border-white/10">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Switch User (Demo)
            </p>
          </div>
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                onSwitch(u);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                }}
              >
                {u.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{u.name}</p>
                <p className="text-gray-400 text-xs capitalize">
                  {u.role.replace(/_/g, " ")} · {u.status}
                </p>
              </div>
              {activeUser.id === u.id && (
                <span className="text-indigo-400 text-xs">●</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MODULE CARD
// ============================================================
const ModuleCard = ({ mod, onClick, hasAccess: access }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => access && onClick(mod)}
      className="relative rounded-2xl p-5 cursor-pointer transition-all duration-300 select-none"
      style={{
        background: hovered && access ? mod.bg : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered && access ? mod.border : "rgba(255,255,255,0.07)"}`,
        transform: hovered && access ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered && access ? `0 20px 40px ${mod.color}22` : "none",
        opacity: access ? 1 : 0.35,
        filter: access ? "none" : "grayscale(0.5)",
      }}
    >
      {!access && (
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center z-10"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <span
            className="text-xs text-gray-400 font-medium px-3 py-1 rounded-full"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            🔒 No Access
          </span>
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: mod.bg, border: `1px solid ${mod.border}` }}
        >
          {mod.icon}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white leading-none">
            {mod.stats.value}
          </p>
          <p
            className="text-xs mt-1 font-medium"
            style={{ color: mod.stats.up ? "#10b981" : "#f59e0b" }}
          >
            {mod.stats.up ? "↑" : "↓"} {mod.stats.change}
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-white font-semibold text-sm mb-1 leading-tight">
          {mod.name}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          {mod.description}
        </p>
      </div>
      <div
        className="mt-3 pt-3 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-gray-500 text-xs">{mod.stats.label}</p>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center transition-all"
          style={{
            background: hovered && access ? mod.color : "rgba(255,255,255,0.1)",
            color: "white",
            fontSize: "10px",
          }}
        >
          →
        </div>
      </div>
    </div>
  );
};

// ============================================================
// KPI CARD
// ============================================================
const KPICard = ({ icon, label, value, change, up, color, sparkData }) => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-3"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div className="flex items-center justify-between">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}
      >
        {icon}
      </div>
      <Sparkline data={sparkData} color={color} />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-gray-400 text-sm mt-0.5">{label}</p>
    </div>
    <div className="flex items-center gap-1.5">
      <span
        className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
          background: up ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
          color: up ? "#10b981" : "#ef4444",
        }}
      >
        {up ? "↑" : "↓"} {change}
      </span>
      <span className="text-gray-500 text-xs">vs last month</span>
    </div>
  </div>
);

// ============================================================
// REVENUE CHART
// ============================================================
const RevenueChart = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.revenue));
  return (
    <div>
      <div className="flex items-center gap-4 mb-4 text-xs">
        <span className="flex items-center gap-1.5 text-gray-400">
          <span
            className="w-3 h-1 rounded inline-block"
            style={{
              background: "linear-gradient(to right, #6366f1, #a855f7)",
            }}
          ></span>
          Revenue
        </span>
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="w-3 h-1 rounded inline-block bg-red-500 opacity-50"></span>
          Expense
        </span>
      </div>
      <div className="flex items-end gap-2 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t-md transition-all hover:opacity-90"
                style={{
                  height: `${(d.revenue / maxVal) * 100}px`,
                  background: "linear-gradient(to top, #6366f1, #a855f7)",
                }}
              />
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${(d.expense / maxVal) * 100}px`,
                  background: "rgba(239,68,68,0.45)",
                  marginTop: "2px",
                }}
              />
            </div>
            <span className="text-gray-500 text-xs">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// MAIN DASHBOARD
// ============================================================
export default function ERPDashboard() {
  const [activeUser, setActiveUser] = useState(currentUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const accessibleModules = allModules.filter((m) =>
    hasAccess(activeUser, m.id),
  );
  const filteredModules = allModules.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "modules", icon: "◈", label: "Modules" },
    { id: "analytics", icon: "◉", label: "Analytics" },
    { id: "users", icon: "◎", label: "Users" },
    { id: "settings", icon: "◬", label: "Settings" },
  ];

  const kpis = [
    {
      icon: "💹",
      label: "Total Revenue",
      value: "৳12.4M",
      change: "18.5%",
      up: true,
      color: "#6366f1",
      sparkData: [65, 72, 68, 80, 95, 88, 100],
    },
    {
      icon: "📤",
      label: "Total Expenses",
      value: "৳8.1M",
      change: "6.2%",
      up: false,
      color: "#ef4444",
      sparkData: [40, 45, 42, 50, 60, 55, 65],
    },
    {
      icon: "💎",
      label: "Net Profit",
      value: "৳4.3M",
      change: "34.1%",
      up: true,
      color: "#10b981",
      sparkData: [25, 28, 26, 32, 38, 35, 42],
    },
    {
      icon: "👤",
      label: "Total Employees",
      value: "284",
      change: "+12 this month",
      up: true,
      color: "#f59e0b",
      sparkData: [260, 265, 268, 270, 275, 280, 284],
    },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#0f1117",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        color: "#fff",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        className="fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300"
        style={{
          width: sidebarOpen ? "220px" : "64px",
          background: "#13162a",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.07)", minHeight: "72px" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            <span className="text-white font-black text-sm">E</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-none">
                ERP System
              </p>
              <p className="text-indigo-400 text-xs mt-0.5">v2.0 Pro</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group w-full"
              style={{
                background:
                  activeTab === item.id
                    ? "rgba(99,102,241,0.2)"
                    : "transparent",
                color: activeTab === item.id ? "#a5b4fc" : "#64748b",
                border:
                  activeTab === item.id
                    ? "1px solid rgba(99,102,241,0.3)"
                    : "1px solid transparent",
              }}
              title={!sidebarOpen ? item.label : ""}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center m-3 p-2 rounded-xl transition-all hover:bg-white/10"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#64748b",
          }}
        >
          <span className="text-sm">{sidebarOpen ? "◀" : "▶"}</span>
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main
        className="flex-1 flex flex-col transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? "220px" : "64px",
          minHeight: "100vh",
        }}
      >
        {/* TOPBAR */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3"
          style={{
            background: "rgba(15,17,23,0.9)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            minHeight: "64px",
          }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-white font-bold text-lg hidden sm:block">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "modules" && "All Modules"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "users" && "User Management"}
              {activeTab === "settings" && "Settings"}
            </h1>
            <div className="text-xs text-gray-500 hidden md:block">
              {time.toLocaleTimeString("en-BD")} ·{" "}
              {time.toLocaleDateString("en-BD", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                🔍
              </span>
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveTab("modules");
                }}
                placeholder="Search modules..."
                className="pl-9 pr-4 py-1.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none w-48 focus:w-56 transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <span className="text-base">🔔</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[#0f1117]" />
              </button>
              {notifOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 rounded-xl overflow-hidden z-40 shadow-2xl"
                  style={{
                    background: "#1a1d2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">
                      Notifications
                    </p>
                    <span className="text-xs text-indigo-400">3 new</span>
                  </div>
                  {recentActivities.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer"
                    >
                      <p className="text-white text-xs">{a.action}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {a.time} · {a.user}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <UserSwitcher activeUser={activeUser} onSwitch={setActiveUser} />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* ── DASHBOARD TAB ── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Welcome Banner */}
              <div
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 80% 50%, #6366f1 0%, transparent 50%)",
                  }}
                />
                <div className="relative z-10">
                  <p className="text-indigo-300 text-sm font-medium">
                    Welcome back 👋
                  </p>
                  <h2 className="text-white text-2xl font-bold mt-1">
                    {activeUser.name}
                  </h2>
                  <p className="text-indigo-300 text-sm mt-1 capitalize">
                    {activeUser.role.replace(/_/g, " ")} ·{" "}
                    {accessibleModules.length} modules accessible
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {accessibleModules.slice(0, 5).map((m) => (
                      <span
                        key={m.id}
                        className="text-xs px-2.5 py-1 rounded-full text-white font-medium"
                        style={{
                          background: `${m.color}44`,
                          border: `1px solid ${m.color}66`,
                        }}
                      >
                        {m.icon} {m.name}
                      </span>
                    ))}
                    {accessibleModules.length > 5 && (
                      <span
                        className="text-xs px-2.5 py-1 rounded-full text-indigo-300"
                        style={{ background: "rgba(99,102,241,0.2)" }}
                      >
                        +{accessibleModules.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => (
                  <KPICard key={i} {...k} />
                ))}
              </div>

              {/* Chart + Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue Chart */}
                <div
                  className="lg:col-span-2 rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-white font-semibold">
                        Revenue vs Expense
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Last 7 months (in Lakh ৳)
                      </p>
                    </div>
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(99,102,241,0.2)",
                        color: "#a5b4fc",
                        border: "1px solid rgba(99,102,241,0.3)",
                      }}
                    >
                      2024
                    </span>
                  </div>
                  <RevenueChart data={chartData} />
                </div>

                {/* Recent Activity */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <h3 className="text-white font-semibold mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {recentActivities.map((a) => {
                      const style = activityTypeStyle[a.type];
                      return (
                        <div
                          key={a.id}
                          className="flex items-start gap-3 p-2.5 rounded-xl"
                          style={{ background: style.bg }}
                        >
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: style.dot }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-xs leading-snug">
                              {a.action}
                            </p>
                            <p className="text-gray-500 text-xs mt-0.5">
                              {a.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Access Modules */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Quick Access</h3>
                  <button
                    onClick={() => setActiveTab("modules")}
                    className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors"
                  >
                    View all →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {allModules.slice(0, 10).map((mod) => {
                    const access = hasAccess(activeUser, mod.id);
                    return (
                      <button
                        key={mod.id}
                        onClick={() => access && setSelectedModule(mod)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105"
                        style={{
                          background: access
                            ? mod.bg
                            : "rgba(255,255,255,0.02)",
                          border: `1px solid ${access ? mod.border : "rgba(255,255,255,0.05)"}`,
                          opacity: access ? 1 : 0.4,
                          cursor: access ? "pointer" : "not-allowed",
                        }}
                      >
                        <span className="text-2xl">{mod.icon}</span>
                        <span className="text-xs text-center text-gray-300 leading-tight font-medium">
                          {mod.name}
                        </span>
                        {!access && (
                          <span className="text-gray-600 text-xs">🔒</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── MODULES TAB ── */}
          {activeTab === "modules" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-white font-bold text-xl">All Modules</h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {accessibleModules.length} accessible ·{" "}
                    {allModules.length - accessibleModules.length} locked for
                    your role
                  </p>
                </div>
                {/* mobile search */}
                <div className="relative sm:hidden">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    🔍
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search modules..."
                    className="pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-500 outline-none w-full"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {(searchQuery ? filteredModules : allModules).map((mod) => (
                  <ModuleCard
                    key={mod.id}
                    mod={mod}
                    onClick={setSelectedModule}
                    hasAccess={hasAccess(activeUser, mod.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === "analytics" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <h2 className="text-white font-bold text-xl">
                Analytics Overview
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <h3 className="text-white font-semibold mb-2">
                    Monthly Performance
                  </h3>
                  <p className="text-gray-500 text-xs mb-4">
                    Revenue vs Expenses
                  </p>
                  <RevenueChart data={chartData} />
                </div>
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <h3 className="text-white font-semibold mb-4">
                    Module Activity
                  </h3>
                  <div className="space-y-3">
                    {allModules.slice(0, 7).map((m, i) => {
                      const pct = Math.floor(Math.random() * 60) + 30;
                      return (
                        <div key={m.id}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">
                              {m.icon} {m.name}
                            </span>
                            <span style={{ color: m.color }}>{pct}%</span>
                          </div>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.07)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: m.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => (
                  <KPICard key={i} {...k} />
                ))}
              </div>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === "users" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-xl">
                    User Management
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {users.length} total users
                  </p>
                </div>
                <button
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  }}
                >
                  + Add User
                </button>
              </div>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                        Permissions
                      </th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr
                        key={u.id}
                        className="border-t hover:bg-white/5 transition-colors"
                        style={{ borderColor: "rgba(255,255,255,0.05)" }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{
                                background:
                                  "linear-gradient(135deg, #6366f1, #a855f7)",
                              }}
                            >
                              {u.avatar}
                            </div>
                            <div>
                              <p className="text-white font-medium text-xs">
                                {u.name}
                              </p>
                              <p className="text-gray-500 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span
                            className="text-xs px-2 py-0.5 rounded-md text-indigo-300 capitalize"
                            style={{ background: "rgba(99,102,241,0.15)" }}
                          >
                            {u.role.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {(rolePermissions[u.role] || [])
                              .slice(0, 3)
                              .map((p) => (
                                <span
                                  key={p}
                                  className="text-xs px-2 py-0.5 rounded-md text-gray-300"
                                  style={{
                                    background: "rgba(255,255,255,0.07)",
                                  }}
                                >
                                  {p === "all" ? "All Access" : p}
                                </span>
                              ))}
                            {(rolePermissions[u.role] || []).length > 3 && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-md text-gray-400"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                              >
                                +{(rolePermissions[u.role] || []).length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background:
                                u.status === "active"
                                  ? "rgba(16,185,129,0.15)"
                                  : "rgba(239,68,68,0.15)",
                              color:
                                u.status === "active" ? "#10b981" : "#ef4444",
                            }}
                          >
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Roles & Permissions */}
              <div>
                <h3 className="text-white font-semibold mb-3">
                  Role Permissions Matrix
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(rolePermissions).map(([role, perms]) => (
                    <div
                      key={role}
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <p className="text-white font-medium text-sm capitalize mb-2">
                        {role.replace(/_/g, " ")}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {perms.map((p) => {
                          const mod = allModules.find((m) => m.id === p);
                          return (
                            <span
                              key={p}
                              className="text-xs px-2 py-0.5 rounded-md"
                              style={{
                                background: mod
                                  ? `${mod.color}22`
                                  : "rgba(99,102,241,0.2)",
                                color: mod?.color || "#a5b4fc",
                                border: `1px solid ${mod ? mod.border : "rgba(99,102,241,0.3)"}`,
                              }}
                            >
                              {mod?.icon} {p === "all" ? "All Access" : p}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-white font-bold text-xl">Settings</h2>
              <div
                className="rounded-2xl p-6 space-y-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <h3 className="text-white font-semibold">
                  System Configuration
                </h3>
                {[
                  {
                    label: "Company Name",
                    val: "ERP System Ltd.",
                    type: "text",
                  },
                  { label: "Default Currency", val: "BDT (৳)", type: "text" },
                  {
                    label: "Fiscal Year",
                    val: "January - December",
                    type: "text",
                  },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="text-gray-400 text-xs mb-1 block">
                      {f.label}
                    </label>
                    <input
                      defaultValue={f.val}
                      className="w-full px-4 py-2 rounded-xl text-sm text-white outline-none"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div
                className="rounded-2xl p-6 space-y-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <h3 className="text-white font-semibold">Module Status</h3>
                {allModules.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-gray-300 text-sm">
                      {m.icon} {m.name}
                    </span>
                    <div
                      className="w-10 h-5 rounded-full relative cursor-pointer"
                      style={{ background: "rgba(99,102,241,0.6)" }}
                    >
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                }}
              >
                Save Settings
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── MODULE DETAIL MODAL ── */}
      <Modal
        isOpen={!!selectedModule}
        onClose={() => setSelectedModule(null)}
        title={
          selectedModule ? `${selectedModule.icon} ${selectedModule.name}` : ""
        }
      >
        {selectedModule && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              {selectedModule.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-3"
                style={{
                  background: selectedModule.bg,
                  border: `1px solid ${selectedModule.border}`,
                }}
              >
                <p className="text-gray-400 text-xs">
                  {selectedModule.stats.label}
                </p>
                <p className="text-white text-xl font-bold mt-1">
                  {selectedModule.stats.value}
                </p>
                <p
                  className="text-xs font-medium mt-0.5"
                  style={{
                    color: selectedModule.stats.up ? "#10b981" : "#f59e0b",
                  }}
                >
                  {selectedModule.stats.up ? "↑" : "↓"}{" "}
                  {selectedModule.stats.change}
                </p>
              </div>
              <div
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-gray-400 text-xs">Module Status</p>
                <p className="text-emerald-400 text-sm font-semibold mt-1">
                  ● Active
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Connected to backend
                </p>
              </div>
            </div>

            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-gray-400 text-xs mb-2">Connect Backend API</p>
              <code
                className="text-indigo-300 text-xs block"
                style={{ fontFamily: "monospace" }}
              >
                {`// TODO: Connect ${selectedModule.route} API`}
                <br />
                {`import { ${selectedModule.id}API } from './api/${selectedModule.id}';`}
              </code>
            </div>

            <div className="flex gap-2">
              <a
                href={selectedModule.route}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold text-center transition-all hover:opacity-90"
                style={{ background: selectedModule.color }}
              >
                Open Module →
              </a>
              <button
                onClick={() => setSelectedModule(null)}
                className="px-4 py-2.5 rounded-xl text-gray-400 text-sm font-medium transition-all hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
