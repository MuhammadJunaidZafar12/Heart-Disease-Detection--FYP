'use client'
import { useState } from "react";
import API from "../../services/api";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/ui/Button";
import { Heart } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      alert("Registered Successfully");
      router.push("/login");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join CardioGuard and start monitoring heart health"
    >
      <div className="flex justify-center mb-6 lg:hidden">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center">
          <Heart className="w-7 h-7 text-[var(--color-accent)] fill-[var(--color-accent)]" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
            Age
          </label>
          <input
            type="number"
            name="age"
            placeholder="Enter your age"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
            Gender
          </label>
          <select
            name="gender"
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Create Account
        </Button>
      </form>

      <p className="text-center text-[var(--color-muted)] mt-6">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-[var(--color-primary)] font-semibold hover:underline"
        >
          Login
        </a>
      </p>
    </AuthLayout>
  );
}
