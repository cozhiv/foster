import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const resend = new Resend(process.env.RESEND_API_KEY);