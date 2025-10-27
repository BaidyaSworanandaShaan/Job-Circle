"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function AdminStatsGrid() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!accessToken) return;

      try {
        const res = await fetch(`${BACKEND_URL}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch admin stats");

        const { data } = await res.json();
        console.log("Admin Stats:", data);

        // Map backend data to display format
        setStats([
          { label: "Total Users", value: String(data.totalUsers) },
          { label: "Total Jobs", value: String(data.totalJobs) },
          {
            label: "Total Submitted Applications",
            value: String(data.totalApplications),
          },
          {
            label: "Total Enquiry ",
            value: String(data.totalEnquiry),
          },
        ]);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-xl border border-gray-100"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border bg-white border-gray-100 p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-3xl font-semibold text-gray-900 mb-1">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
