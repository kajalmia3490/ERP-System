import { useState, useEffect, useRef } from "react";
import { authHelpers } from "./data/authData";

// ================================================================
// ANIMATED BACKGROUND GRID
// ================================================================
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#6366f1"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Glow orbs */}
    <div
      className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse"
      style={{
        background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
        top: "-10%",
        left: "-5%",
        animationDuration: "4s",
      }}
    />
    <div
      className="absolute w-64 h-64 rounded-full opacity-15"
      style={{
        background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
        bottom: "10%",
        right: "5%",
        animation: "pulse 6s ease-in-out infinite",
      }}
    />
    <div
      className="absolute w-48 h-48 rounded-full opacity-10"
      style={{
        background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
        top: "40%",
        right: "20%",
        animation: "pulse 8s ease-in-out infinite",
      }}
    />
  </div>
);

// ================================================================
// FLOATING LABEL INPUT
// ================================================================
const AuthInput = ({
  label,
  type = "text",
  value,
  onChange,
  icon,
  error,
  autoComplete,
  rightElement,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const inputType =
    type === "password" ? (showPass ? "text" : "password") : type;
  const active = focused || value;

  return (
    <div className="relative">
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1.5px solid ${error ? "#ef4444" : focused ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
          boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
        }}
      >
        {/* Icon */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors"
          style={{ color: focused ? "#6366f1" : "#475569" }}
        >
          {icon}
        </div>

        {/* Floating label */}
        <label
          className="absolute left-11 transition-all duration-200 pointer-events-none select-none"
          style={{
            top: active ? "8px" : "50%",
            transform: active
              ? "translateY(0) scale(0.75)"
              : "translateY(-50%) scale(1)",
            transformOrigin: "left center",
            color: error ? "#ef4444" : focused ? "#818cf8" : "#475569",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {label}
        </label>

        {/* Input */}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          className="w-full bg-transparent outline-none text-white text-sm"
          style={{
            padding: active ? "24px 44px 8px 44px" : "16px 44px 16px 44px",
            paddingRight:
              type === "password" ? "48px" : rightElement ? "48px" : "16px",
          }}
        />

        {/* Password toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors text-sm"
            style={{ color: focused ? "#6366f1" : "#475569" }}
          >
            {showPass ? "🙈" : "👁"}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          className="text-xs mt-1.5 flex items-center gap-1"
          style={{ color: "#ef4444" }}
        >
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

// ================================================================
// DEMO CREDENTIALS QUICK-FILL
// ================================================================
const DemoAccounts = ({ onFill }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
        style={{
          background: "rgba(99,102,241,0.1)",
          color: "#818cf8",
          border: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        <span>⚡</span> Quick Fill Demo Account
        <span className="text-xs" style={{ color: "#6366f1" }}>
          ▾
        </span>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-20"
          style={{
            background: "#1a1d2e",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          {authHelpers.demoAccounts.map((acc, i) => (
            <button
              key={i}
              onClick={() => {
                onFill(acc.email, acc.password);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: acc.color }}
              >
                {acc.role[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium">{acc.role}</p>
                <p className="text-xs" style={{ color: "#475569" }}>
                  {acc.email}
                </p>
              </div>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#64748b",
                }}
              >
                {acc.password}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ================================================================
// SIGN IN PAGE
// ================================================================
const SignIn = ({ onLogin, onGoRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setGlobalError("");

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));

    const result = authHelpers.login(email, password);
    setLoading(false);

    if (result.success) {
      onLogin(result.user);
    } else {
      setGlobalError(result.message);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div
      className={`transition-all duration-150 ${shake ? "translate-x-2" : ""}`}
      style={{ animation: shake ? "shake 0.4s ease" : "none" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
          }}
        >
          E
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Sign in to your ERP account
        </p>
      </div>

      {/* Global error */}
      {globalError && (
        <div
          className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
          }}
        >
          <span>⚠️</span> {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setErrors((p) => ({ ...p, email: "" }));
            setGlobalError("");
          }}
          icon="✉️"
          error={errors.email}
          autoComplete="email"
        />
        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            setErrors((p) => ({ ...p, password: "" }));
            setGlobalError("");
          }}
          icon="🔑"
          error={errors.password}
          autoComplete="current-password"
        />

        {/* Forgot password */}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs transition-colors hover:opacity-80"
            style={{ color: "#818cf8" }}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Signing in...
            </>
          ) : (
            "Sign In →"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          <span className="text-xs" style={{ color: "#334155" }}>
            or try a demo account
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
        </div>

        <DemoAccounts
          onFill={(em, pw) => {
            setEmail(em);
            setPassword(pw);
            setErrors({});
            setGlobalError("");
          }}
        />
      </form>

      {/* Register link */}
      <p className="text-center text-sm mt-6" style={{ color: "#475569" }}>
        Don't have an account?{" "}
        <button
          onClick={onGoRegister}
          className="font-semibold transition-colors hover:opacity-80"
          style={{ color: "#818cf8" }}
        >
          Create account
        </button>
      </p>
    </div>
  );
};

