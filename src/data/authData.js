// ================================================================
// AUTH MOCK DATABASE
// Replace this entire file with real API calls when backend is ready
// ================================================================

// Stored users (simulates a database table)
export const mockUsersDB = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@erp.com",
    password: "admin123",
    role: "super_admin",
    avatar: "AU",
    phone: "01712345678",
    department: "Management",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-07-15 09:32",
    permissions: ["all"],
  },
  {
    id: 2,
    name: "Rahim Uddin",
    email: "rahim@erp.com",
    password: "rahim123",
    role: "manager",
    avatar: "RU",
    phone: "01812345678",
    department: "Sales",
    status: "active",
    createdAt: "2024-02-10",
    lastLogin: "2024-07-15 08:15",
    permissions: ["hotel", "inventory", "stock", "reporting", "sales"],
  },
  {
    id: 3,
    name: "Karim Hossain",
    email: "karim@erp.com",
    password: "karim123",
    role: "hr_manager",
    avatar: "KH",
    phone: "01912345678",
    department: "HR",
    status: "active",
    createdAt: "2024-02-15",
    lastLogin: "2024-07-14 11:00",
    permissions: ["hr", "payroll", "leave", "reporting"],
  },
  {
    id: 4,
    name: "Fatema Begum",
    email: "fatema@erp.com",
    password: "fatema123",
    role: "accountant",
    avatar: "FB",
    phone: "01612345678",
    department: "Accounts",
    status: "active",
    createdAt: "2024-03-01",
    lastLogin: "2024-07-15 07:45",
    permissions: ["accounting", "reporting"],
  },
  {
    id: 5,
    name: "Salam Sheikh",
    email: "salam@erp.com",
    password: "salam123",
    role: "sales",
    avatar: "SS",
    phone: "01512345678",
    department: "Sales",
    status: "inactive",
    createdAt: "2024-04-01",
    lastLogin: "2024-07-10 14:20",
    permissions: ["sales", "inventory"],
  },
];

// Role definitions
export const roleDefinitions = {
  super_admin: { label: "Super Admin", color: "#6366f1", permissions: ["all"] },
  manager: {
    label: "Manager",
    color: "#10b981",
    permissions: ["hotel", "inventory", "stock", "reporting", "sales"],
  },
  hr_manager: {
    label: "HR Manager",
    color: "#f59e0b",
    permissions: ["hr", "payroll", "leave", "reporting"],
  },
  accountant: {
    label: "Accountant",
    color: "#ec4899",
    permissions: ["accounting", "reporting"],
  },
  sales: {
    label: "Sales Staff",
    color: "#3b82f6",
    permissions: ["sales", "inventory"],
  },
};

// ── Auth helpers (replace with real API calls later) ──────────
export const authHelpers = {
  // LOGIN — replace with: POST /api/auth/login
  login: (email, password) => {
    const user = mockUsersDB.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!user) return { success: false, message: "Invalid email or password." };
    if (user.status === "inactive")
      return {
        success: false,
        message: "Your account is deactivated. Contact admin.",
      };
    return { success: true, user: { ...user, password: undefined } }; // never return password
  },

  // REGISTER — replace with: POST /api/auth/register
  register: (data) => {
    const exists = mockUsersDB.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase(),
    );
    if (exists)
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    if (data.password !== data.confirmPassword)
      return { success: false, message: "Passwords do not match." };
    if (data.password.length < 6)
      return {
        success: false,
        message: "Password must be at least 6 characters.",
      };

    const newUser = {
      id: mockUsersDB.length + 1,
      name: data.name,
      email: data.email,
      password: data.password,
      role: "sales", // default role — admin assigns proper role later
      avatar: data.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      phone: data.phone || "",
      department: data.department || "",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: null,
      permissions: ["sales", "inventory"],
    };
    mockUsersDB.push(newUser);
    return { success: true, user: { ...newUser, password: undefined } };
  },

  // Quick demo credentials list
  demoAccounts: [
    {
      email: "admin@erp.com",
      password: "admin123",
      role: "Super Admin",
      color: "#6366f1",
    },
    {
      email: "rahim@erp.com",
      password: "rahim123",
      role: "Manager",
      color: "#10b981",
    },
    {
      email: "karim@erp.com",
      password: "karim123",
      role: "HR Manager",
      color: "#f59e0b",
    },
    {
      email: "fatema@erp.com",
      password: "fatema123",
      role: "Accountant",
      color: "#ec4899",
    },
  ],
};
