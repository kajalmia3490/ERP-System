import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// ── Types & initial data ──────────────────────────────────────
const INITIAL_NOTIFS = [
  {
    id: 1,
    type: "warning",
    module: "inventory",
    title: "Low Stock Alert",
    body: "Rice (50kg) is below reorder level. Only 8 bags left.",
    time: new Date(Date.now() - 2 * 60000),
    read: false,
  },
  {
    id: 2,
    type: "success",
    module: "sales",
    title: "New Order Received",
    body: "Order #INV-0891 from Rahman Traders — ৳45,000",
    time: new Date(Date.now() - 15 * 60000),
    read: false,
  },
  {
    id: 3,
    type: "info",
    module: "leave",
    title: "Leave Request Pending",
    body: "Roksana Islam has applied for Casual leave on 18 July.",
    time: new Date(Date.now() - 32 * 60000),
    read: false,
  },
  {
    id: 4,
    type: "success",
    module: "payroll",
    title: "Payroll Processed",
    body: "Salary for 3 employees disbursed successfully for July 2024.",
    time: new Date(Date.now() - 60 * 60000),
    read: true,
  },
  {
    id: 5,
    type: "info",
    module: "hotel",
    title: "Guest Checkout",
    body: "Jamal Ahmed has checked out from Room 101.",
    time: new Date(Date.now() - 2 * 3600000),
    read: true,
  },
  {
    id: 6,
    type: "warning",
    module: "purchase",
    title: "PO Awaiting Approval",
    body: "Purchase Order PO003 from Office Plus needs your approval.",
    time: new Date(Date.now() - 3 * 3600000),
    read: true,
  },
  {
    id: 7,
    type: "error",
    module: "hr",
    title: "Document Expiry",
    body: "Salam Sheikh's work permit expires in 7 days. Please renew.",
    time: new Date(Date.now() - 5 * 3600000),
    read: true,
  },
  {
    id: 8,
    type: "success",
    module: "hospital",
    title: "Patient Discharged",
    body: "Rafiq Islam discharged from Cardiology. Bills cleared.",
    time: new Date(Date.now() - 8 * 3600000),
    read: true,
  },
  {
    id: 9,
    type: "info",
    module: "school",
    title: "Fee Collection Reminder",
    body: "5 students have pending fees for July. Send reminders.",
    time: new Date(Date.now() - 24 * 3600000),
    read: true,
  },
  {
    id: 10,
    type: "warning",
    module: "stock",
    title: "Expiry Alert",
    body: "Hand Sanitizer (500ml) batch expires in 30 days.",
    time: new Date(Date.now() - 26 * 3600000),
    read: true,
  },
];

const typeConfig = {
  success: {
    icon: "✅",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
  },
  warning: {
    icon: "⚠️",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
  },
  error: {
    icon: "🚨",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.25)",
  },
  info: {
    icon: "ℹ️",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.25)",
  },
};

const moduleIcons = {
  inventory: "📦",
  sales: "📈",
  leave: "📅",
  payroll: "💰",
  hotel: "🏨",
  purchase: "🛒",
  hr: "👥",
  hospital: "🏥",
  school: "🏫",
  stock: "🏪",
};

