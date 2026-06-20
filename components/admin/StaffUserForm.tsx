"use client";

import { useState } from "react";
import { StaffRole } from "@/types";

interface StaffUserFormProps {
  onSubmit: (data: { name: string; email: string; password: string; role: StaffRole }) => Promise<void>;
  onCancel: () => void;
}

export function StaffUserForm({ onSubmit, onCancel }: StaffUserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>(StaffRole.STAFF);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Partial<Record<string, string>> = {};
    if (!name.trim()) errs.name = "Name required";
    if (!email.trim() || !email.includes("@")) errs.email = "Valid email required";
    if (!password || password.length < 6) errs.password = "Min 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), password, role });
      setName("");
      setEmail("");
      setPassword("");
      setRole(StaffRole.STAFF);
    } catch {
      setErrors({ email: "Email may already exist" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1">Name *</label>
        <input value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }} placeholder="Full name" className={`w-full px-3 py-2.5 rounded-xl border ${errors.name ? "border-danger" : "border-border"} text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`} />
        {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Email *</label>
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }} placeholder="staff@restaurant.com" className={`w-full px-3 py-2.5 rounded-xl border ${errors.email ? "border-danger" : "border-border"} text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`} />
        {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Password *</label>
        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }} placeholder="Min 6 characters" className={`w-full px-3 py-2.5 rounded-xl border ${errors.password ? "border-danger" : "border-border"} text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`} />
        {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white">
          <option value={StaffRole.STAFF}>Staff (Orders only)</option>
          <option value={StaffRole.MANAGER}>Manager (Menu + Reports)</option>
          <option value={StaffRole.ADMIN}>Admin (Full access)</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-text font-medium text-sm hover:bg-bg">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-sm disabled:opacity-50">{isSubmitting ? "Creating..." : "Add Staff"}</button>
      </div>
    </form>
  );
}