// ================================================================
// REGISTRATION PAGE
// ================================================================
const Register = ({ onLogin, onGoSignIn }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 = personal, 2 = password

  const set = (key) => (v) => {
    setForm((p) => ({ ...p, [key]: v }));
    setErrors((p) => ({ ...p, [key]: "" }));
    setGlobalError("");
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    else if (form.name.trim().length < 3)
      e.name = "Name must be at least 3 characters";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";
    if (form.phone && !/^01[3-9]\d{8}$/.test(form.phone))
      e.phone = "Enter valid BD phone (01XXXXXXXXX)";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Minimum 6 characters required";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const result = authHelpers.register(form);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => onLogin(result.user), 1500);
    } else {
      setGlobalError(result.message);
      if (result.message.includes("email")) setStep(1);
    }
  };

  // Password strength
  const strength = (() => {
    const p = form.password;
    if (!p) return { score: 0, label: "", color: "" };
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    const levels = [
      { label: "", color: "" },
      { label: "Very Weak", color: "#ef4444" },
      { label: "Weak", color: "#f97316" },
      { label: "Fair", color: "#f59e0b" },
      { label: "Strong", color: "#10b981" },
      { label: "Very Strong", color: "#06b6d4" },
    ];
    return { score: s, ...levels[s] };
  })();

  if (success)
    return (
      <div className="text-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
          style={{
            background: "rgba(16,185,129,0.15)",
            border: "2px solid rgba(16,185,129,0.3)",
          }}
        >
          ✅
        </div>
        <h2 className="text-white font-bold text-xl">Account Created!</h2>
        <p className="text-sm mt-2" style={{ color: "#64748b" }}>
          Redirecting to dashboard...
        </p>
        <div className="mt-4 w-8 h-8 mx-auto">
          <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="#6366f1"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="#6366f1"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-7">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
          }}
        >
          E
        </div>
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Join the ERP system
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background:
                  step >= s
                    ? "linear-gradient(135deg,#6366f1,#a855f7)"
                    : "rgba(255,255,255,0.06)",
                color: step >= s ? "#fff" : "#475569",
                border:
                  step === s ? "2px solid #818cf8" : "2px solid transparent",
              }}
            >
              {step > s ? "✓" : s}
            </div>
            <span
              className="text-xs"
              style={{ color: step === s ? "#a5b4fc" : "#334155" }}
            >
              {s === 1 ? "Personal Info" : "Set Password"}
            </span>
            {s < 2 && (
              <div
                className="flex-1 h-px mx-1"
                style={{
                  background:
                    step > s
                      ? "rgba(99,102,241,0.5)"
                      : "rgba(255,255,255,0.06)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Global error */}
      {globalError && (
        <div
          className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
          }}
        >
          <span>⚠️</span> {globalError}
        </div>
      )}

      <form
        onSubmit={
          step === 1
            ? (e) => {
                e.preventDefault();
                handleNext();
              }
            : handleSubmit
        }
        className="space-y-4"
      >
        {/* Step 1 */}
        {step === 1 && (
          <>
            <AuthInput
              label="Full Name"
              value={form.name}
              onChange={set("name")}
              icon="👤"
              error={errors.name}
              autoComplete="name"
            />
            <AuthInput
              label="Email Address"
              type="email"
              value={form.email}
              onChange={set("email")}
              icon="✉️"
              error={errors.email}
              autoComplete="email"
            />
            <AuthInput
              label="Phone Number (Optional)"
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              icon="📱"
              error={errors.phone}
              autoComplete="tel"
            />
            <AuthInput
              label="Department (Optional)"
              value={form.department}
              onChange={set("department")}
              icon="🏢"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
              }}
            >
              Continue →
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <AuthInput
              label="Password"
              type="password"
              value={form.password}
              onChange={set("password")}
              icon="🔑"
              error={errors.password}
              autoComplete="new-password"
            />

            {/* Password strength */}
            {form.password && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{
                        background:
                          i <= strength.score
                            ? strength.color
                            : "rgba(255,255,255,0.07)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strength.color }}>
                  {strength.label}
                </p>
              </div>
            )}

            <AuthInput
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              icon="🔒"
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            {/* Password requirements */}
            <div
              className="rounded-xl p-3 space-y-1.5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                {
                  rule: form.password.length >= 6,
                  text: "At least 6 characters",
                },
                {
                  rule: /[A-Z]/.test(form.password),
                  text: "One uppercase letter",
                },
                { rule: /[0-9]/.test(form.password), text: "One number" },
                {
                  rule:
                    form.password === form.confirmPassword &&
                    form.confirmPassword !== "",
                  text: "Passwords match",
                },
              ].map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs transition-colors"
                  style={{ color: r.rule ? "#10b981" : "#475569" }}
                >
                  <span>{r.rule ? "✓" : "○"}</span> {r.text}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-xl font-medium text-sm transition-all hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Account ✓"
                )}
              </button>
            </div>

            {/* Note about role */}
            <div
              className="rounded-xl p-3 text-xs flex items-start gap-2"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "#818cf8",
              }}
            >
              <span className="flex-shrink-0 mt-0.5">ℹ️</span>
              <span>
                New accounts get default <strong>Sales</strong> role. An admin
                can upgrade your permissions after registration.
              </span>
            </div>
          </>
        )}
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm mt-6" style={{ color: "#475569" }}>
        Already have an account?{" "}
        <button
          onClick={onGoSignIn}
          className="font-semibold transition-colors hover:opacity-80"
          style={{ color: "#818cf8" }}
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

