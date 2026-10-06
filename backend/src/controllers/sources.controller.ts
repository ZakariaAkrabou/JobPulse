import type { Request, Response } from "express";
import { listActiveSources } from "../services/sources.service.js";



function serializeSource(source: any) {
  return {
    id: source.id.toString(),
    name: source.name,
    isActive : source.isActive,
  };
}

export async function getSources(_req: Request, res: Response) {
    
    const sources = await listActiveSources();
    
    return res.status(200).json({
        success: true,
        data: {
            sources: sources.map(serializeSource),
        },
    })
}