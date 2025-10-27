// controllers/application.controller.ts
import { Request, Response } from "express";
import {
  createApplication,
  getAllApplications,
  getApplicationsByJobId,
  getApplicationsForUser,
} from "../services/application.services";

export const applyForJob = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const jobId = parseInt(req.params.jobId);

  try {
    const application = await createApplication(userId, jobId);
    res.status(201).json(application);
  } catch (error: any) {
    if (error.message === "Already applied") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const applications =
      user.role === "ADMIN"
        ? await getAllApplications()
        : await getApplicationsForUser(user.userId);

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getApplicationsForSingleJob = async (
  req: Request,
  res: Response
) => {
  const jobId = Number(req.params.jobId);

  try {
    const applicants = await getApplicationsByJobId(jobId);
    res.json({ applicants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