// ================================================================
// AUTH LAYOUT WRAPPER
// ================================================================
const AuthLayout = ({ children, page }) => {
  const features = [
    { icon: "🏨", text: "Hotel Management" },
    { icon: "🏥", text: "Hospital Management" },
    { icon: "📊", text: "Accounting & Finance" },
    { icon: "👥", text: "HR & Payroll" },
    { icon: "📈", text: "Sales & Purchase" },
    { icon: "🔐", text: "Role-based Access" },
  ];

  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCurrentFeature((p) => (p + 1) % features.length),
      2500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#0a0c17",
        fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
      }}
    >
      {/* ── LEFT PANEL (hidden on mobile) ── */}
      <div
        className="hidden lg:flex lg:flex-1 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #0d0f1e 0%, #13162a 60%, #1a1040 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <GridBackground />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            E
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">
              ERP System
            </p>
            <p className="text-xs" style={{ color: "#6366f1" }}>
              Pro v2.0
            </p>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2
              className="text-white font-bold leading-tight"
              style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
            >
              Manage your entire
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1, #a855f7, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                business in one place
              </span>
            </h2>
            <p
              className="mt-3 text-base"
              style={{ color: "#64748b", maxWidth: "400px" }}
            >
              A complete enterprise resource planning system for hotels,
              hospitals, schools and more.
            </p>
          </div>

          {/* Feature ticker */}
          <div className="space-y-2.5">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 transition-all duration-300"
                style={{
                  opacity: i === currentFeature ? 1 : 0.3,
                  transform:
                    i === currentFeature ? "translateX(0)" : "translateX(-8px)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{
                    background:
                      i === currentFeature
                        ? "rgba(99,102,241,0.2)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${i === currentFeature ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  {f.icon}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{
                    color: i === currentFeature ? "#a5b4fc" : "#334155",
                  }}
                >
                  {f.text}
                </span>
                {i === currentFeature && (
                  <span style={{ color: "#6366f1" }}>●</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: "13+", label: "Modules" },
            { value: "100%", label: "Role-based" },
            { value: "∞", label: "Scalable" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-3 text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-xs" style={{ color: "#475569" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div
        className="w-full lg:w-[480px] flex flex-col justify-center relative overflow-y-auto"
        style={{ background: "#0f1117" }}
      >
        <GridBackground />

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-center gap-2 pt-8">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            E
          </div>
          <p className="text-white font-bold">ERP System</p>
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto px-6 py-10">
          {children}
        </div>

        {/* Footer */}
        <p
          className="relative z-10 text-center text-xs pb-6"
          style={{ color: "#1e293b" }}
        >
          © 2024 ERP System · All rights reserved
        </p>
      </div>
    </div>
  );
};

// ================================================================
// MAIN AUTH COMPONENT — export this and use in ERPApp.jsx
// ================================================================
export default function AuthPages({ onLogin }) {
  const [page, setPage] = useState("signin"); // "signin" | "register"

  return (
    <AuthLayout page={page}>
      {page === "signin" ? (
        <SignIn onLogin={onLogin} onGoRegister={() => setPage("register")} />
      ) : (
        <Register onLogin={onLogin} onGoSignIn={() => setPage("signin")} />
      )}
    </AuthLayout>
  );
}
