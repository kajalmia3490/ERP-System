// ================================================================
// SCHOOL MANAGEMENT
// ================================================================
import { useState } from "react";
import {
  schoolStudents,
  schoolTeachers,
  inventoryItems,
  stockMovements,
  accountingEntries,
  chartOfAccounts,
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

// ── SCHOOL ────────────────────────────────────────────────────
export function SchoolManagement() {
  const COLOR = "#f59e0b";
  const [students, setStudents] = useState(schoolStudents);
  const [teachers] = useState(schoolTeachers);
  const [tab, setTab] = useState("students");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    class: "",
    section: "A",
    roll: "",
    father: "",
    phone: "",
    fees: "paid",
  });

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.class.includes(search),
  );

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    if (!form.name || !form.class) return;
    setStudents([
      {
        id: `S${String(students.length + 1).padStart(3, "0")}`,
        ...form,
        class: form.class,
        roll: Number(form.roll),
        marks: 0,
      },
      ...students,
    ]);
    setForm({
      name: "",
      class: "",
      section: "A",
      roll: "",
      father: "",
      phone: "",
      fees: "paid",
    });
    setModal(false);
  };

  return (
    <ModuleLayout
      title="School Management"
      icon="🏫"
      color={COLOR}
      actions={
        tab === "students" && (
          <Btn color={COLOR} onClick={() => setModal(true)}>
            + Add Student
          </Btn>
        )
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👦"
          label="Total Students"
          value={students.length}
          color={COLOR}
        />
        <StatCard
          icon="✅"
          label="Fees Paid"
          value={students.filter((s) => s.fees === "paid").length}
          color="#10b981"
        />
        <StatCard
          icon="⚠️"
          label="Fees Due"
          value={students.filter((s) => s.fees === "due").length}
          color="#ef4444"
        />
        <StatCard
          icon="👨‍🏫"
          label="Teachers"
          value={teachers.length}
          color="#8b5cf6"
        />
      </div>

      <Tabs
        tabs={[
          { id: "students", label: "👦 Students" },
          { id: "teachers", label: "👨‍🏫 Teachers" },
          { id: "results", label: "📊 Results" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

      {tab === "students" && (
        <Table
          headers={[
            "ID",
            "Name",
            "Class/Sec",
            "Roll",
            "Father",
            "Phone",
            "Fees",
            "Action",
          ]}
        >
          {filtered.map((s) => (
            <TR key={s.id}>
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#fcd34d" }}
                >
                  {s.id}
                </span>
              </TD>
              <TD>
                <div className="flex items-center gap-2">
                  <Avatar name={s.name} />
                  <span className="text-white text-xs font-medium">
                    {s.name}
                  </span>
                </div>
              </TD>
              <TD className="text-xs">
                Class {s.class} / {s.section}
              </TD>
              <TD className="text-center text-xs font-mono">{s.roll}</TD>
              <TD className="text-xs">{s.father}</TD>
              <TD className="text-xs">{s.phone}</TD>
              <TD>
                <StatusBadge status={s.fees} />
              </TD>
              <TD>
                {s.fees === "due" && (
                  <Btn
                    size="sm"
                    variant="success"
                    onClick={() =>
                      setStudents(
                        students.map((st) =>
                          st.id === s.id ? { ...st, fees: "paid" } : st,
                        ),
                      )
                    }
                  >
                    Mark Paid
                  </Btn>
                )}
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "teachers" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={t.name} size="lg" />
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-xs" style={{ color: COLOR }}>
                    {t.subject}
                  </p>
                  <p className="text-xs" style={{ color: "#64748b" }}>
                    {t.experience} experience
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div
                className="flex justify-between text-xs pt-3"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  color: "#94a3b8",
                }}
              >
                <span>Classes: {t.class}</span>
                <span className="font-semibold text-white">
                  {taka(t.salary)}/month
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "results" && (
        <Table headers={["Student", "Class", "Marks", "Grade", "Performance"]}>
          {[...students]
            .sort((a, b) => b.marks - a.marks)
            .map((s) => {
              const grade =
                s.marks >= 90
                  ? "A+"
                  : s.marks >= 80
                    ? "A"
                    : s.marks >= 70
                      ? "B"
                      : s.marks >= 60
                        ? "C"
                        : "D";
              const gradeColor =
                s.marks >= 80
                  ? "#10b981"
                  : s.marks >= 60
                    ? "#f59e0b"
                    : "#ef4444";
              return (
                <TR key={s.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Avatar name={s.name} />
                      <span className="text-white text-xs">{s.name}</span>
                    </div>
                  </TD>
                  <TD className="text-xs">
                    Class {s.class} - {s.section}
                  </TD>
                  <TD>
                    <span className="font-bold text-white">{s.marks}</span>
                    <span className="text-xs" style={{ color: "#64748b" }}>
                      /100
                    </span>
                  </TD>
                  <TD>
                    <span className="font-bold" style={{ color: gradeColor }}>
                      {grade}
                    </span>
                  </TD>
                  <TD className="w-32">
                    <ProgressBar value={s.marks} max={100} color={gradeColor} />
                  </TD>
                </TR>
              );
            })}
        </Table>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="🏫 Add New Student"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Student Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Input
              label="Roll Number"
              type="number"
              value={form.roll}
              onChange={(v) => setForm({ ...form, roll: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Class"
              value={form.class}
              onChange={(v) => setForm({ ...form, class: v })}
              options={[
                { value: "", label: "Select class" },
                ...["6", "7", "8", "9", "10"].map((c) => ({
                  value: c,
                  label: `Class ${c}`,
                })),
              ]}
            />
            <Select
              label="Section"
              value={form.section}
              onChange={(v) => setForm({ ...form, section: v })}
              options={["A", "B", "C"].map((s) => ({
                value: s,
                label: `Section ${s}`,
              }))}
            />
          </div>
          <Input
            label="Father's Name"
            value={form.father}
            onChange={(v) => setForm({ ...form, father: v })}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Select
            label="Fee Status"
            value={form.fees}
            onChange={(v) => setForm({ ...form, fees: v })}
            options={[
              { value: "paid", label: "Paid" },
              { value: "due", label: "Due" },
            ]}
          />
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn color={COLOR} onClick={handleAdd}>
              Add Student
            </Btn>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}

// ── ACCOUNTING ────────────────────────────────────────────────
export function Accounting() {
  const COLOR = "#10b981";
  const [entries, setEntries] = useState(accountingEntries);
  const [accounts] = useState(chartOfAccounts);
  const [tab, setTab] = useState("journal");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    date: "",
    description: "",
    account: "",
    debit: "",
    credit: "",
    category: "Asset",
  });

  const totalIncome = entries
    .filter((e) => e.credit > 0)
    .reduce((s, e) => s + e.credit, 0);
  const totalExpense = entries
    .filter((e) => e.debit > 0 && e.category === "Expense")
    .reduce((s, e) => s + e.debit, 0);

  const filtered = entries.filter(
    (e) =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.account.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    if (!form.description || !form.account) return;
    setEntries([
      {
        id: `JE${String(entries.length + 1).padStart(3, "0")}`,
        ...form,
        debit: Number(form.debit) || 0,
        credit: Number(form.credit) || 0,
        date: form.date || new Date().toISOString().split("T")[0],
      },
      ...entries,
    ]);
    setForm({
      date: "",
      description: "",
      account: "",
      debit: "",
      credit: "",
      category: "Asset",
    });
    setModal(false);
  };

  const acctTypeColor = {
    Asset: "#3b82f6",
    Liability: "#ef4444",
    Equity: "#8b5cf6",
    Income: "#10b981",
    Expense: "#f59e0b",
  };

  return (
    <ModuleLayout
      title="Accounting"
      icon="📊"
      color={COLOR}
      actions={
        <Btn color={COLOR} onClick={() => setModal(true)}>
          + Add Journal Entry
        </Btn>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📈"
          label="Total Income"
          value={taka(totalIncome)}
          sub="This period"
          color={COLOR}
        />
        <StatCard
          icon="📉"
          label="Total Expense"
          value={taka(totalExpense)}
          color="#ef4444"
        />
        <StatCard
          icon="💎"
          label="Net Balance"
          value={taka(totalIncome - totalExpense)}
          color="#6366f1"
        />
        <StatCard
          icon="📋"
          label="Journal Entries"
          value={entries.length}
          color="#f59e0b"
        />
      </div>

      <Tabs
        tabs={[
          { id: "journal", label: "📒 Journal" },
          { id: "accounts", label: "📂 Chart of Accounts" },
          { id: "summary", label: "📊 Summary" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

      {tab === "journal" && (
        <Table
          headers={[
            "Entry ID",
            "Date",
            "Description",
            "Account",
            "Category",
            "Debit (৳)",
            "Credit (৳)",
          ]}
        >
          {filtered.map((e) => (
            <TR key={e.id}>
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#6ee7b7" }}
                >
                  {e.id}
                </span>
              </TD>
              <TD className="text-xs">{e.date}</TD>
              <TD className="text-xs text-white">{e.description}</TD>
              <TD className="text-xs">{e.account}</TD>
              <TD>
                <span
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{
                    background: `${acctTypeColor[e.category]}22`,
                    color: acctTypeColor[e.category],
                  }}
                >
                  {e.category}
                </span>
              </TD>
              <TD className="text-xs font-mono">
                {e.debit > 0 ? taka(e.debit) : "—"}
              </TD>
              <TD className="text-xs font-mono">
                {e.credit > 0 ? (
                  <span style={{ color: "#10b981" }}>{taka(e.credit)}</span>
                ) : (
                  "—"
                )}
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "accounts" && (
        <Table headers={["Code", "Account Name", "Type", "Balance"]}>
          {accounts.map((a) => (
            <TR key={a.code}>
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#6ee7b7" }}
                >
                  {a.code}
                </span>
              </TD>
              <TD className="text-white text-xs font-medium">{a.name}</TD>
              <TD>
                <span
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{
                    background: `${acctTypeColor[a.type]}22`,
                    color: acctTypeColor[a.type],
                  }}
                >
                  {a.type}
                </span>
              </TD>
              <TD>
                <span className="font-semibold text-white text-xs">
                  {taka(a.balance)}
                </span>
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "summary" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(
            accounts.reduce((acc, a) => {
              acc[a.type] = (acc[a.type] || 0) + a.balance;
              return acc;
            }, {}),
          ).map(([type, total]) => (
            <div
              key={type}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-sm font-semibold"
                  style={{ color: acctTypeColor[type] }}
                >
                  {type}
                </span>
                <span className="text-white font-bold">{taka(total)}</span>
              </div>
              {accounts
                .filter((a) => a.type === type)
                .map((a) => (
                  <div
                    key={a.code}
                    className="flex justify-between py-1.5 text-xs border-t"
                    style={{
                      borderColor: "rgba(255,255,255,0.05)",
                      color: "#94a3b8",
                    }}
                  >
                    <span>{a.name}</span>
                    <span style={{ color: acctTypeColor[type] }}>
                      {taka(a.balance)}
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="📒 New Journal Entry"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => setForm({ ...form, date: v })}
            />
            <Select
              label="Category"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
              options={[
                "Asset",
                "Liability",
                "Equity",
                "Income",
                "Expense",
              ].map((c) => ({ value: c, label: c }))}
            />
          </div>
          <Input
            label="Description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            required
          />
          <Input
            label="Account"
            value={form.account}
            onChange={(v) => setForm({ ...form, account: v })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Debit (৳)"
              type="number"
              value={form.debit}
              onChange={(v) => setForm({ ...form, debit: v })}
              placeholder="0"
            />
            <Input
              label="Credit (৳)"
              type="number"
              value={form.credit}
              onChange={(v) => setForm({ ...form, credit: v })}
              placeholder="0"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn color={COLOR} onClick={handleAdd}>
              Post Entry
            </Btn>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}

// ── INVENTORY ─────────────────────────────────────────────────
export function Inventory() {
  const COLOR = "#3b82f6";
  const [items, setItems] = useState(inventoryItems);
  const [movements] = useState(stockMovements);
  const [tab, setTab] = useState("items");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "Piece",
    stock: "",
    reorder: "",
    price: "",
    supplier: "",
    warehouse: "WH-1",
  });

  const lowStock = items.filter((i) => i.stock <= i.reorder);

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    if (!form.name) return;
    setItems([
      {
        id: `ITM${String(items.length + 1).padStart(3, "0")}`,
        ...form,
        stock: Number(form.stock),
        reorder: Number(form.reorder),
        price: Number(form.price),
      },
      ...items,
    ]);
    setForm({
      name: "",
      category: "",
      unit: "Piece",
      stock: "",
      reorder: "",
      price: "",
      supplier: "",
      warehouse: "WH-1",
    });
    setModal(false);
  };

  const catColors = {
    Food: "#10b981",
    Stationery: "#f59e0b",
    Electronics: "#3b82f6",
    Furniture: "#8b5cf6",
    Medical: "#ec4899",
  };

  return (
    <ModuleLayout
      title="Inventory Management"
      icon="📦"
      color={COLOR}
      actions={
        <Btn color={COLOR} onClick={() => setModal(true)}>
          + Add Item
        </Btn>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📦"
          label="Total Items"
          value={items.length}
          color={COLOR}
        />
        <StatCard
          icon="⚠️"
          label="Low Stock"
          value={lowStock.length}
          sub="Need reorder"
          color="#ef4444"
        />
        <StatCard
          icon="💰"
          label="Stock Value"
          value={taka(items.reduce((s, i) => s + i.stock * i.price, 0))}
          color="#10b981"
        />
        <StatCard icon="🏪" label="Warehouses" value={3} color="#f59e0b" />
      </div>

      <Tabs
        tabs={[
          { id: "items", label: "📦 Items" },
          { id: "lowstock", label: `⚠️ Low Stock (${lowStock.length})` },
          { id: "movements", label: "🔄 Movements" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

      {(tab === "items" || tab === "lowstock") && (
        <Table
          headers={[
            "Item ID",
            "Name",
            "Category",
            "Unit",
            "Stock",
            "Reorder Level",
            "Unit Price",
            "Supplier",
            "WH",
            "Status",
          ]}
        >
          {(tab === "lowstock" ? lowStock : filtered).map((i) => {
            const isLow = i.stock <= i.reorder;
            return (
              <TR key={i.id}>
                <TD>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "#93c5fd" }}
                  >
                    {i.id}
                  </span>
                </TD>
                <TD className="text-white text-xs font-medium">{i.name}</TD>
                <TD>
                  <span
                    className="text-xs px-2 py-0.5 rounded-md"
                    style={{
                      background: `${catColors[i.category] || COLOR}22`,
                      color: catColors[i.category] || COLOR,
                    }}
                  >
                    {i.category}
                  </span>
                </TD>
                <TD className="text-xs">{i.unit}</TD>
                <TD>
                  <span
                    className="font-bold"
                    style={{ color: isLow ? "#ef4444" : "#10b981" }}
                  >
                    {i.stock}
                  </span>
                </TD>
                <TD className="text-xs" style={{ color: "#64748b" }}>
                  {i.reorder}
                </TD>
                <TD className="text-xs font-mono">{taka(i.price)}</TD>
                <TD className="text-xs">{i.supplier}</TD>
                <TD className="text-xs font-mono">{i.warehouse}</TD>
                <TD>
                  <StatusBadge status={isLow ? "low" : "normal"} />
                </TD>
              </TR>
            );
          })}
        </Table>
      )}

      {tab === "movements" && (
        <Table
          headers={["Ref", "Item", "Type", "Qty", "Date", "Warehouse", "By"]}
        >
          {movements.map((m) => (
            <TR key={m.id}>
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#93c5fd" }}
                >
                  {m.ref}
                </span>
              </TD>
              <TD className="text-white text-xs">{m.item}</TD>
              <TD>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background:
                      m.type === "IN"
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(239,68,68,0.15)",
                    color: m.type === "IN" ? "#10b981" : "#ef4444",
                  }}
                >
                  {m.type === "IN" ? "↓ IN" : "↑ OUT"}
                </span>
              </TD>
              <TD className="font-bold text-white text-xs">{m.qty}</TD>
              <TD className="text-xs">{m.date}</TD>
              <TD className="text-xs font-mono">{m.warehouse}</TD>
              <TD className="text-xs">{m.by}</TD>
            </TR>
          ))}
        </Table>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="📦 Add Inventory Item"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Item Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Input
              label="Category"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Stock Qty"
              type="number"
              value={form.stock}
              onChange={(v) => setForm({ ...form, stock: v })}
            />
            <Input
              label="Reorder Level"
              type="number"
              value={form.reorder}
              onChange={(v) => setForm({ ...form, reorder: v })}
            />
            <Input
              label="Unit Price (৳)"
              type="number"
              value={form.price}
              onChange={(v) => setForm({ ...form, price: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Supplier"
              value={form.supplier}
              onChange={(v) => setForm({ ...form, supplier: v })}
            />
            <Select
              label="Warehouse"
              value={form.warehouse}
              onChange={(v) => setForm({ ...form, warehouse: v })}
              options={["WH-1", "WH-2", "WH-3"].map((w) => ({
                value: w,
                label: w,
              }))}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn color={COLOR} onClick={handleAdd}>
              Add Item
            </Btn>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}
