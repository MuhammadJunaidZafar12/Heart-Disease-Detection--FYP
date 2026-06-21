"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import MotionCard from "@/components/ui/MotionCard";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is CardioGuard?",
    a: "CardioGuard is an AI-powered platform for early detection and monitoring of heart diseases using advanced machine learning algorithms.",
  },
  {
    q: "How quickly do you respond to inquiries?",
    a: "We respond to all inquiries within 24-48 hours during business days. For urgent matters, please call us directly.",
  },
  {
    q: "Is my data secure?",
    a: "Yes, we implement industry-standard encryption and security measures to protect all user data and maintain privacy.",
  },
  {
    q: "How do I create an account?",
    a: 'Visit our login page and click the "Register" button to create a new account. Fill in your details and you\'re ready to go!',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    cn(
      "input",
      validationErrors[field] && "border-red-500 bg-red-50/50 focus:ring-red-400/30"
    );

  return (
    <div className="bg-[var(--color-surface)]">
      <div className="mesh-hero py-12 sm:py-16 text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Get in Touch</h1>
        <p className="text-white/80 max-w-xl mx-auto">
          We&apos;d love to hear from you. Send us a message and we&apos;ll respond as
          soon as possible.
        </p>
      </div>

      <div className="page-container py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1 space-y-6">
            {[
              {
                icon: Mail,
                title: "Email",
                lines: ["support@cardiogaurd.com", "info@cardiogaurd.com"],
              },
              {
                icon: Phone,
                title: "Phone",
                lines: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
              },
              {
                icon: MapPin,
                title: "Location",
                lines: ["123 Healthcare Street", "New York, NY 10001"],
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <MotionCard key={i} hover={false} asItem={false} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                    <Icon className="text-[var(--color-primary)]" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-foreground)] mb-1">
                      {item.title}
                    </h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-[var(--color-muted)] text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </MotionCard>
              );
            })}

            <div className="card p-5 border-l-4 border-l-[var(--color-primary)]">
              <p className="text-sm text-[var(--color-muted)]">
                <span className="font-semibold text-[var(--color-foreground)]">
                  Response Time:
                </span>{" "}
                We typically respond within 24-48 hours during business days.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-[var(--color-primary)]" size={24} />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">
                Send us a Message
              </h2>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
                <p className="text-green-700">
                  ✓ Thank you! Your message has been sent successfully. We&apos;ll be in
                  touch soon.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700">✗ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClass("name")}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={inputClass("email")}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className={inputClass("subject")}
                />
                {validationErrors.subject && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  className={cn(inputClass("message"), "resize-none")}
                />
                {validationErrors.message && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.message}</p>
                )}
                <p className="text-[var(--color-muted)] text-xs mt-1">
                  Minimum 10 characters required
                </p>
              </div>

              <Button type="submit" variant="primary" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <section className="mt-16 sm:mt-20">
          <h2 className="section-title text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <MotionCard key={i} hover={false} asItem={false}>
                <h3 className="font-semibold text-lg text-[var(--color-foreground)] mb-2">
                  {faq.q}
                </h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{faq.a}</p>
              </MotionCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
