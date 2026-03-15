import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  ModuleLayout,
  StatCard,
  Btn,
  Input,
  Select,
  Tabs,
} from "../components/ui";

const COLOR = "#6366f1";

const initialCompany = {
  name: "ERP System Ltd.",
  address: "House 12, Road 4, Gulshan-1, Dhaka-1212",
  phone: "01712345678",
  email: "info@erpsystem.com",
  website: "www.erpsystem.com",
  taxId: "BIN-123456789",
  currency: "BDT",
  fiscalStart: "January",
  timezone: "Asia/Dhaka",
  language: "English",
  logo: "E",
};

const initialModuleSettings = [
  {
    id: "hotel",
    name: "Hotel Management",
    icon: "🏨",
    enabled: true,
    color: "#6366f1",
  },
  {
    id: "hospital",
    name: "Hospital Management",
    icon: "🏥",
    enabled: true,
    color: "#ec4899",
  },
  {
    id: "school",
    name: "School Management",
    icon: "🏫",
    enabled: true,
    color: "#f59e0b",
  },
  {
    id: "accounting",
    name: "Accounting",
    icon: "📊",
    enabled: true,
    color: "#10b981",
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: "📦",
    enabled: true,
    color: "#3b82f6",
  },
  {
    id: "hr",
    name: "HR Management",
    icon: "👥",
    enabled: true,
    color: "#8b5cf6",
  },
  {
    id: "payroll",
    name: "Payroll / Salary",
    icon: "💰",
    enabled: true,
    color: "#f97316",
  },
  {
    id: "leave",
    name: "Leave Management",
    icon: "📅",
    enabled: true,
    color: "#06b6d4",
  },
  {
    id: "stock",
    name: "Stock Management",
    icon: "🏪",
    enabled: true,
    color: "#84cc16",
  },
  {
    id: "sales",
    name: "Sales Management",
    icon: "📈",
    enabled: true,
    color: "#ef4444",
  },
  {
    id: "purchase",
    name: "Purchase",
    icon: "🛒",
    enabled: true,
    color: "#0ea5e9",
  },
  {
    id: "reporting",
    name: "Reporting",
    icon: "📋",
    enabled: true,
    color: "#a855f7",
  },
  {
    id: "user_management",
    name: "User Management",
    icon: "🔐",
    enabled: true,
    color: "#64748b",
  },
];

const Toggle = ({ value, onChange, color = "#6366f1" }) => (
  <button
    onClick={() => onChange(!value)}
    className="w-11 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
    style={{ background: value ? color : "rgba(255,255,255,0.1)" }}
  >
    <span
      className="absolute top-0.5 transition-all duration-300 w-5 h-5 rounded-full bg-white shadow-sm"
      style={{ left: value ? "22px" : "2px" }}
    />
  </button>
);

const Section = ({ title, icon, children }) => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ border: "1px solid var(--border)" }}
  >
    <div
      className="flex items-center gap-2 px-5 py-3.5"
      style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span>{icon}</span>
      <h3
        className="font-semibold text-sm"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
    </div>
    <div className="p-5" style={{ background: "var(--bg-card)" }}>
      {children}
    </div>
  </div>
);

