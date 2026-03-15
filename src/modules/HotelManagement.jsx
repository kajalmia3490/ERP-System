import { useState } from "react";
import { hotelRooms, hotelBookings } from "../data/mockData";
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
  taka,
  useConfirm,
  Avatar,
} from "../components/ui";

const COLOR = "#6366f1";

export default function HotelManagement() {
  const [rooms, setRooms] = useState(hotelRooms);
  const [bookings, setBookings] = useState(hotelBookings);
  const [tab, setTab] = useState("rooms");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // "add-booking" | "room-detail"
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const { confirm, Dialog } = useConfirm();

  const [form, setForm] = useState({
    guest: "",
    phone: "",
    room: "",
    checkIn: "",
    checkOut: "",
    type: "Standard",
  });

  const roomStats = {
    total: rooms.length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    available: rooms.filter((r) => r.status === "available").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  const filteredRooms = rooms.filter((r) => {
    const matchSearch =
      r.number.includes(search) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      (r.guest || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const filteredBookings = bookings.filter(
    (b) =>
      b.guest.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.room.includes(search),
  );

  const handleAddBooking = () => {
    if (!form.guest || !form.room || !form.checkIn || !form.checkOut) return;
    const nights = Math.ceil(
      (new Date(form.checkOut) - new Date(form.checkIn)) /
        (1000 * 60 * 60 * 24),
    );
    const priceMap = { Standard: 3500, Deluxe: 5500, Suite: 9500 };
    const total = nights * priceMap[form.type];
    const newBooking = {
      id: `BK${String(bookings.length + 1).padStart(3, "0")}`,
      guest: form.guest,
      phone: form.phone,
      room: form.room,
      type: form.type,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      nights,
      total,
      status: "reserved",
    };
    setBookings([newBooking, ...bookings]);
    setRooms(
      rooms.map((r) =>
        r.number === form.room
          ? {
              ...r,
              status: "occupied",
              guest: form.guest,
              checkIn: form.checkIn,
              checkOut: form.checkOut,
            }
          : r,
      ),
    );
    setForm({
      guest: "",
      phone: "",
      room: "",
      checkIn: "",
      checkOut: "",
      type: "Standard",
    });
    setModal(null);
  };

  const handleCheckout = async (bookingId) => {
    const ok = await confirm("Confirm checkout for this guest?");
    if (!ok) return;
    const b = bookings.find((b) => b.id === bookingId);
    setBookings(
      bookings.map((bk) =>
        bk.id === bookingId ? { ...bk, status: "checked-out" } : bk,
      ),
    );
    setRooms(
      rooms.map((r) =>
        r.number === b?.room
          ? {
              ...r,
              status: "available",
              guest: null,
              checkIn: null,
              checkOut: null,
            }
          : r,
      ),
    );
  };

  const roomStatusColors = {
    available: "#10b981",
    occupied: "#6366f1",
    maintenance: "#f59e0b",
  };

  return (
    <ModuleLayout
      title="Hotel Management"
      icon="🏨"
      color={COLOR}
      actions={<Btn onClick={() => setModal("add-booking")}>+ New Booking</Btn>}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="🏠"
          label="Total Rooms"
          value={roomStats.total}
          color={COLOR}
        />
        <StatCard
          icon="🛏️"
          label="Occupied"
          value={roomStats.occupied}
          sub={`${Math.round((roomStats.occupied / roomStats.total) * 100)}% occupancy`}
          color="#6366f1"
        />
        <StatCard
          icon="✅"
          label="Available"
          value={roomStats.available}
          color="#10b981"
        />
        <StatCard
          icon="🔧"
          label="Maintenance"
          value={roomStats.maintenance}
          color="#f59e0b"
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "rooms", label: "🏠 Room Grid" },
          { id: "bookings", label: "📋 Bookings" },
        ]}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setSearch("");
        }}
      />

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={
            tab === "rooms"
              ? "Search room, type, guest..."
              : "Search booking, guest..."
          }
        />
        {tab === "rooms" && (
          <div className="flex gap-2">
            {["all", "available", "occupied", "maintenance"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all"
                style={{
                  background:
                    filter === s
                      ? `${roomStatusColors[s] || COLOR}22`
                      : "rgba(255,255,255,0.04)",
                  color:
                    filter === s ? roomStatusColors[s] || "#a5b4fc" : "#64748b",
                  border: `1px solid ${filter === s ? (roomStatusColors[s] || COLOR) + "44" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rooms Grid */}
      {tab === "rooms" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => {
                setSelected(room);
                setModal("room-detail");
              }}
              className="rounded-xl p-4 cursor-pointer transition-all hover:scale-105"
              style={{
                background: `${roomStatusColors[room.status]}15`,
                border: `1px solid ${roomStatusColors[room.status]}44`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-lg">
                  #{room.number}
                </span>
                <span className="text-lg">
                  {room.status === "occupied"
                    ? "👤"
                    : room.status === "maintenance"
                      ? "🔧"
                      : "✅"}
                </span>
              </div>
              <p
                className="text-xs font-medium"
                style={{ color: roomStatusColors[room.status] }}
              >
                {room.type}
              </p>
              {room.guest && (
                <p
                  className="text-xs mt-1 truncate"
                  style={{ color: "#94a3b8" }}
                >
                  {room.guest}
                </p>
              )}
              <p
                className="text-xs mt-1 font-semibold"
                style={{ color: "#64748b" }}
              >
                {taka(room.price)}/night
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Bookings Table */}
      {tab === "bookings" && (
        <Table
          headers={[
            "Booking ID",
            "Guest",
            "Room",
            "Check-in",
            "Check-out",
            "Nights",
            "Total",
            "Status",
            "Action",
          ]}
        >
          {filteredBookings.map((b) => (
            <TR key={b.id}>
              <TD>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#a5b4fc" }}
                >
                  {b.id}
                </span>
              </TD>
              <TD>
                <div className="flex items-center gap-2">
                  <Avatar name={b.guest} />
                  <div>
                    <p className="text-white text-xs font-medium">{b.guest}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      {b.phone}
                    </p>
                  </div>
                </div>
              </TD>
              <TD>
                <span className="font-bold text-white">{b.room}</span>{" "}
                <span className="text-xs" style={{ color: "#64748b" }}>
                  ({b.type})
                </span>
              </TD>
              <TD className="text-xs">{b.checkIn}</TD>
              <TD className="text-xs">{b.checkOut}</TD>
              <TD className="text-center">{b.nights}</TD>
              <TD>
                <span className="font-semibold text-white">
                  {taka(b.total)}
                </span>
              </TD>
              <TD>
                <StatusBadge status={b.status} />
              </TD>
              <TD>
                {b.status === "checked-in" && (
                  <Btn
                    size="sm"
                    variant="danger"
                    onClick={() => handleCheckout(b.id)}
                  >
                    Checkout
                  </Btn>
                )}
                {b.status === "reserved" && (
                  <Btn
                    size="sm"
                    variant="success"
                    onClick={() =>
                      setBookings(
                        bookings.map((bk) =>
                          bk.id === b.id ? { ...bk, status: "checked-in" } : bk,
                        ),
                      )
                    }
                  >
                    Check-in
                  </Btn>
                )}
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {/* Add Booking Modal */}
      <Modal
        open={modal === "add-booking"}
        onClose={() => setModal(null)}
        title="🏨 New Booking"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Guest Name"
              value={form.guest}
              onChange={(v) => setForm({ ...form, guest: v })}
              required
              placeholder="Full name"
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Room Number"
              value={form.room}
              onChange={(v) => setForm({ ...form, room: v })}
              required
              placeholder="e.g. 102"
            />
            <Select
              label="Room Type"
              value={form.type}
              onChange={(v) => setForm({ ...form, type: v })}
              options={[
                { value: "Standard", label: "Standard - ৳3,500" },
                { value: "Deluxe", label: "Deluxe - ৳5,500" },
                { value: "Suite", label: "Suite - ৳9,500" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Check-in Date"
              type="date"
              value={form.checkIn}
              onChange={(v) => setForm({ ...form, checkIn: v })}
              required
            />
            <Input
              label="Check-out Date"
              type="date"
              value={form.checkOut}
              onChange={(v) => setForm({ ...form, checkOut: v })}
              required
            />
          </div>
          {form.checkIn && form.checkOut && (
            <div
              className="rounded-xl p-3"
              style={{
                background: `${COLOR}15`,
                border: `1px solid ${COLOR}33`,
              }}
            >
              <p className="text-sm" style={{ color: "#a5b4fc" }}>
                {Math.ceil(
                  (new Date(form.checkOut) - new Date(form.checkIn)) / 86400000,
                )}{" "}
                nights · Total:{" "}
                {taka(
                  Math.ceil(
                    (new Date(form.checkOut) - new Date(form.checkIn)) /
                      86400000,
                  ) *
                    ({ Standard: 3500, Deluxe: 5500, Suite: 9500 }[form.type] ||
                      0),
                )}
              </p>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Btn variant="secondary" onClick={() => setModal(null)}>
              Cancel
            </Btn>
            <Btn onClick={handleAddBooking}>Confirm Booking</Btn>
          </div>
        </div>
      </Modal>

      {/* Room Detail Modal */}
      <Modal
        open={modal === "room-detail"}
        onClose={() => setModal(null)}
        title={`Room ${selected?.number} — ${selected?.type}`}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Floor", value: `Floor ${selected.floor}` },
                {
                  label: "Status",
                  value: <StatusBadge status={selected.status} />,
                },
                { label: "Rate", value: `${taka(selected.price)}/night` },
                { label: "Guest", value: selected.guest || "—" },
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
            {selected.checkIn && (
              <div
                className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <p className="text-xs mb-1" style={{ color: "#64748b" }}>
                  Stay Duration
                </p>
                <p className="text-white text-sm">
                  {selected.checkIn} → {selected.checkOut}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              {selected.status === "available" && (
                <Btn
                  onClick={() => {
                    setModal("add-booking");
                    setForm({
                      ...form,
                      room: selected.number,
                      type: selected.type,
                    });
                  }}
                >
                  Book This Room
                </Btn>
              )}
              {selected.status !== "maintenance" && (
                <Btn
                  variant="secondary"
                  onClick={() => {
                    setRooms(
                      rooms.map((r) =>
                        r.id === selected.id
                          ? { ...r, status: "maintenance" }
                          : r,
                      ),
                    );
                    setModal(null);
                  }}
                >
                  Set Maintenance
                </Btn>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Dialog />
    </ModuleLayout>
  );
}