function timeAgo(date) {
  const s = Math.floor((Date.now() - date) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ── Context ───────────────────────────────────────────────────
const NotifContext = createContext(null);
export const useNotifications = () => useContext(NotifContext);

export function NotificationProvider({ children }) {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [ticker, setTicker] = useState(0);

  // Force re-render every 30s so timeAgo updates
  useEffect(() => {
    const t = setInterval(() => setTicker((p) => p + 1), 30000);
    return () => clearInterval(t);
  }, []);

  // Simulate incoming notification every ~45s
  useEffect(() => {
    const live = [
      {
        type: "info",
        module: "sales",
        title: "New Quotation Request",
        body: "Hossain Corp requests a quote for 20 laptops.",
      },
      {
        type: "success",
        module: "accounting",
        title: "Payment Received",
        body: "Khan & Sons paid ৳50,000 against Invoice INV003.",
      },
      {
        type: "warning",
        module: "inventory",
        title: "Stock Running Low",
        body: "Printer Toner has only 2 units remaining.",
      },
    ];
    let idx = 0;
    const t = setInterval(() => {
      const n = {
        ...live[idx % live.length],
        id: Date.now(),
        time: new Date(),
        read: false,
      };
      setNotifs((p) => [n, ...p]);
      idx++;
    }, 45000);
    return () => clearInterval(t);
  }, []);

  const unread = notifs.filter((n) => !n.read).length;
  const markRead = useCallback(
    (id) =>
      setNotifs((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [],
  );
  const markAll = useCallback(
    () => setNotifs((p) => p.map((n) => ({ ...n, read: true }))),
    [],
  );
  const remove = useCallback(
    (id) => setNotifs((p) => p.filter((n) => n.id !== id)),
    [],
  );
  const clearAll = useCallback(() => setNotifs([]), []);
  const addNotif = useCallback(
    (n) =>
      setNotifs((p) => [
        { ...n, id: Date.now(), time: new Date(), read: false },
        ...p,
      ]),
    [],
  );

  return (
    <NotifContext.Provider
      value={{
        notifs,
        unread,
        markRead,
        markAll,
        remove,
        clearAll,
        addNotif,
        typeConfig,
        moduleIcons,
        timeAgo,
      }}
    >
      {children}
    </NotifContext.Provider>
  );
}

// ── Notification Panel Component ──────────────────────────────
export function NotificationPanel({ onClose, onNavigate }) {
  const {
    notifs,
    unread,
    markRead,
    markAll,
    remove,
    clearAll,
    typeConfig,
    moduleIcons,
    timeAgo,
  } = useNotifications();
  const [filter, setFilter] = useState("all"); // all | unread | warning | success | error

  const filtered = notifs.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "warning") return n.type === "warning" || n.type === "error";
    if (filter === "success") return n.type === "success";
    return true;
  });

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed right-4 top-16 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "var(--modal-bg)",
          border: "1px solid var(--border)",
          maxHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-card)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🔔</span>
            <span
              className="font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Notifications
            </span>
            {unread > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                style={{ background: "#ef4444" }}
              >
                {unread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAll}
                className="text-xs px-2 py-1 rounded-lg transition-all hover:opacity-80"
                style={{ color: "#6366f1", background: "rgba(99,102,241,0.1)" }}
              >
                Mark all read
              </button>
            )}
            {notifs.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs px-2 py-1 rounded-lg transition-all hover:opacity-80"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--input-bg)",
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-1 px-3 py-2 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {[
            { id: "all", label: `All (${notifs.length})` },
            { id: "unread", label: `Unread (${unread})` },
            { id: "warning", label: "Alerts" },
            { id: "success", label: "Success" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="text-xs px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
              style={{
                background:
                  filter === f.id ? "rgba(99,102,241,0.2)" : "transparent",
                color: filter === f.id ? "#a5b4fc" : "var(--text-muted)",
                border:
                  filter === f.id
                    ? "1px solid rgba(99,102,241,0.3)"
                    : "1px solid transparent",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-3xl mb-2">🔕</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No notifications
              </p>
            </div>
          ) : (
            filtered.map((n) => {
              const tc = typeConfig[n.type];
              return (
                <div
                  key={n.id}
                  className="group flex gap-3 px-4 py-3 cursor-pointer transition-all"
                  style={{
                    background: n.read ? "transparent" : `${tc.bg}`,
                    borderBottom: "1px solid var(--border)",
                  }}
                  onClick={() => {
                    markRead(n.id);
                    onNavigate?.(n.module);
                    onClose();
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{
                      background: tc.bg,
                      border: `1px solid ${tc.border}`,
                    }}
                  >
                    {moduleIcons[n.module] || tc.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="text-xs font-semibold leading-snug"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {n.title}
                      </p>
                      {!n.read && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{ background: tc.color }}
                        />
                      )}
                    </div>
                    <p
                      className="text-xs mt-0.5 leading-snug line-clamp-2"
                      style={{ color: "var(--text-sub)" }}
                    >
                      {n.body}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {timeAgo(n.time)}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded capitalize"
                        style={{ background: `${tc.color}22`, color: tc.color }}
                      >
                        {n.type}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifs.length > 5 && (
          <div
            className="px-4 py-2 text-center flex-shrink-0"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {notifs.length} total notifications
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ── Toast / Live notification popup ───────────────────────────
export function ToastContainer() {
  const { notifs } = useNotifications();
  const [toasts, setToasts] = useState([]);
  const prevLen = useState(notifs.length)[0];

  useEffect(() => {
    if (notifs.length > 0 && !notifs[0].read) {
      const latest = notifs[0];
      setToasts((p) => [latest, ...p].slice(0, 3));
      const t = setTimeout(
        () => setToasts((p) => p.filter((x) => x.id !== latest.id)),
        4000,
      );
      return () => clearTimeout(t);
    }
  }, [notifs.length]);

  return (
    <div className="fixed bottom-20 right-4 z-[60] space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const tc = typeConfig[toast.type];
        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl pointer-events-auto"
            style={{
              background: "var(--modal-bg)",
              border: `1px solid ${tc.border}`,
              minWidth: "280px",
              maxWidth: "320px",
              animation: "slideInRight 0.3s ease",
            }}
          >
            <span className="text-lg flex-shrink-0">{tc.icon}</span>
            <div className="min-w-0">
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {toast.title}
              </p>
              <p
                className="text-xs mt-0.5 line-clamp-2"
                style={{ color: "var(--text-sub)" }}
              >
                {toast.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
