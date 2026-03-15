import { useState } from "react";
import {
  employees,
  departments,
  payrollRecords,
  leaveRequests,
  leaveBalance,
} from "../data/mockData";
import {
  ModuleLayout,
  StatCard,
  Table,
  TR,
  TD,
  StatusBadge,
  Btn,
  SearchBar,
  Modal,
  Input,
  Select,
  Tabs,
  Avatar,
  taka,
  useConfirm,
  ProgressBar,
} from "../components/ui";

// ── HR MANAGEMENT ─────────────────────────────────────────────
export function HRManagement() {
  const COLOR = "#8b5cf6";
  const [emps, setEmps] = useState(employees);
  const [depts] = useState(departments);
  const [tab, setTab] = useState("employees");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dept: "",
    designation: "",
    join: "",
    salary: "",
    phone: "",
    email: "",
    status: "active",
  });

  const filtered = emps.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.dept.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    if (!form.name || !form.dept) return;
    setEmps([
      {
        id: `EMP${String(emps.length + 1).padStart(3, "0")}`,
        ...form,
        salary: Number(form.salary),
      },
      ...emps,
    ]);
    setForm({
      name: "",
      dept: "",
      designation: "",
      join: "",
      salary: "",
      phone: "",
      email: "",
      status: "active",
    });
    setModal(false);
  };

  const deptColor = {
    Sales: "#ef4444",
    HR: "#8b5cf6",
    Accounts: "#10b981",
    IT: "#3b82f6",
    Admin: "#f59e0b",
  };

  return (
    <ModuleLayout
      title="HR Management"
      icon="👥"
      color={COLOR}
      actions={
        <Btn color={COLOR} onClick={() => setModal(true)}>
          + Add Employee
        </Btn>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Total Employees"
          value={emps.length}
          color={COLOR}
        />
        <StatCard
          icon="✅"
          label="Active"
          value={emps.filter((e) => e.status === "active").length}
          color="#10b981"
        />
        <StatCard
          icon="🏖️"
          label="On Leave"
          value={emps.filter((e) => e.status === "on-leave").length}
          color="#f59e0b"
        />
        <StatCard
          icon="🏢"
          label="Departments"
          value={depts.length}
          color="#3b82f6"
        />
      </div>

      <Tabs
        tabs={[
          { id: "employees", label: "👥 Employees" },
          { id: "departments", label: "🏢 Departments" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

      {tab === "employees" && (
        <Table
          headers={[
            "ID",
            "Name",
            "Department",
            "Designation",
            "Join Date",
            "Salary",
            "Status",
            "",
          ]}
        >
          {filtered.map((e) => (
            <TR
              key={e.id}
              onClick={() => {
                setSelected(e);
                setDetailModal(true);
              }}
            >
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#c4b5fd" }}
                >
                  {e.id}
                </span>
              </TD>
              <TD>
                <div className="flex items-center gap-2">
                  <Avatar name={e.name} />
                  <div>
                    <p className="text-white text-xs font-medium">{e.name}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      {e.email}
                    </p>
                  </div>
                </div>
              </TD>
              <TD>
                <span
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{
                    background: `${deptColor[e.dept] || COLOR}22`,
                    color: deptColor[e.dept] || COLOR,
                  }}
                >
                  {e.dept}
                </span>
              </TD>
              <TD className="text-xs text-white">{e.designation}</TD>
              <TD className="text-xs">{e.join}</TD>
              <TD className="text-xs font-semibold text-white">
                {taka(e.salary)}
              </TD>
              <TD>
                <StatusBadge status={e.status} />
              </TD>
              <TD>
                <Btn
                  size="sm"
                  variant="secondary"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setSelected(e);
                    setDetailModal(true);
                  }}
                >
                  View
                </Btn>
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "departments" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {depts.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-bold">{d.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    Head: {d.head}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${deptColor[d.name] || COLOR}22`,
                    color: deptColor[d.name] || COLOR,
                    fontSize: "20px",
                  }}
                >
                  🏢
                </div>
              </div>
              <div
                className="flex justify-between text-xs pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span style={{ color: "#94a3b8" }}>
                  👥 {d.employees} employees
                </span>
                <span className="font-semibold text-white">
                  {taka(d.budget)} budget
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="👥 Add Employee"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Input
              label="Designation"
              value={form.designation}
              onChange={(v) => setForm({ ...form, designation: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              value={form.dept}
              onChange={(v) => setForm({ ...form, dept: v })}
              options={[
                { value: "", label: "Select dept" },
                ...depts.map((d) => ({ value: d.name, label: d.name })),
              ]}
            />
            <Input
              label="Join Date"
              type="date"
              value={form.join}
              onChange={(v) => setForm({ ...form, join: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <Input
              label="Salary (৳)"
              type="number"
              value={form.salary}
              onChange={(v) => setForm({ ...form, salary: v })}
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn color={COLOR} onClick={handleAdd}>
              Add Employee
            </Btn>
          </div>
        </div>
      </Modal>

      <Modal
        open={detailModal}
        onClose={() => setDetailModal(false)}
        title="Employee Profile"
      >
        {selected && (
          <div className="space-y-4">
            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg,#8b5cf6,#a855f7)",
                }}
              >
                {selected.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{selected.name}</p>
                <p className="text-sm" style={{ color: "#c4b5fd" }}>
                  {selected.designation}
                </p>
                <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                  {selected.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Employee ID", value: selected.id },
                { label: "Department", value: selected.dept },
                { label: "Phone", value: selected.phone },
                { label: "Join Date", value: selected.join },
                { label: "Salary", value: taka(selected.salary) },
                {
                  label: "Status",
                  value: <StatusBadge status={selected.status} />,
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <p className="text-xs mb-1" style={{ color: "#64748b" }}>
                    {f.label}
                  </p>
                  <p className="text-white text-sm font-medium">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}

// ── PAYROLL ───────────────────────────────────────────────────
export function Payroll() {
  const COLOR = "#f97316";
  const [records, setRecords] = useState(payrollRecords);
  const [tab, setTab] = useState("payroll");
  const [search, setSearch] = useState("");
  const { confirm, Dialog } = useConfirm();

  const filtered = records.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.dept.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPaid = records
    .filter((r) => r.status === "paid")
    .reduce((s, r) => s + r.net, 0);
  const totalPending = records
    .filter((r) => r.status === "pending")
    .reduce((s, r) => s + r.net, 0);

  const handlePay = async (id) => {
    const ok = await confirm("Process salary payment for this employee?");
    if (ok)
      setRecords(
        records.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "paid",
                paidOn: new Date().toISOString().split("T")[0],
              }
            : r,
        ),
      );
  };

  const handlePayAll = async () => {
    const pending = records.filter((r) => r.status === "pending");
    if (!pending.length) return;
    const ok = await confirm(
      `Process salary for ${pending.length} pending employees? Total: ${taka(totalPending)}`,
    );
    if (ok)
      setRecords(
        records.map((r) =>
          r.status === "pending"
            ? {
                ...r,
                status: "paid",
                paidOn: new Date().toISOString().split("T")[0],
              }
            : r,
        ),
      );
  };

  return (
    <ModuleLayout
      title="Payroll / Salary Management"
      icon="💰"
      color={COLOR}
      actions={
        <div className="flex gap-2">
          <Btn variant="success" onClick={handlePayAll}>
            Pay All Pending
          </Btn>
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="✅"
          label="Paid"
          value={taka(totalPaid)}
          sub={`${records.filter((r) => r.status === "paid").length} employees`}
          color="#10b981"
        />
        <StatCard
          icon="⏳"
          label="Pending"
          value={taka(totalPending)}
          sub={`${records.filter((r) => r.status === "pending").length} employees`}
          color="#f59e0b"
        />
        <StatCard
          icon="🛑"
          label="On Hold"
          value={records.filter((r) => r.status === "hold").length}
          color="#ef4444"
        />
        <StatCard
          icon="💰"
          label="Total Payroll"
          value={taka(records.reduce((s, r) => s + r.net, 0))}
          sub="July 2024"
          color={COLOR}
        />
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search employee, department..."
      />

      <Table
        headers={[
          "Employee",
          "Department",
          "Basic",
          "Allowance",
          "Deduction",
          "Tax",
          "Net Salary",
          "Month",
          "Status",
          "Action",
        ]}
      >
        {filtered.map((r) => (
          <TR key={r.id}>
            <TD>
              <div className="flex items-center gap-2">
                <Avatar name={r.name} />
                <div>
                  <p className="text-white text-xs font-medium">{r.name}</p>
                  <p className="text-xs" style={{ color: "#64748b" }}>
                    {r.empId}
                  </p>
                </div>
              </div>
            </TD>
            <TD className="text-xs">{r.dept}</TD>
            <TD className="text-xs font-mono">{taka(r.basic)}</TD>
            <TD className="text-xs font-mono" style={{ color: "#10b981" }}>
              +{taka(r.allowance)}
            </TD>
            <TD className="text-xs font-mono" style={{ color: "#ef4444" }}>
              -{taka(r.deduction)}
            </TD>
            <TD className="text-xs font-mono" style={{ color: "#f59e0b" }}>
              -{taka(r.tax)}
            </TD>
            <TD className="font-bold text-white text-xs">{taka(r.net)}</TD>
            <TD className="text-xs">{r.month}</TD>
            <TD>
              <StatusBadge status={r.status} />
            </TD>
            <TD>
              {r.status === "pending" && (
                <Btn size="sm" color={COLOR} onClick={() => handlePay(r.id)}>
                  Pay Now
                </Btn>
              )}
              {r.status === "paid" && (
                <span className="text-xs" style={{ color: "#64748b" }}>
                  {r.paidOn}
                </span>
              )}
            </TD>
          </TR>
        ))}
      </Table>

      {/* Payroll summary */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(249,115,22,0.06)",
          border: "1px solid rgba(249,115,22,0.2)",
        }}
      >
        <p className="text-white font-semibold mb-3">
          Payroll Summary — July 2024
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            {
              label: "Total Basic",
              val: taka(records.reduce((s, r) => s + r.basic, 0)),
            },
            {
              label: "Total Allowance",
              val: taka(records.reduce((s, r) => s + r.allowance, 0)),
            },
            {
              label: "Total Deduction",
              val: taka(records.reduce((s, r) => s + r.deduction + r.tax, 0)),
            },
            {
              label: "Net Disbursed",
              val: taka(
                records
                  .filter((r) => r.status === "paid")
                  .reduce((s, r) => s + r.net, 0),
              ),
            },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-xs mb-1" style={{ color: "#64748b" }}>
                {item.label}
              </p>
              <p className="text-white font-bold">{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog />
    </ModuleLayout>
  );
}

// ── LEAVE MANAGEMENT ──────────────────────────────────────────
export function LeaveManagement() {
  const COLOR = "#06b6d4";
  const [leaves, setLeaves] = useState(leaveRequests);
  const [balances] = useState(leaveBalance);
  const [tab, setTab] = useState("requests");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dept: "",
    type: "Annual",
    from: "",
    to: "",
    reason: "",
  });

  const pending = leaves.filter((l) => l.status === "pending");

  const filtered = leaves.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.dept.toLowerCase().includes(search.toLowerCase()) ||
      l.type.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAction = (id, action) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: action } : l)));
  };

  const handleApply = () => {
    if (!form.name || !form.from || !form.to) return;
    const days =
      Math.ceil((new Date(form.to) - new Date(form.from)) / 86400000) + 1;
    setLeaves([
      {
        id: `LV${String(leaves.length + 1).padStart(3, "0")}`,
        empId: "EMP999",
        ...form,
        days,
        status: "pending",
        appliedOn: new Date().toISOString().split("T")[0],
      },
      ...leaves,
    ]);
    setForm({
      name: "",
      dept: "",
      type: "Annual",
      from: "",
      to: "",
      reason: "",
    });
    setModal(false);
  };

  const typeColors = { Annual: "#6366f1", Sick: "#ef4444", Casual: "#f59e0b" };

  return (
    <ModuleLayout
      title="Leave Management"
      icon="📅"
      color={COLOR}
      actions={
        <Btn color={COLOR} onClick={() => setModal(true)}>
          + Apply Leave
        </Btn>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📋"
          label="Total Requests"
          value={leaves.length}
          color={COLOR}
        />
        <StatCard
          icon="⏳"
          label="Pending"
          value={pending.length}
          sub="Awaiting approval"
          color="#f59e0b"
        />
        <StatCard
          icon="✅"
          label="Approved"
          value={leaves.filter((l) => l.status === "approved").length}
          color="#10b981"
        />
        <StatCard
          icon="❌"
          label="Rejected"
          value={leaves.filter((l) => l.status === "rejected").length}
          color="#ef4444"
        />
      </div>

      <Tabs
        tabs={[
          { id: "requests", label: "📋 Requests" },
          { id: "balance", label: "📊 Leave Balance" },
          { id: "calendar", label: "📅 Calendar" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

      {tab === "requests" && (
        <Table
          headers={[
            "ID",
            "Employee",
            "Dept",
            "Type",
            "From",
            "To",
            "Days",
            "Reason",
            "Status",
            "Action",
          ]}
        >
          {filtered.map((l) => (
            <TR key={l.id}>
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#67e8f9" }}
                >
                  {l.id}
                </span>
              </TD>
              <TD>
                <div className="flex items-center gap-2">
                  <Avatar name={l.name} />
                  <span className="text-white text-xs font-medium">
                    {l.name}
                  </span>
                </div>
              </TD>
              <TD className="text-xs">{l.dept}</TD>
              <TD>
                <span
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{
                    background: `${typeColors[l.type] || COLOR}22`,
                    color: typeColors[l.type] || COLOR,
                  }}
                >
                  {l.type}
                </span>
              </TD>
              <TD className="text-xs">{l.from}</TD>
              <TD className="text-xs">{l.to}</TD>
              <TD className="text-center text-xs font-bold text-white">
                {l.days}
              </TD>
              <TD className="text-xs max-w-[120px] truncate">{l.reason}</TD>
              <TD>
                <StatusBadge status={l.status} />
              </TD>
              <TD>
                {l.status === "pending" && (
                  <div className="flex gap-1">
                    <Btn
                      size="sm"
                      variant="success"
                      onClick={() => handleAction(l.id, "approved")}
                    >
                      ✓
                    </Btn>
                    <Btn
                      size="sm"
                      variant="danger"
                      onClick={() => handleAction(l.id, "rejected")}
                    >
                      ✗
                    </Btn>
                  </div>
                )}
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "balance" && (
        <div className="grid grid-cols-1 gap-4">
          {balances.map((b) => (
            <div
              key={b.empId}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={b.name} size="lg" />
                <p className="text-white font-semibold">{b.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { type: "Annual", data: b.annual, color: "#6366f1" },
                  { type: "Sick", data: b.sick, color: "#ef4444" },
                  { type: "Casual", data: b.casual, color: "#f59e0b" },
                ].map((item) => (
                  <div key={item.type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: item.color }}>{item.type}</span>
                      <span className="text-white">
                        {item.data.remaining}/{item.data.total}
                      </span>
                    </div>
                    <ProgressBar
                      value={item.data.remaining}
                      max={item.data.total}
                      color={item.color}
                    />
                    <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                      {item.data.used} used
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "calendar" && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-white font-semibold mb-4">July 2024 — On Leave</p>
          <div className="space-y-3">
            {leaves
              .filter((l) => l.status === "approved")
              .map((l) => (
                <div
                  key={l.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: `${typeColors[l.type] || COLOR}15`,
                    border: `1px solid ${typeColors[l.type] || COLOR}33`,
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg">
                    📅
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{l.name}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>
                      {l.from} → {l.to} · {l.days} days · {l.type}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: typeColors[l.type] || COLOR }}
                  >
                    {l.dept}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="📅 Apply for Leave"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Employee Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Input
              label="Department"
              value={form.dept}
              onChange={(v) => setForm({ ...form, dept: v })}
            />
          </div>
          <Select
            label="Leave Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v })}
            options={["Annual", "Sick", "Casual"].map((t) => ({
              value: t,
              label: t,
            }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="From Date"
              type="date"
              value={form.from}
              onChange={(v) => setForm({ ...form, from: v })}
              required
            />
            <Input
              label="To Date"
              type="date"
              value={form.to}
              onChange={(v) => setForm({ ...form, to: v })}
              required
            />
          </div>
          {form.from && form.to && (
            <div
              className="rounded-xl p-3 text-sm"
              style={{ background: `${COLOR}15`, color: "#67e8f9" }}
            >
              Duration:{" "}
              {Math.ceil((new Date(form.to) - new Date(form.from)) / 86400000) +
                1}{" "}
              days
            </div>
          )}
          <Input
            label="Reason"
            value={form.reason}
            onChange={(v) => setForm({ ...form, reason: v })}
            placeholder="Brief reason..."
          />
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn color={COLOR} onClick={handleApply}>
              Submit Request
            </Btn>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}
