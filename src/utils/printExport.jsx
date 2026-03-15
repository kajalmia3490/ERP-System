// ================================================================
// PRINT / EXPORT UTILITIES
// Uses browser's built-in print API — no external PDF library needed
// For production: integrate jsPDF or Puppeteer on the backend
// ================================================================

// ── Generate print-ready HTML ─────────────────────────────────
const printStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; color: #0f172a; background: white; font-size: 13px; }
  .page { max-width: 794px; margin: 0 auto; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
  .logo { width: 48px; height: 48px; background: linear-gradient(135deg,#6366f1,#a855f7); border-radius: 12px;
          display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 22px; }
  .company-name { font-size: 20px; font-weight: 700; color: #0f172a; }
  .doc-title { font-size: 24px; font-weight: 700; color: #6366f1; margin-bottom: 4px; }
  .doc-meta { color: #64748b; font-size: 12px; }
  .divider { height: 2px; background: linear-gradient(to right,#6366f1,#a855f7); margin: 20px 0; border-radius: 2px; }
  .thin-divider { height: 1px; background: #e2e8f0; margin: 12px 0; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .info-box { background: #f8fafc; border-radius: 10px; padding: 14px; border: 1px solid #e2e8f0; }
  .info-box h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px; }
  .info-box p { color: #0f172a; font-size: 13px; margin: 2px 0; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th { background: #6366f1; color: white; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 600; }
  th:last-child, td:last-child { text-align: right; }
  td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) { background: #f8fafc; }
  .total-row td { font-weight: 700; color: #6366f1; background: #eef2ff !important; font-size: 14px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-paid { background: #dcfce7; color: #16a34a; }
  .badge-pending { background: #fef9c3; color: #ca8a04; }
  .badge-unpaid { background: #fee2e2; color: #dc2626; }
  .summary-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 16px 0; }
  .summary-box { background: #f8fafc; border-radius: 8px; padding: 12px; text-align: center; border: 1px solid #e2e8f0; }
  .summary-box .val { font-size: 18px; font-weight: 700; color: #6366f1; }
  .summary-box .lbl { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; color: #94a3b8; font-size: 11px; }
  .sign-box { border-top: 1px solid #cbd5e1; padding-top: 8px; min-width: 150px; text-align: center; font-size: 11px; color: #64748b; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

const openPrintWindow = (html) => {
  const w = window.open("", "_blank", "width=900,height=700");
  w.document.write(
    `<!DOCTYPE html><html><head><title>ERP Print</title><style>${printStyles}</style></head><body>${html}</body></html>`,
  );
  w.document.close();
  setTimeout(() => {
    w.focus();
    w.print();
  }, 400);
};

// ── INVOICE ───────────────────────────────────────────────────
export const printInvoice = (invoice) => {
  const statusClass =
    { paid: "badge-paid", partial: "badge-pending", unpaid: "badge-unpaid" }[
      invoice.status
    ] || "badge-pending";
  const html = `
    <div class="page">
      <div class="header">
        <div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <div class="logo">E</div>
            <div>
              <div class="company-name">ERP System Ltd.</div>
              <div class="doc-meta">House 12, Road 4, Gulshan-1, Dhaka-1212</div>
              <div class="doc-meta">📞 01712345678 · ✉ info@erpsystem.com</div>
            </div>
          </div>
        </div>
        <div style="text-align:right">
          <div class="doc-title">INVOICE</div>
          <div class="doc-meta"># ${invoice.id}</div>
          <div class="doc-meta">Date: ${invoice.date}</div>
          <span class="badge ${statusClass}">${invoice.status?.toUpperCase()}</span>
        </div>
      </div>
      <div class="divider"></div>

      <div class="grid-2">
        <div class="info-box">
          <h4>Bill To</h4>
          <p><strong>${invoice.customer}</strong></p>
          <p>${invoice.address || "Dhaka, Bangladesh"}</p>
          <p>📞 ${invoice.phone || "—"}</p>
        </div>
        <div class="info-box">
          <h4>Invoice Details</h4>
          <p>Invoice No: <strong>${invoice.id}</strong></p>
          <p>Date: ${invoice.date}</p>
          <p>Salesperson: ${invoice.salesperson || "—"}</p>
          <p>Due Date: ${invoice.dueDate || invoice.date}</p>
        </div>
      </div>

      <table>
        <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
        <tbody>
          ${(
            invoice.lineItems || [
              {
                desc: "Products / Services",
                qty: invoice.items || 1,
                unitPrice: Math.round(invoice.amount / (invoice.items || 1)),
                total: invoice.amount,
              },
            ]
          )
            .map(
              (item, i) =>
                `<tr><td>${i + 1}</td><td>${item.desc}</td><td>${item.qty}</td><td>৳${Number(item.unitPrice).toLocaleString()}</td><td>৳${Number(item.total).toLocaleString()}</td></tr>`,
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr class="total-row"><td colspan="4">TOTAL AMOUNT</td><td>৳${Number(invoice.amount).toLocaleString()}</td></tr>
          ${invoice.paid ? `<tr><td colspan="4" style="color:#16a34a">Amount Paid</td><td style="color:#16a34a">৳${Number(invoice.paid).toLocaleString()}</td></tr>` : ""}
          ${invoice.due > 0 ? `<tr><td colspan="4" style="color:#dc2626">Balance Due</td><td style="color:#dc2626">৳${Number(invoice.due).toLocaleString()}</td></tr>` : ""}
        </tfoot>
      </table>

      <div class="info-box" style="margin-top:16px">
        <h4>Payment Instructions</h4>
        <p>Bank: Dhaka Bank Ltd. | Account: 1234-5678-9012 | Branch: Gulshan</p>
      </div>

      <div class="footer">
        <div>
          <p>Thank you for your business!</p>
          <p>ERP System Ltd. | BIN: 123456789</p>
        </div>
        <div class="sign-box">Authorized Signature</div>
      </div>
    </div>
  `;
  openPrintWindow(html);
};

// ── SALARY SLIP ───────────────────────────────────────────────
export const printSalarySlip = (record) => {
  const html = `
    <div class="page">
      <div class="header">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="logo">E</div>
          <div>
            <div class="company-name">ERP System Ltd.</div>
            <div class="doc-meta">House 12, Road 4, Gulshan-1, Dhaka</div>
          </div>
        </div>
        <div style="text-align:right">
          <div class="doc-title">SALARY SLIP</div>
          <div class="doc-meta">${record.month}</div>
          <div class="doc-meta">Ref: ${record.id}</div>
        </div>
      </div>
      <div class="divider"></div>

      <div class="grid-2">
        <div class="info-box">
          <h4>Employee Details</h4>
          <p>Name: <strong>${record.name}</strong></p>
          <p>ID: ${record.empId}</p>
          <p>Department: ${record.dept}</p>
        </div>
        <div class="info-box">
          <h4>Pay Period</h4>
          <p>Month: <strong>${record.month}</strong></p>
          <p>Payment Date: ${record.paidOn || "Pending"}</p>
          <p>Status: <span class="badge ${record.status === "paid" ? "badge-paid" : "badge-pending"}">${record.status?.toUpperCase()}</span></p>
        </div>
      </div>

      <div class="grid-2">
        <div>
          <h4 style="font-size:13px;font-weight:600;margin-bottom:10px;color:#6366f1">EARNINGS</h4>
          <table>
            <tr><td>Basic Salary</td><td>৳${Number(record.basic).toLocaleString()}</td></tr>
            <tr><td>House Allowance</td><td>৳${Math.round(record.allowance * 0.5).toLocaleString()}</td></tr>
            <tr><td>Medical Allowance</td><td>৳${Math.round(record.allowance * 0.3).toLocaleString()}</td></tr>
            <tr><td>Transport</td><td>৳${Math.round(record.allowance * 0.2).toLocaleString()}</td></tr>
            <tr class="total-row"><td>Gross Earnings</td><td>৳${(record.basic + record.allowance).toLocaleString()}</td></tr>
          </table>
        </div>
        <div>
          <h4 style="font-size:13px;font-weight:600;margin-bottom:10px;color:#ef4444">DEDUCTIONS</h4>
          <table>
            <tr><td>Provident Fund (10%)</td><td style="color:#dc2626">৳${Number(record.deduction).toLocaleString()}</td></tr>
            <tr><td>Income Tax</td><td style="color:#dc2626">৳${Number(record.tax).toLocaleString()}</td></tr>
            <tr><td>Other Deductions</td><td style="color:#dc2626">৳0</td></tr>
            <tr class="total-row"><td>Total Deductions</td><td style="color:#dc2626">৳${(record.deduction + record.tax).toLocaleString()}</td></tr>
          </table>
        </div>
      </div>

      <div style="background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:12px;padding:20px;color:white;display:flex;justify-content:space-between;align-items:center;margin-top:16px">
        <div><div style="font-size:13px;opacity:0.8">NET TAKE HOME SALARY</div><div style="font-size:28px;font-weight:700">৳${Number(record.net).toLocaleString()}</div></div>
        <div style="font-size:12px;text-align:right;opacity:0.8"><div>${record.month}</div><div>${record.name}</div></div>
      </div>

      <div class="footer">
        <div><p>This is a computer-generated salary slip.</p><p>ERP System Ltd.</p></div>
        <div class="sign-box">HR Manager Signature</div>
      </div>
    </div>
  `;
  openPrintWindow(html);
};

// ── PAYROLL REPORT ────────────────────────────────────────────
export const printPayrollReport = (records, month) => {
  const total = records.reduce((s, r) => s + r.net, 0);
  const html = `
    <div class="page">
      <div class="header">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="logo">E</div>
          <div>
            <div class="company-name">ERP System Ltd.</div>
            <div class="doc-meta">Payroll Department</div>
          </div>
        </div>
        <div style="text-align:right">
          <div class="doc-title">PAYROLL REGISTER</div>
          <div class="doc-meta">${month}</div>
        </div>
      </div>
      <div class="divider"></div>

      <div class="summary-grid">
        <div class="summary-box"><div class="val">${records.length}</div><div class="lbl">Total Employees</div></div>
        <div class="summary-box"><div class="val">৳${total.toLocaleString()}</div><div class="lbl">Total Payroll</div></div>
        <div class="summary-box"><div class="val">${records.filter((r) => r.status === "paid").length}</div><div class="lbl">Disbursed</div></div>
      </div>

      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Dept</th><th>Basic</th><th>Allowance</th><th>Deductions</th><th>Net Salary</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${records
            .map(
              (r) => `
            <tr>
              <td>${r.empId}</td><td>${r.name}</td><td>${r.dept}</td>
              <td>৳${r.basic.toLocaleString()}</td>
              <td>৳${r.allowance.toLocaleString()}</td>
              <td>৳${(r.deduction + r.tax).toLocaleString()}</td>
              <td><strong>৳${r.net.toLocaleString()}</strong></td>
              <td><span class="badge badge-${r.status === "paid" ? "paid" : "pending"}">${r.status.toUpperCase()}</span></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr class="total-row"><td colspan="6">TOTAL NET PAYROLL</td><td>৳${total.toLocaleString()}</td><td></td></tr>
        </tfoot>
      </table>

      <div class="footer">
        <div><p>Generated on ${new Date().toLocaleDateString()}</p><p>ERP System Ltd.</p></div>
        <div class="sign-box">Finance Manager</div>
      </div>
    </div>
  `;
  openPrintWindow(html);
};

// ── PURCHASE ORDER ────────────────────────────────────────────
export const printPurchaseOrder = (po) => {
  const html = `
    <div class="page">
      <div class="header">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="logo">E</div>
          <div>
            <div class="company-name">ERP System Ltd.</div>
            <div class="doc-meta">House 12, Road 4, Gulshan-1, Dhaka</div>
          </div>
        </div>
        <div style="text-align:right">
          <div class="doc-title">PURCHASE ORDER</div>
          <div class="doc-meta"># ${po.id}</div>
          <div class="doc-meta">Date: ${po.date}</div>
        </div>
      </div>
      <div class="divider"></div>

      <div class="grid-2">
        <div class="info-box"><h4>Vendor</h4><p><strong>${po.vendor}</strong></p><p>Category: ${po.category || "General"}</p></div>
        <div class="info-box"><h4>PO Details</h4><p>PO No: <strong>${po.id}</strong></p><p>Date: ${po.date}</p><p>Approved By: ${po.approvedBy}</p></div>
      </div>

      <table>
        <thead><tr><th>#</th><th>Description</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Goods / Materials as per order</td><td>${po.items}</td><td>৳${Math.round(po.amount / po.items).toLocaleString()}</td><td>৳${po.amount.toLocaleString()}</td></tr>
        </tbody>
        <tfoot>
          <tr class="total-row"><td colspan="4">TOTAL</td><td>৳${po.amount.toLocaleString()}</td></tr>
        </tfoot>
      </table>

      <div class="grid-2" style="margin-top:24px">
        <div class="sign-box" style="padding:16px">Prepared By</div>
        <div class="sign-box" style="padding:16px">Approved By</div>
      </div>
    </div>
  `;
  openPrintWindow(html);
};

// ── Generic export to CSV ─────────────────────────────────────
export const exportToCSV = (data, filename = "export") => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => `"${row[h] ?? ""}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Export to JSON ────────────────────────────────────────────
export const exportToJSON = (data, filename = "export") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Print Button Component ────────────────────────────────────
import { useState } from "react";

export function PrintButton({
  onPrint,
  onExportCSV,
  onExportJSON,
  label = "Export",
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
        style={{
          background: "rgba(99,102,241,0.15)",
          color: "#a5b4fc",
          border: "1px solid rgba(99,102,241,0.3)",
        }}
      >
        📤 {label} ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 w-44 rounded-xl overflow-hidden z-40 shadow-xl"
            style={{
              background: "var(--modal-bg)",
              border: "1px solid var(--border)",
            }}
          >
            {onPrint && (
              <button
                onClick={() => {
                  onPrint();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                🖨️ Print / PDF
              </button>
            )}
            {onExportCSV && (
              <button
                onClick={() => {
                  onExportCSV();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                📊 Export CSV
              </button>
            )}
            {onExportJSON && (
              <button
                onClick={() => {
                  onExportJSON();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                📋 Export JSON
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
