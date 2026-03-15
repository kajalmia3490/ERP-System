import { useState } from "react";
import {
  stockMovements,
  inventoryItems,
  salesOrders,
  customers,
  purchaseOrders,
  vendors,
  systemUsers,
  roles,
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

// ── STOCK MANAGEMENT ──────────────────────────────────────────
export function StockManagement() {
  const COLOR = "#84cc16";
  const [movements, setMovements] = useState(stockMovements);
  const [items] = useState(inventoryItems);
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    item: "",
    type: "IN",
    qty: "",
    warehouse: "WH-1",
    ref: "",
    by: "",
  });

  const lowItems = items.filter((i) => i.stock <= i.reorder);
  const totalValue = items.reduce((s, i) => s + i.stock * i.price, 0);

  const handleAdd = () => {
    if (!form.item || !form.qty) return;
    setMovements([
      {
        id: `SM${String(movements.length + 1).padStart(3, "0")}`,
        ...form,
        qty: Number(form.qty),
        date: new Date().toISOString().split("T")[0],
      },
      ...movements,
    ]);
    setForm({
      item: "",
      type: "IN",
      qty: "",
      warehouse: "WH-1",
      ref: "",
      by: "",
    });
    setModal(false);
  };

  const filteredMov = movements.filter(
    (m) =>
      m.item.toLowerCase().includes(search.toLowerCase()) ||
      m.ref.toLowerCase().includes(search.toLowerCase()),
  );

  const warehouseSummary = ["WH-1", "WH-2", "WH-3"].map((wh) => ({
    name: wh,
    items: items.filter((i) => i.warehouse === wh).length,
    value: items
      .filter((i) => i.warehouse === wh)
      .reduce((s, i) => s + i.stock * i.price, 0),
  }));

  return (
    <ModuleLayout
      title="Stock Management"
      icon="🏪"
      color={COLOR}
      actions={
        <Btn color={COLOR} onClick={() => setModal(true)}>
          + Stock Movement
        </Btn>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📦"
          label="Total SKUs"
          value={items.length}
          color={COLOR}
        />
        <StatCard
          icon="⚠️"
          label="Low Stock"
          value={lowItems.length}
          sub="Need reorder"
          color="#ef4444"
        />
        <StatCard
          icon="💰"
          label="Total Value"
          value={taka(totalValue)}
          color="#10b981"
        />
        <StatCard
          icon="🔄"
          label="Movements"
          value={movements.length}
          sub="This month"
          color="#3b82f6"
        />
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "📊 Overview" },
          { id: "movements", label: "🔄 Movements" },
          { id: "warehouses", label: "🏭 Warehouses" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

      {tab === "overview" && (
        <div className="space-y-4">
          {/* Low stock alerts */}
          {lowItems.length > 0 && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <p className="text-red-400 font-semibold text-sm mb-3">
                ⚠️ Low Stock Alerts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lowItems.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between p-2.5 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.08)" }}
                  >
                    <span className="text-white text-xs">{i.name}</span>
                    <span className="text-red-400 text-xs font-bold">
                      {i.stock} left (min: {i.reorder})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Table
            headers={[
              "Item",
              "Category",
              "Current Stock",
              "Reorder Level",
              "Unit Price",
              "Total Value",
              "Status",
            ]}
          >
            {items
              .filter((i) =>
                i.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((i) => {
                const isLow = i.stock <= i.reorder;
                return (
                  <TR key={i.id}>
                    <TD className="text-white text-xs font-medium">{i.name}</TD>
                    <TD className="text-xs">{i.category}</TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold text-xs"
                          style={{ color: isLow ? "#ef4444" : "#10b981" }}
                        >
                          {i.stock}
                        </span>
                        <div className="w-16">
                          <ProgressBar
                            value={i.stock}
                            max={i.stock + i.reorder}
                            color={isLow ? "#ef4444" : "#10b981"}
                          />
                        </div>
                      </div>
                    </TD>
                    <TD className="text-xs" style={{ color: "#64748b" }}>
                      {i.reorder}
                    </TD>
                    <TD className="text-xs font-mono">{taka(i.price)}</TD>
                    <TD className="text-xs font-semibold text-white">
                      {taka(i.stock * i.price)}
                    </TD>
                    <TD>
                      <StatusBadge status={isLow ? "low" : "normal"} />
                    </TD>
                  </TR>
                );
              })}
          </Table>
        </div>
      )}

      {tab === "movements" && (
        <Table
          headers={["Ref", "Item", "Type", "Qty", "Date", "Warehouse", "By"]}
        >
          {filteredMov.map((m) => (
            <TR key={m.id}>
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#bef264" }}
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
              <TD className="font-bold text-white">{m.qty}</TD>
              <TD className="text-xs">{m.date}</TD>
              <TD className="text-xs font-mono">{m.warehouse}</TD>
              <TD className="text-xs">{m.by}</TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "warehouses" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {warehouseSummary.map((w) => (
            <div
              key={w.name}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="text-3xl mb-3">🏭</div>
              <p className="text-white font-bold text-lg">{w.name}</p>
              <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                {w.items} SKUs stored
              </p>
              <p className="text-white font-semibold mt-3">{taka(w.value)}</p>
              <p className="text-xs" style={{ color: "#64748b" }}>
                Inventory value
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="🔄 Add Stock Movement"
      >
        <div className="space-y-4">
          <Select
            label="Item"
            value={form.item}
            onChange={(v) => setForm({ ...form, item: v })}
            options={[
              { value: "", label: "Select item" },
              ...items.map((i) => ({ value: i.name, label: i.name })),
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              value={form.type}
              onChange={(v) => setForm({ ...form, type: v })}
              options={[
                { value: "IN", label: "↓ Stock IN" },
                { value: "OUT", label: "↑ Stock OUT" },
              ]}
            />
            <Input
              label="Quantity"
              type="number"
              value={form.qty}
              onChange={(v) => setForm({ ...form, qty: v })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Warehouse"
              value={form.warehouse}
              onChange={(v) => setForm({ ...form, warehouse: v })}
              options={["WH-1", "WH-2", "WH-3"].map((w) => ({
                value: w,
                label: w,
              }))}
            />
            <Input
              label="Reference"
              value={form.ref}
              onChange={(v) => setForm({ ...form, ref: v })}
              placeholder="PO/SO number"
            />
          </div>
          <Input
            label="Handled By"
            value={form.by}
            onChange={(v) => setForm({ ...form, by: v })}
          />
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn color={COLOR} onClick={handleAdd}>
              Record Movement
            </Btn>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}

// ── SALES MANAGEMENT ──────────────────────────────────────────
export function SalesManagement() {
  const COLOR = "#ef4444";
  const [orders, setOrders] = useState(salesOrders);
  const [customerList] = useState(customers);
  const [tab, setTab] = useState("orders");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    customer: "",
    items: "",
    amount: "",
    salesperson: "",
  });

  const totalRevenue = orders.reduce((s, o) => s + o.paid, 0);
  const totalDue = orders.reduce((s, o) => s + o.due, 0);

  const filtered = orders.filter(
    (o) =>
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    if (!form.customer || !form.amount) return;
    setOrders([
      {
        id: `INV${String(orders.length + 1).padStart(3, "0")}`,
        customer: form.customer,
        date: new Date().toISOString().split("T")[0],
        items: Number(form.items) || 1,
        amount: Number(form.amount),
        paid: 0,
        due: Number(form.amount),
        status: "unpaid",
        salesperson: form.salesperson,
      },
      ...orders,
    ]);
    setForm({ customer: "", items: "", amount: "", salesperson: "" });
    setModal(false);
  };

  return (
    <ModuleLayout
      title="Sales Management"
      icon="📈"
      color={COLOR}
      actions={
        <Btn color={COLOR} onClick={() => setModal(true)}>
          + New Invoice
        </Btn>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📊"
          label="Total Orders"
          value={orders.length}
          color={COLOR}
        />
        <StatCard
          icon="✅"
          label="Revenue Collected"
          value={taka(totalRevenue)}
          color="#10b981"
        />
        <StatCard
          icon="⚠️"
          label="Total Due"
          value={taka(totalDue)}
          color="#f59e0b"
        />
        <StatCard
          icon="👥"
          label="Customers"
          value={customerList.length}
          color="#3b82f6"
        />
      </div>

      <Tabs
        tabs={[
          { id: "orders", label: "📋 Invoices" },
          { id: "customers", label: "👥 Customers" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

      {tab === "orders" && (
        <Table
          headers={[
            "Invoice",
            "Customer",
            "Date",
            "Items",
            "Amount",
            "Paid",
            "Due",
            "Status",
            "Salesperson",
          ]}
        >
          {filtered.map((o) => (
            <TR key={o.id}>
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#fca5a5" }}
                >
                  {o.id}
                </span>
              </TD>
              <TD className="text-white text-xs font-medium">{o.customer}</TD>
              <TD className="text-xs">{o.date}</TD>
              <TD className="text-center text-xs">{o.items}</TD>
              <TD className="text-xs font-mono">{taka(o.amount)}</TD>
              <TD className="text-xs font-mono" style={{ color: "#10b981" }}>
                {taka(o.paid)}
              </TD>
              <TD
                className="text-xs font-mono"
                style={{ color: o.due > 0 ? "#f59e0b" : "#10b981" }}
              >
                {o.due > 0 ? taka(o.due) : "—"}
              </TD>
              <TD>
                <StatusBadge status={o.status} />
              </TD>
              <TD className="text-xs">{o.salesperson}</TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "customers" && (
        <Table
          headers={[
            "Customer",
            "Phone",
            "Address",
            "Total Business",
            "Due",
            "",
          ]}
        >
          {customerList
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((c) => (
              <TR key={c.id}>
                <TD>
                  <div className="flex items-center gap-2">
                    <Avatar name={c.name} />
                    <div>
                      <p className="text-white text-xs font-medium">{c.name}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        {c.email}
                      </p>
                    </div>
                  </div>
                </TD>
                <TD className="text-xs">{c.phone}</TD>
                <TD className="text-xs">{c.address}</TD>
                <TD className="text-xs font-semibold text-white">
                  {taka(c.totalBusiness)}
                </TD>
                <TD
                  className="text-xs font-mono"
                  style={{ color: c.due > 0 ? "#f59e0b" : "#10b981" }}
                >
                  {c.due > 0 ? taka(c.due) : "Clear"}
                </TD>
                <TD>
                  <StatusBadge status={c.due > 0 ? "partial" : "paid"} />
                </TD>
              </TR>
            ))}
        </Table>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="📈 New Sales Invoice"
      >
        <div className="space-y-4">
          <Input
            label="Customer Name"
            value={form.customer}
            onChange={(v) => setForm({ ...form, customer: v })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="No. of Items"
              type="number"
              value={form.items}
              onChange={(v) => setForm({ ...form, items: v })}
            />
            <Input
              label="Total Amount (৳)"
              type="number"
              value={form.amount}
              onChange={(v) => setForm({ ...form, amount: v })}
              required
            />
          </div>
          <Input
            label="Salesperson"
            value={form.salesperson}
            onChange={(v) => setForm({ ...form, salesperson: v })}
          />
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn color={COLOR} onClick={handleAdd}>
              Create Invoice
            </Btn>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}

// ── PURCHASE ──────────────────────────────────────────────────
export function Purchase() {
  const COLOR = "#0ea5e9";
  const [pos, setPOs] = useState(purchaseOrders);
  const [vendorList] = useState(vendors);
  const [tab, setTab] = useState("orders");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ vendor: "", items: "", amount: "" });
  const { confirm, Dialog } = useConfirm();

  const totalPO = pos.reduce((s, p) => s + p.amount, 0);
  const totalPaid = pos.reduce((s, p) => s + p.paid, 0);

  const filtered = pos.filter(
    (p) =>
      p.vendor.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleApprove = async (id) => {
    const ok = await confirm("Approve this purchase order?");
    if (ok)
      setPOs(
        pos.map((p) =>
          p.id === id ? { ...p, status: "approved", approvedBy: "Admin" } : p,
        ),
      );
  };

  const handleAdd = () => {
    if (!form.vendor || !form.amount) return;
    setPOs([
      {
        id: `PO${String(pos.length + 1).padStart(3, "0")}`,
        vendor: form.vendor,
        date: new Date().toISOString().split("T")[0],
        items: Number(form.items) || 1,
        amount: Number(form.amount),
        paid: 0,
        due: Number(form.amount),
        status: "pending",
        approvedBy: "Pending",
      },
      ...pos,
    ]);
    setForm({ vendor: "", items: "", amount: "" });
    setModal(false);
  };

  return (
    <ModuleLayout
      title="Purchase Management"
      icon="🛒"
      color={COLOR}
      actions={
        <Btn color={COLOR} onClick={() => setModal(true)}>
          + New PO
        </Btn>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📋"
          label="Total POs"
          value={pos.length}
          color={COLOR}
        />
        <StatCard
          icon="⏳"
          label="Pending Approval"
          value={pos.filter((p) => p.status === "pending").length}
          color="#f59e0b"
        />
        <StatCard
          icon="💰"
          label="Total PO Value"
          value={taka(totalPO)}
          color="#10b981"
        />
        <StatCard
          icon="⚠️"
          label="Outstanding Due"
          value={taka(pos.reduce((s, p) => s + p.due, 0))}
          color="#ef4444"
        />
      </div>

      <Tabs
        tabs={[
          { id: "orders", label: "📋 Purchase Orders" },
          { id: "vendors", label: "🤝 Vendors" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

      {tab === "orders" && (
        <Table
          headers={[
            "PO ID",
            "Vendor",
            "Date",
            "Items",
            "Amount",
            "Paid",
            "Due",
            "Status",
            "Approved By",
            "Action",
          ]}
        >
          {filtered.map((p) => (
            <TR key={p.id}>
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#7dd3fc" }}
                >
                  {p.id}
                </span>
              </TD>
              <TD className="text-white text-xs font-medium">{p.vendor}</TD>
              <TD className="text-xs">{p.date}</TD>
              <TD className="text-center text-xs">{p.items}</TD>
              <TD className="text-xs font-mono">{taka(p.amount)}</TD>
              <TD className="text-xs font-mono" style={{ color: "#10b981" }}>
                {taka(p.paid)}
              </TD>
              <TD
                className="text-xs font-mono"
                style={{ color: p.due > 0 ? "#f59e0b" : "#10b981" }}
              >
                {p.due > 0 ? taka(p.due) : "—"}
              </TD>
              <TD>
                <StatusBadge status={p.status} />
              </TD>
              <TD className="text-xs">{p.approvedBy}</TD>
              <TD>
                {p.status === "pending" && (
                  <Btn
                    size="sm"
                    variant="success"
                    onClick={() => handleApprove(p.id)}
                  >
                    Approve
                  </Btn>
                )}
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "vendors" && (
        <Table
          headers={[
            "Vendor",
            "Category",
            "Phone",
            "Address",
            "Total Purchase",
            "Due",
            "Rating",
          ]}
        >
          {vendorList
            .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
            .map((v) => (
              <TR key={v.id}>
                <TD>
                  <div className="flex items-center gap-2">
                    <Avatar name={v.name} />
                    <div>
                      <p className="text-white text-xs font-medium">{v.name}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        {v.email}
                      </p>
                    </div>
                  </div>
                </TD>
                <TD className="text-xs">{v.category}</TD>
                <TD className="text-xs">{v.phone}</TD>
                <TD className="text-xs">{v.address}</TD>
                <TD className="text-xs font-semibold text-white">
                  {taka(v.totalPurchase)}
                </TD>
                <TD
                  className="text-xs"
                  style={{ color: v.due > 0 ? "#f59e0b" : "#10b981" }}
                >
                  {v.due > 0 ? taka(v.due) : "Clear"}
                </TD>
                <TD>
                  <span className="text-yellow-400 text-xs">
                    {"★".repeat(Math.round(v.rating))}
                  </span>
                  <span className="text-xs ml-1" style={{ color: "#64748b" }}>
                    {v.rating}
                  </span>
                </TD>
              </TR>
            ))}
        </Table>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="🛒 New Purchase Order"
      >
        <div className="space-y-4">
          <Select
            label="Vendor"
            value={form.vendor}
            onChange={(v) => setForm({ ...form, vendor: v })}
            options={[
              { value: "", label: "Select vendor" },
              ...vendorList.map((v) => ({ value: v.name, label: v.name })),
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="No. of Items"
              type="number"
              value={form.items}
              onChange={(v) => setForm({ ...form, items: v })}
            />
            <Input
              label="Total Amount (৳)"
              type="number"
              value={form.amount}
              onChange={(v) => setForm({ ...form, amount: v })}
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn color={COLOR} onClick={handleAdd}>
              Create PO
            </Btn>
          </div>
        </div>
      </Modal>

      <Dialog />
    </ModuleLayout>
  );
}

// ── REPORTING ─────────────────────────────────────────────────
export function Reporting() {
  const COLOR = "#a855f7";
  const [tab, setTab] = useState("overview");

  const reports = [
    {
      id: 1,
      name: "Sales Summary Report",
      module: "Sales",
      generated: "2024-07-15",
      format: "PDF",
      size: "245 KB",
    },
    {
      id: 2,
      name: "Monthly P&L Statement",
      module: "Accounting",
      generated: "2024-07-14",
      format: "XLSX",
      size: "128 KB",
    },
    {
      id: 3,
      name: "Employee Attendance",
      module: "HR",
      generated: "2024-07-13",
      format: "PDF",
      size: "89 KB",
    },
    {
      id: 4,
      name: "Inventory Valuation",
      module: "Inventory",
      generated: "2024-07-12",
      format: "PDF",
      size: "312 KB",
    },
    {
      id: 5,
      name: "Payroll Register July",
      module: "Payroll",
      generated: "2024-07-11",
      format: "XLSX",
      size: "167 KB",
    },
    {
      id: 6,
      name: "Hotel Occupancy Report",
      module: "Hotel",
      generated: "2024-07-10",
      format: "PDF",
      size: "201 KB",
    },
  ];

  const moduleColors = {
    Sales: "#ef4444",
    Accounting: "#10b981",
    HR: "#8b5cf6",
    Inventory: "#3b82f6",
    Payroll: "#f97316",
    Hotel: "#6366f1",
  };
  const chartData = [
    { label: "Sales", value: 416, color: "#ef4444" },
    { label: "Accounting", value: 210, color: "#10b981" },
    { label: "HR", value: 180, color: "#8b5cf6" },
    { label: "Inventory", value: 150, color: "#3b82f6" },
    { label: "Payroll", value: 120, color: "#f97316" },
    { label: "Hotel", value: 95, color: "#6366f1" },
  ];
  const maxVal = Math.max(...chartData.map((d) => d.value));

  return (
    <ModuleLayout title="Reporting" icon="📋" color={COLOR}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📊" label="Total Reports" value="94" color={COLOR} />
        <StatCard icon="📅" label="Generated Today" value="6" color="#10b981" />
        <StatCard
          icon="📤"
          label="Exports"
          value="234"
          sub="This month"
          color="#3b82f6"
        />
        <StatCard
          icon="📁"
          label="Modules Covered"
          value="13"
          color="#f59e0b"
        />
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "📊 Overview" },
          { id: "reports", label: "📋 All Reports" },
          { id: "analytics", label: "📈 Analytics" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar chart */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3 className="text-white font-semibold mb-4">Reports by Module</h3>
            <div className="space-y-3">
              {chartData.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: d.color }}>{d.label}</span>
                    <span className="text-white">{d.value}</span>
                  </div>
                  <div
                    className="h-2 rounded-full"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.value / maxVal) * 100}%`,
                        background: d.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3 className="text-white font-semibold mb-4">Recent Reports</h3>
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{
                      background: `${moduleColors[r.module] || COLOR}22`,
                      color: moduleColors[r.module] || COLOR,
                    }}
                  >
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">
                      {r.name}
                    </p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      {r.generated} · {r.size}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-md"
                    style={{
                      background: `${moduleColors[r.module] || COLOR}22`,
                      color: moduleColors[r.module] || COLOR,
                    }}
                  >
                    {r.format}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "reports" && (
        <Table
          headers={[
            "Report Name",
            "Module",
            "Generated",
            "Format",
            "Size",
            "Action",
          ]}
        >
          {reports.map((r) => (
            <TR key={r.id}>
              <TD className="text-white text-xs font-medium">{r.name}</TD>
              <TD>
                <span
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{
                    background: `${moduleColors[r.module] || COLOR}22`,
                    color: moduleColors[r.module] || COLOR,
                  }}
                >
                  {r.module}
                </span>
              </TD>
              <TD className="text-xs">{r.generated}</TD>
              <TD className="text-xs font-mono">{r.format}</TD>
              <TD className="text-xs" style={{ color: "#64748b" }}>
                {r.size}
              </TD>
              <TD>
                <div className="flex gap-1">
                  <Btn size="sm" variant="secondary">
                    👁 View
                  </Btn>
                  <Btn size="sm" variant="secondary">
                    ⬇ Download
                  </Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "analytics" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: "💹",
              label: "Total Revenue",
              value: "৳12.4M",
              sub: "+18.5% vs last month",
              color: "#6366f1",
            },
            {
              icon: "📉",
              label: "Total Expenses",
              value: "৳8.1M",
              sub: "+6.2% vs last month",
              color: "#ef4444",
            },
            {
              icon: "💎",
              label: "Net Profit",
              value: "৳4.3M",
              sub: "+34.1% vs last month",
              color: "#10b981",
            },
            {
              icon: "👥",
              label: "Total Staff",
              value: "284",
              sub: "+12 this month",
              color: "#f59e0b",
            },
            {
              icon: "🏨",
              label: "Hotel Occupancy",
              value: "75%",
              sub: "96 of 128 rooms",
              color: "#8b5cf6",
            },
            {
              icon: "📦",
              label: "Inventory Value",
              value: "৳3.2M",
              sub: "3,847 items",
              color: "#3b82f6",
            },
            {
              icon: "🧑‍⚕️",
              label: "Hospital Patients",
              value: "47",
              sub: "4 departments",
              color: "#ec4899",
            },
            {
              icon: "🎓",
              label: "Students Enrolled",
              value: "1,240",
              sub: "All classes",
              color: "#f97316",
            },
          ].map((k, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="text-2xl mb-2">{k.icon}</div>
              <p className="text-white font-bold text-lg">{k.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                {k.label}
              </p>
              <p className="text-xs mt-1" style={{ color: k.color }}>
                {k.sub}
              </p>
            </div>
          ))}
        </div>
      )}
    </ModuleLayout>
  );
}

// ── USER MANAGEMENT ───────────────────────────────────────────
export function UserManagement() {
  const COLOR = "#64748b";
  const [users, setUsers] = useState(systemUsers);
  const [roleList] = useState(roles);
  const [tab, setTab] = useState("users");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "accountant",
    status: "active",
  });
  const { confirm, Dialog } = useConfirm();

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const r = roleList.find((r) => r.id === form.role);
    setUsers([
      {
        id: users.length + 1,
        ...form,
        permissions: r?.permissions || [],
        lastLogin: "Never",
        avatar: form.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      },
      ...users,
    ]);
    setForm({ name: "", email: "", role: "accountant", status: "active" });
    setModal(false);
  };

  const handleToggle = async (id) => {
    const u = users.find((u) => u.id === id);
    const ok = await confirm(
      `${u.status === "active" ? "Deactivate" : "Activate"} user "${u.name}"?`,
    );
    if (ok)
      setUsers(
        users.map((u) =>
          u.id === id
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u,
        ),
      );
  };

  const allPerms = [
    "hotel",
    "hospital",
    "school",
    "accounting",
    "inventory",
    "hr",
    "payroll",
    "leave",
    "stock",
    "sales",
    "purchase",
    "reporting",
    "user_management",
  ];

  return (
    <ModuleLayout
      title="User Management"
      icon="🔐"
      color={COLOR}
      actions={<Btn onClick={() => setModal(true)}>+ Add User</Btn>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Total Users"
          value={users.length}
          color={COLOR}
        />
        <StatCard
          icon="✅"
          label="Active"
          value={users.filter((u) => u.status === "active").length}
          color="#10b981"
        />
        <StatCard
          icon="🔴"
          label="Inactive"
          value={users.filter((u) => u.status === "inactive").length}
          color="#ef4444"
        />
        <StatCard
          icon="🎭"
          label="Roles"
          value={roleList.length}
          color="#8b5cf6"
        />
      </div>

      <Tabs
        tabs={[
          { id: "users", label: "👥 Users" },
          { id: "roles", label: "🎭 Roles & Permissions" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

      {tab === "users" && (
        <Table
          headers={[
            "User",
            "Role",
            "Permissions",
            "Status",
            "Last Login",
            "Action",
          ]}
        >
          {filtered.map((u) => {
            const r = roleList.find((r) => r.id === u.role);
            return (
              <TR key={u.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg,${r?.color || "#64748b"},${r?.color || "#94a3b8"})`,
                      }}
                    >
                      {u.avatar}
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">{u.name}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        {u.email}
                      </p>
                    </div>
                  </div>
                </TD>
                <TD>
                  <span
                    className="text-xs px-2 py-0.5 rounded-md capitalize"
                    style={{
                      background: `${r?.color || "#64748b"}22`,
                      color: r?.color || "#94a3b8",
                    }}
                  >
                    {u.role.replace(/_/g, " ")}
                  </span>
                </TD>
                <TD>
                  <div className="flex flex-wrap gap-1">
                    {(u.permissions[0] === "all"
                      ? ["All Access"]
                      : u.permissions.slice(0, 2)
                    ).map((p) => (
                      <span
                        key={p}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          color: "#94a3b8",
                        }}
                      >
                        {p}
                      </span>
                    ))}
                    {u.permissions[0] !== "all" && u.permissions.length > 2 && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: "#64748b",
                        }}
                      >
                        +{u.permissions.length - 2}
                      </span>
                    )}
                  </div>
                </TD>
                <TD>
                  <StatusBadge status={u.status} />
                </TD>
                <TD className="text-xs">{u.lastLogin}</TD>
                <TD>
                  <div className="flex gap-1">
                    <Btn
                      size="sm"
                      variant={u.status === "active" ? "danger" : "success"}
                      onClick={() => handleToggle(u.id)}
                    >
                      {u.status === "active" ? "Deactivate" : "Activate"}
                    </Btn>
                  </div>
                </TD>
              </TR>
            );
          })}
        </Table>
      )}

      {tab === "roles" && (
        <div className="space-y-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                  <th
                    className="px-4 py-3 text-left text-xs uppercase tracking-wider font-medium"
                    style={{ color: "#64748b" }}
                  >
                    Role
                  </th>
                  {allPerms.map((p) => (
                    <th
                      key={p}
                      className="px-2 py-3 text-center text-xs uppercase tracking-wider font-medium hidden lg:table-cell"
                      style={{
                        color: "#64748b",
                        writingMode: "vertical-lr",
                        transform: "rotate(180deg)",
                        height: "80px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roleList.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-md font-medium"
                        style={{ background: `${r.color}22`, color: r.color }}
                      >
                        {r.label}
                      </span>
                    </td>
                    {allPerms.map((p) => {
                      const has =
                        r.permissions.includes("all") ||
                        r.permissions.includes(p);
                      return (
                        <td
                          key={p}
                          className="px-2 py-3 text-center hidden lg:table-cell"
                        >
                          <span style={{ color: has ? "#10b981" : "#1e293b" }}>
                            {has ? "✓" : "✗"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: card view for roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
            {roleList.map((r) => (
              <div
                key={r.id}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p
                  className="font-semibold text-sm mb-2"
                  style={{ color: r.color }}
                >
                  {r.label}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(r.permissions[0] === "all" ? allPerms : r.permissions).map(
                    (p) => (
                      <span
                        key={p}
                        className="text-xs px-2 py-0.5 rounded-md"
                        style={{ background: `${r.color}22`, color: r.color }}
                      >
                        {p}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="🔐 Add New User"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(v) => setForm({ ...form, role: v })}
            options={roleList.map((r) => ({ value: r.id, label: r.label }))}
          />
          {form.role && (
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-xs mb-2" style={{ color: "#64748b" }}>
                Permissions for this role:
              </p>
              <div className="flex flex-wrap gap-1">
                {(
                  roleList.find((r) => r.id === form.role)?.permissions || []
                ).map((p) => (
                  <span
                    key={p}
                    className="text-xs px-2 py-0.5 rounded-md"
                    style={{
                      background: "rgba(99,102,241,0.2)",
                      color: "#a5b4fc",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Select
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v })}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={handleAdd}>Create User</Btn>
          </div>
        </div>
      </Modal>

      <Dialog />
    </ModuleLayout>
  );
}
