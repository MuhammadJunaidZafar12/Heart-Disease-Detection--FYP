'use client'
import { useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/ui/Button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => { 
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token, res.data.user);
      alert("Login Success");
      router.push("/");

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Welcome back to CardioGuard">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder=" "
            required
            className="input peer"
          />
          <label className="absolute left-4 top-3 text-[var(--color-muted)] text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-primary)] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
            Email
          </label>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder=" "
            required
            className="input peer pr-16"
          />
          <label className="absolute left-4 top-3 text-[var(--color-muted)] text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-primary)] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
            Password
          </label>
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] cursor-pointer select-none text-sm hover:text-[var(--color-primary)]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Login
        </Button>
      </form>

      <p className="text-sm text-center mt-6 text-[var(--color-muted)]">
        Don&apos;t have an account?{" "}
        <span
          onClick={() => router.push("/register")}
          className="text-[var(--color-primary)] cursor-pointer font-semibold hover:underline"
        >
          Register
        </span>
      </p>
    </AuthLayout>
  );
}
