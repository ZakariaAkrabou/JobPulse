import type { Request, Response } from "express";
import { getAuthUser } from "../types/auth.js";
import { listMatchesForUser } from "../services/match/match-query.service.js";


export async function getMatches(req: Request, res: Response) {

    const { userId } = getAuthUser(req);

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const minScore = Number(req.query.minScore) || 0;

    const result = await listMatchesForUser({
        userId: BigInt(userId),
        page,
        limit,
        minScore,
    });
    return res.status(200).json({
    success: true,
    data: result,
  });
}