export default function Settings() {
  const { isDark, toggle } = useTheme();
  const [company, setCompany] = useState(initialCompany);
  const [modules, setModules] = useState(initialModuleSettings);
  const [tab, setTab] = useState("company");
  const [saved, setSaved] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    emailNotif: true,
    pushNotif: true,
    smsNotif: false,
    lowStock: true,
    newOrder: true,
    leaveRequest: true,
    payrollDue: true,
    systemAlert: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "60",
    passwordPolicy: "medium",
    auditLog: true,
  });

  const set = (key) => (v) => setCompany((p) => ({ ...p, [key]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleModule = (id) =>
    setModules((ms) =>
      ms.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)),
    );

  const enabledCount = modules.filter((m) => m.enabled).length;

  return (
    <ModuleLayout
      title="Settings"
      icon="⚙️"
      color={COLOR}
      actions={
        <Btn onClick={handleSave} color={saved ? "#10b981" : COLOR}>
          {saved ? "✓ Saved!" : "💾 Save Changes"}
        </Btn>
      }
    >
      <Tabs
        tabs={[
          { id: "company", label: "🏢 Company" },
          { id: "modules", label: "◈ Modules" },
          { id: "appearance", label: "🎨 Appearance" },
          { id: "notifications", label: "🔔 Notifications" },
          { id: "security", label: "🔐 Security" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* ── COMPANY ── */}
      {tab === "company" && (
        <div className="space-y-4">
          <Section title="Company Identity" icon="🏢">
            <div className="flex items-center gap-5 mb-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#a855f7)",
                }}
              >
                {company.logo}
              </div>
              <div>
                <p
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {company.name}
                </p>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Company Logo
                </p>
                <Btn
                  size="sm"
                  variant="secondary"
                  onClick={() => {}}
                  className="mt-2"
                >
                  Upload Logo
                </Btn>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={company.name}
                onChange={set("name")}
                required
              />
              <Input
                label="Tax / BIN Number"
                value={company.taxId}
                onChange={set("taxId")}
              />
              <Input
                label="Phone"
                value={company.phone}
                onChange={set("phone")}
              />
              <Input
                label="Email"
                type="email"
                value={company.email}
                onChange={set("email")}
              />
              <Input
                label="Website"
                value={company.website}
                onChange={set("website")}
              />
              <Select
                label="Currency"
                value={company.currency}
                onChange={set("currency")}
                options={[
                  { value: "BDT", label: "BDT — Bangladeshi Taka (৳)" },
                  { value: "USD", label: "USD — US Dollar ($)" },
                  { value: "EUR", label: "EUR — Euro (€)" },
                ]}
              />
            </div>
            <div className="mt-4">
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-sub)" }}
              >
                Address
              </label>
              <textarea
                value={company.address}
                onChange={(e) => set("address")(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={{
                  background: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </Section>

          <Section title="Regional Settings" icon="🌍">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Fiscal Year Start"
                value={company.fiscalStart}
                onChange={set("fiscalStart")}
                options={["January", "April", "July", "October"].map((m) => ({
                  value: m,
                  label: m,
                }))}
              />
              <Select
                label="Timezone"
                value={company.timezone}
                onChange={set("timezone")}
                options={[
                  { value: "Asia/Dhaka", label: "Asia/Dhaka (GMT+6)" },
                  { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
                  { value: "Asia/Dubai", label: "Asia/Dubai (GMT+4)" },
                  { value: "Europe/London", label: "Europe/London (GMT)" },
                ]}
              />
              <Select
                label="Language"
                value={company.language}
                onChange={set("language")}
                options={[
                  { value: "English", label: "English" },
                  { value: "Bangla", label: "বাংলা" },
                ]}
              />
            </div>
          </Section>
        </div>
      )}

      {/* ── MODULES ── */}
      {tab === "modules" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text-sub)" }}>
              {enabledCount} of {modules.length} modules enabled
            </p>
            <div className="flex gap-2">
              <Btn
                size="sm"
                variant="success"
                onClick={() =>
                  setModules((ms) => ms.map((m) => ({ ...m, enabled: true })))
                }
              >
                Enable All
              </Btn>
              <Btn
                size="sm"
                variant="danger"
                onClick={() =>
                  setModules((ms) => ms.map((m) => ({ ...m, enabled: false })))
                }
              >
                Disable All
              </Btn>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 p-4 rounded-xl transition-all"
                style={{
                  background: m.enabled ? `${m.color}10` : "var(--bg-card)",
                  border: `1px solid ${m.enabled ? m.color + "33" : "var(--border)"}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: `${m.color}22`,
                    border: `1px solid ${m.color}44`,
                    opacity: m.enabled ? 1 : 0.4,
                  }}
                >
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: m.enabled
                        ? "var(--text-primary)"
                        : "var(--text-muted)",
                    }}
                  >
                    {m.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: m.enabled ? m.color : "var(--text-muted)" }}
                  >
                    {m.enabled ? "Active" : "Disabled"}
                  </p>
                </div>
                <Toggle
                  value={m.enabled}
                  onChange={() => toggleModule(m.id)}
                  color={m.color}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── APPEARANCE ── */}
      {tab === "appearance" && (
        <div className="space-y-4">
          <Section title="Theme" icon="🎨">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dark theme option */}
              <button
                onClick={() => !isDark && toggle()}
                className="relative p-5 rounded-2xl text-left transition-all"
                style={{
                  background: "#0f1117",
                  border: `2px solid ${isDark ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isDark ? "0 0 0 3px rgba(99,102,241,0.2)" : "none",
                }}
              >
                {isDark && (
                  <span className="absolute top-3 right-3 text-indigo-400 text-sm">
                    ✓
                  </span>
                )}
                <div className="space-y-2 mb-3">
                  <div
                    className="h-2 rounded w-3/4"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  />
                  <div
                    className="h-2 rounded w-1/2"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                  <div className="flex gap-1">
                    {["#6366f1", "#10b981", "#f59e0b"].map((c) => (
                      <div
                        key={c}
                        className="h-4 flex-1 rounded"
                        style={{ background: c, opacity: 0.7 }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-white text-sm font-semibold">🌙 Dark Mode</p>
                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                  Easy on the eyes at night
                </p>
              </button>

              {/* Light theme option */}
              <button
                onClick={() => isDark && toggle()}
                className="relative p-5 rounded-2xl text-left transition-all"
                style={{
                  background: "#f8fafc",
                  border: `2px solid ${!isDark ? "#6366f1" : "rgba(0,0,0,0.1)"}`,
                  boxShadow: !isDark
                    ? "0 0 0 3px rgba(99,102,241,0.2)"
                    : "none",
                }}
              >
                {!isDark && (
                  <span className="absolute top-3 right-3 text-indigo-600 text-sm">
                    ✓
                  </span>
                )}
                <div className="space-y-2 mb-3">
                  <div
                    className="h-2 rounded w-3/4"
                    style={{ background: "rgba(0,0,0,0.15)" }}
                  />
                  <div
                    className="h-2 rounded w-1/2"
                    style={{ background: "rgba(0,0,0,0.08)" }}
                  />
                  <div className="flex gap-1">
                    {["#6366f1", "#10b981", "#f59e0b"].map((c) => (
                      <div
                        key={c}
                        className="h-4 flex-1 rounded"
                        style={{ background: c, opacity: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#0f172a" }}
                >
                  ☀️ Light Mode
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                  Clean and bright interface
                </p>
              </button>
            </div>

            <div
              className="mt-4 flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Current Theme
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {isDark
                    ? "🌙 Dark Mode — Easy on the eyes"
                    : "☀️ Light Mode — Clean and bright"}
                </p>
              </div>
              <Toggle value={isDark} onChange={toggle} />
            </div>
          </Section>

          <Section title="Accent Colors" icon="🎨">
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              Choose your primary accent color
            </p>
            <div className="flex gap-3 flex-wrap">
              {[
                { name: "Indigo", color: "#6366f1" },
                { name: "Purple", color: "#a855f7" },
                { name: "Cyan", color: "#06b6d4" },
                { name: "Emerald", color: "#10b981" },
                { name: "Rose", color: "#f43f5e" },
                { name: "Orange", color: "#f97316" },
              ].map((a) => (
                <button
                  key={a.name}
                  title={a.name}
                  className="w-9 h-9 rounded-full transition-all hover:scale-110"
                  style={{
                    background: a.color,
                    boxShadow:
                      a.color === "#6366f1" ? `0 0 0 3px ${a.color}44` : "none",
                  }}
                />
              ))}
            </div>
          </Section>

          <Section title="Layout" icon="⊞">
            <div className="space-y-3">
              {[
                {
                  label: "Compact Sidebar",
                  desc: "Show icons only by default",
                  key: "compactSidebar",
                },
                {
                  label: "Sticky Header",
                  desc: "Keep topbar fixed while scrolling",
                  key: "stickyHeader",
                },
                {
                  label: "Animated Transitions",
                  desc: "Smooth page and component animations",
                  key: "animations",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <Toggle value={i !== 0} onChange={() => {}} />
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {tab === "notifications" && (
        <div className="space-y-4">
          <Section title="Notification Channels" icon="📡">
            <div className="space-y-4">
              {[
                {
                  key: "emailNotif",
                  label: "Email Notifications",
                  desc: "Receive alerts via email",
                  icon: "📧",
                },
                {
                  key: "pushNotif",
                  label: "In-App Notifications",
                  desc: "Show alerts inside the system",
                  icon: "🔔",
                },
                {
                  key: "smsNotif",
                  label: "SMS Notifications",
                  desc: "Send alerts to mobile phones",
                  icon: "📱",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    value={notifSettings[item.key]}
                    onChange={(v) =>
                      setNotifSettings((p) => ({ ...p, [item.key]: v }))
                    }
                  />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Alert Types" icon="⚡">
            <div className="space-y-3">
              {[
                {
                  key: "lowStock",
                  label: "Low Stock Alerts",
                  icon: "📦",
                  color: "#f59e0b",
                },
                {
                  key: "newOrder",
                  label: "New Sales Orders",
                  icon: "📈",
                  color: "#10b981",
                },
                {
                  key: "leaveRequest",
                  label: "Leave Requests",
                  icon: "📅",
                  color: "#06b6d4",
                },
                {
                  key: "payrollDue",
                  label: "Payroll Reminders",
                  icon: "💰",
                  color: "#f97316",
                },
                {
                  key: "systemAlert",
                  label: "System Alerts",
                  icon: "⚙️",
                  color: "#6366f1",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{
                    background: notifSettings[item.key]
                      ? `${item.color}10`
                      : "var(--input-bg)",
                    border: `1px solid ${notifSettings[item.key] ? item.color + "33" : "var(--border)"}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                    </p>
                  </div>
                  <Toggle
                    value={notifSettings[item.key]}
                    onChange={(v) =>
                      setNotifSettings((p) => ({ ...p, [item.key]: v }))
                    }
                    color={item.color}
                  />
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── SECURITY ── */}
      {tab === "security" && (
        <div className="space-y-4">
          <Section title="Authentication" icon="🔐">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Two-Factor Authentication
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Add extra security via OTP
                  </p>
                </div>
                <Toggle
                  value={security.twoFactor}
                  onChange={(v) => setSecurity((p) => ({ ...p, twoFactor: v }))}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Audit Log
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Track all user actions
                  </p>
                </div>
                <Toggle
                  value={security.auditLog}
                  onChange={(v) => setSecurity((p) => ({ ...p, auditLog: v }))}
                />
              </div>
              <Select
                label="Session Timeout (minutes)"
                value={security.sessionTimeout}
                onChange={(v) =>
                  setSecurity((p) => ({ ...p, sessionTimeout: v }))
                }
                options={["15", "30", "60", "120", "480"].map((v) => ({
                  value: v,
                  label: `${v} minutes`,
                }))}
              />
              <Select
                label="Password Policy"
                value={security.passwordPolicy}
                onChange={(v) =>
                  setSecurity((p) => ({ ...p, passwordPolicy: v }))
                }
                options={[
                  { value: "low", label: "Low — Min 6 chars" },
                  { value: "medium", label: "Medium — 8 chars, 1 number" },
                  {
                    value: "high",
                    label: "High — 10 chars, mixed case, symbols",
                  },
                ]}
              />
            </div>
          </Section>

          <Section title="Data & Backup" icon="💾">
            <div className="space-y-3">
              {[
                {
                  label: "Export All Data",
                  icon: "📤",
                  color: "#3b82f6",
                  desc: "Download full database backup (JSON)",
                },
                {
                  label: "Reset Demo Data",
                  icon: "🔄",
                  color: "#f59e0b",
                  desc: "Restore all modules to demo state",
                },
                {
                  label: "Clear All Records",
                  icon: "🗑️",
                  color: "#ef4444",
                  desc: "Permanently delete all records",
                },
              ].map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:opacity-80"
                  style={{
                    background: `${item.color}10`,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${item.color}22` }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Section>
        </div>
      )}
    </ModuleLayout>
  );
}
