import axios from "axios";
import fs from "node:fs";
import path from "node:path";
import env from "../config/env";
import { prisma } from "../config/database";
import type { ParsedResume } from "../dto/ParsedResume";



export async function parseResumeFromBuffer(
  buffer: Buffer,
): Promise<ParsedResume> {
  const base64 = buffer.toString("base64");

  const response = await axios.post(
    `https://${env.RAPIDAPI_HOST}/processDocument`,
    {
      extractionDetails: {
        name: "Resume - Extraction",
        language: "English",
        fields: [
          {
            key: "personal_info",
            description: "personal information of the person",
            type: "object",
            properties: [
              { key: "name",    description: "name of the person",    example: "Alex Smith",             type: "string" },
              { key: "email",   description: "email of the person",   example: "alex.smith@gmail.com",   type: "string" },
              { key: "phone",   description: "phone of the person",   example: "0712 123 123",           type: "string" },
              { key: "address", description: "address of the person", example: "Bucharest, Romania",     type: "string" },
            ],
          },
          {
            key: "work_experience",
            description: "work experience of the person",
            type: "array",
            items: {
              type: "object",
              properties: [
                { key: "title",       description: "title of the job",       example: "Software Engineer",  type: "string" },
                { key: "start_date",  description: "start date of the job",  example: "2022",               type: "string" },
                { key: "end_date",    description: "end date of the job",    example: "2023",               type: "string" },
                { key: "company",     description: "company of the job",     example: "Fastapp",            type: "string" },
                { key: "location",    description: "location of the job",    example: "Bucharest, Romania", type: "string" },
                { key: "description", description: "description of the job", example: "Built APIs.",        type: "string" },
              ],
            },
          },
          {
            key: "education",
            description: "school education of the person",
            type: "array",
            items: {
              type: "object",
              properties: [
                { key: "title",       description: "title of the education",       example: "MSc CS",               type: "string" },
                { key: "start_date",  description: "start date of the education",  example: "2022",                 type: "string" },
                { key: "end_date",    description: "end date of the education",    example: "2023",                 type: "string" },
                { key: "institute",   description: "institute of the education",   example: "Academy",              type: "string" },
                { key: "location",    description: "location of the education",    example: "Bucharest, Romania",   type: "string" },
                { key: "description", description: "description of the education", example: "Advanced degree.",     type: "string" },
              ],
            },
          },
          { key: "languages",    description: "languages spoken by the person", type: "array", items: { type: "string", example: "English" } },
          { key: "skills",       description: "skills of the person",           type: "array", items: { type: "string", example: "NodeJS" } },
          { key: "certificates", description: "certificates of the person",     type: "array", items: { type: "string", example: "AWS Certified" } },
        ],
      },
      file: base64, 
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": env.RAPIDAPI_HOST,
      },
    },
  );

  return response.data as ParsedResume;
}



export async function saveParsedResume(
  userId: bigint,
  parsedJson: ParsedResume,
) {
  return prisma.userProfile.update({
    where: { userId },
    data: {
      resumeParsedText: JSON.stringify(parsedJson),
      resumeParsedJson: parsedJson as any,
    },
  });
}