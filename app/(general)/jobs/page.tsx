import JobsList from "@/components/JobList";
import { Job } from "@/types/Job";
import React from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
interface JobsPageProps {
  searchParams: { [key: string]: string | undefined };
}
const fetchJobs = async (): Promise<Job[]> => {
  const res = await fetch(`${BACKEND_URL}/api/jobs`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
};
const Jobs = async ({ searchParams }: JobsPageProps) => {
  const searchParam = searchParams.search || "";

  const jobs = await fetchJobs();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 pt-28">
      <h1 className="text-3xl font-bold mb-8 text-center">All Job Openings</h1>{" "}
      <JobsList jobs={jobs} searchParam={searchParam} />
    </div>
  );
};

export default Jobs;
