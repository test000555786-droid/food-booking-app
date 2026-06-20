"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser, DailyReport } from "@/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DailySalesChart } from "@/components/admin/DailySalesChart";
import { StatCard } from "@/components/admin/StatCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function AdminReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [dailyData, setDailyData] = useState<DailyReport[]>([]);
  const [stats, setStats] = useState({ todayOrders: 0, todayRevenue: 0, avgOrderValue: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadReports();
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const loadReports = async () => {
    try {
      const res = await fetch("/api/reports/daily");
      if (res.ok) {
        const data = await res.json();
        setDailyData(data.dailyReports || []);
        setStats({
          todayOrders: data.todayOrders,
          todayRevenue: data.todayRevenue,
          avgOrderValue: data.todayOrders > 0 ? Math.round(data.todayRevenue / data.todayOrders) : 0,
        });
      }
    } catch {
      // Handle error
    }
  };

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) { router.push("/admin"); return null; }

  return (
    <div>
      <AdminHeader user={user} onMenuClick={() => {}} title="Reports" />
      <main className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Today's Orders"
            value={stats.todayOrders}
            icon={<svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard
            title="Today's Revenue"
            value={`₹${stats.todayRevenue.toLocaleString("en-IN")}`}
            icon={<svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            title="Avg Order Value"
            value={`₹${stats.avgOrderValue.toLocaleString("en-IN")}`}
            icon={<svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
        </div>

        <div className="bg-surface rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-text mb-4">Daily Sales (Last 7 Days)</h3>
          <DailySalesChart data={dailyData} />
        </div>
      </main>
    </div>
  );
}
