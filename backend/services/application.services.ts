// services/application.service.ts
import prisma from "../lib/prisma";

export const createApplication = async (userId: number, jobId: number) => {
  if (!userId || !jobId) {
    throw new Error("Missing user or job ID");
  }

  // Check if the user has already applied
  const existingApplication = await prisma.application.findUnique({
    where: {
      jobId_userId: {
        jobId,
        userId,
      },
    },
  });

  if (existingApplication) {
    throw new Error("Already applied");
  }

  // Create a new application
  const application = await prisma.application.create({
    data: {
      userId,
      jobId,
    },
  });

  return application;
};

export const getApplicationsForUser = async (userId: number) => {
  return prisma.application.findMany({
    where: { userId },
    include: { job: true },
  });
};

export const getAllApplications = async () => {
  return prisma.application.findMany({
    include: { user: true, job: true },
  });
};

export const getApplicationsByJobId = async (jobId: number) => {
  const applications = await prisma.application.findMany({
    where: { jobId },
    include: { user: true },
  });

  // Map to only send necessary info
  return applications.map((app) => ({
    id: app.user.id,
    name: app.user.name,
    email: app.user.email,
  }));
};
