import { Job } from "@/types/Job";

import Applicants from "@/components/Dashboard/Admin/Applicants";
import AdminDeleteButton from "@/components/Dashboard/Admin/AdminDeleteButton";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface JobDetailProps {
  params: { id: string };
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function JobDetail({ params }: JobDetailProps) {
  const { id } = params;

  const res = await fetch(`${BACKEND_URL}/api/jobs/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch job");

  const job: Job = await res.json();

  return (
    <div className="pt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-foreground mb-2">
          {job.title}
        </h1>
        <p className="text-lg text-muted-foreground">{job.company}</p>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-4 bg-card border border-border rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Location</p>
          <p className="font-semibold text-foreground">{job.location}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Job Type</p>
          <p className="font-semibold text-foreground">{job.jobType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Salary</p>
          <p className="font-semibold text-foreground">
            $ {job.salaryRange || "Negotiable"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Experience</p>
          <p className="font-semibold text-foreground">{job.experience}</p>
        </div>
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          About the Role
        </h2>
        <p className="text-foreground leading-relaxed">{job.description}</p>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Required Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {JSON.parse(job?.skillsRequired).map((skill: string, idx: number) => (
            <span
              key={idx}
              className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Deadline */}
      <section className="mb-8">
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">
            Application Deadline
          </p>
          <p className="text-lg font-semibold text-foreground">
            {formatDate(job.dueDate)}
          </p>
        </div>
      </section>

      <Applicants jobId={job.id} />
      <div className="flex mt-4 justify-end">
        <AdminDeleteButton jobId={job.id} />
      </div>
    </div>
  );
}
