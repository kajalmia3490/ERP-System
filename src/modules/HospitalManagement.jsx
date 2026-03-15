import { useState } from "react";
import { hospitalPatients, hospitalDoctors } from "../data/mockData";
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
  useConfirm,
} from "../components/ui";

const COLOR = "#ec4899";

export default function HospitalManagement() {
  const [patients, setPatients] = useState(hospitalPatients);
  const [doctors] = useState(hospitalDoctors);
  const [tab, setTab] = useState("patients");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const { confirm, Dialog } = useConfirm();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    doctor: "",
    dept: "",
    diagnosis: "",
    type: "OPD",
  });

  const stats = {
    total: patients.length,
    admitted: patients.filter((p) => p.status === "admitted").length,
    opd: patients.filter((p) => p.status === "OPD").length,
    discharged: patients.filter((p) => p.status === "discharged").length,
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.dept.toLowerCase().includes(search.toLowerCase()) ||
      p.doctor.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.dept.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdmit = () => {
    if (!form.name || !form.doctor || !form.dept) return;
    const newP = {
      id: `P${String(patients.length + 1).padStart(3, "0")}`,
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone,
      doctor: form.doctor,
      dept: form.dept,
      admit: new Date().toISOString().split("T")[0],
      status: form.type === "admitted" ? "admitted" : "OPD",
      bed:
        form.type === "admitted"
          ? `B${Math.floor(Math.random() * 30) + 1}`
          : null,
      diagnosis: form.diagnosis,
    };
    setPatients([newP, ...patients]);
    setForm({
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      doctor: "",
      dept: "",
      diagnosis: "",
      type: "OPD",
    });
    setModal(null);
  };

  const handleDischarge = async (id) => {
    const ok = await confirm("Discharge this patient?");
    if (ok)
      setPatients(
        patients.map((p) =>
          p.id === id ? { ...p, status: "discharged", bed: null } : p,
        ),
      );
  };

  const deptColors = {
    Cardiology: "#ef4444",
    Gynecology: "#ec4899",
    Orthopedics: "#f59e0b",
    Neurology: "#8b5cf6",
  };

  return (
    <ModuleLayout
      title="Hospital Management"
      icon="🏥"
      color={COLOR}
      actions={
        <Btn color={COLOR} onClick={() => setModal("admit")}>
          + Admit Patient
        </Btn>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Total Patients"
          value={stats.total}
          color={COLOR}
        />
        <StatCard
          icon="🛏️"
          label="Admitted"
          value={stats.admitted}
          sub="In-patient"
          color="#8b5cf6"
        />
        <StatCard
          icon="🚶"
          label="OPD"
          value={stats.opd}
          sub="Out-patient"
          color="#06b6d4"
        />
        <StatCard
          icon="✅"
          label="Discharged"
          value={stats.discharged}
          color="#10b981"
        />
      </div>

      <Tabs
        tabs={[
          { id: "patients", label: "🧑‍⚕️ Patients" },
          { id: "doctors", label: "👨‍⚕️ Doctors" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder={
          tab === "patients"
            ? "Search patient, doctor, dept..."
            : "Search doctor, dept..."
        }
      />

      {tab === "patients" && (
        <Table
          headers={[
            "Patient ID",
            "Name",
            "Age/Sex",
            "Department",
            "Doctor",
            "Admitted",
            "Bed",
            "Diagnosis",
            "Status",
            "Action",
          ]}
        >
          {filtered.map((p) => (
            <TR
              key={p.id}
              onClick={() => {
                setSelected(p);
                setModal("detail");
              }}
            >
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#f9a8d4" }}
                >
                  {p.id}
                </span>
              </TD>
              <TD>
                <div className="flex items-center gap-2">
                  <Avatar name={p.name} />
                  <div>
                    <p className="text-white text-xs font-medium">{p.name}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      {p.phone}
                    </p>
                  </div>
                </div>
              </TD>
              <TD className="text-xs">
                {p.age} / {p.gender[0]}
              </TD>
              <TD>
                <span
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{
                    background: `${deptColors[p.dept] || COLOR}22`,
                    color: deptColors[p.dept] || COLOR,
                  }}
                >
                  {p.dept}
                </span>
              </TD>
              <TD className="text-xs text-white">{p.doctor}</TD>
              <TD className="text-xs">{p.admit}</TD>
              <TD className="text-xs font-mono">{p.bed || "—"}</TD>
              <TD className="text-xs max-w-[140px] truncate">{p.diagnosis}</TD>
              <TD>
                <StatusBadge status={p.status} />
              </TD>
              <TD>
                {p.status === "admitted" && (
                  <Btn
                    size="sm"
                    variant="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDischarge(p.id);
                    }}
                  >
                    Discharge
                  </Btn>
                )}
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {tab === "doctors" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: `${deptColors[d.dept] || COLOR}22`,
                    border: `1px solid ${deptColors[d.dept] || COLOR}44`,
                  }}
                >
                  👨‍⚕️
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{d.name}</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: deptColors[d.dept] || COLOR }}
                  >
                    {d.dept}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    {d.qualification}
                  </p>
                </div>
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: d.available
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.15)",
                    color: d.available ? "#10b981" : "#ef4444",
                  }}
                >
                  {d.available ? "Available" : "Busy"}
                </span>
              </div>
              <div className="space-y-2 text-xs" style={{ color: "#94a3b8" }}>
                <p>🕐 {d.schedule}</p>
                <p>👥 {d.patients} active patients</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admit Modal */}
      <Modal
        open={modal === "admit"}
        onClose={() => setModal(null)}
        title="🏥 Admit / Register Patient"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Patient Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
              placeholder="Full name"
            />
            <Input
              label="Age"
              type="number"
              value={form.age}
              onChange={(v) => setForm({ ...form, age: v })}
              placeholder="Years"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Gender"
              value={form.gender}
              onChange={(v) => setForm({ ...form, gender: v })}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              value={form.dept}
              onChange={(v) => setForm({ ...form, dept: v })}
              options={[
                { value: "", label: "Select dept" },
                ...["Cardiology", "Gynecology", "Orthopedics", "Neurology"].map(
                  (d) => ({ value: d, label: d }),
                ),
              ]}
            />
            <Select
              label="Doctor"
              value={form.doctor}
              onChange={(v) => setForm({ ...form, doctor: v })}
              options={[
                { value: "", label: "Select doctor" },
                ...doctors.map((d) => ({ value: d.name, label: d.name })),
              ]}
            />
          </div>
          <Input
            label="Diagnosis / Complaint"
            value={form.diagnosis}
            onChange={(v) => setForm({ ...form, diagnosis: v })}
            placeholder="Brief description"
          />
          <Select
            label="Admission Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v })}
            options={[
              { value: "OPD", label: "OPD (Out-patient)" },
              { value: "admitted", label: "In-patient (Admit)" },
            ]}
          />
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(null)}>
              Cancel
            </Btn>
            <Btn color={COLOR} onClick={handleAdmit}>
              Confirm Admission
            </Btn>
          </div>
        </div>
      </Modal>

      {/* Patient Detail */}
      <Modal
        open={modal === "detail"}
        onClose={() => setModal(null)}
        title="Patient Record"
      >
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Patient ID", value: selected.id },
                { label: "Department", value: selected.dept },
                { label: "Doctor", value: selected.doctor },
                { label: "Admitted On", value: selected.admit },
                { label: "Bed No.", value: selected.bed || "OPD" },
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
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-xs mb-1" style={{ color: "#64748b" }}>
                Diagnosis
              </p>
              <p className="text-white text-sm">{selected.diagnosis}</p>
            </div>
          </div>
        )}
      </Modal>

      <Dialog />
    </ModuleLayout>
  );
}
