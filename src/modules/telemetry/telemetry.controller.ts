import type { Request, Response } from 'express';
import { getTelemetryService } from './telemetry.service.js';

export const getTelemetry = async (req: Request, res: Response) => {
  const { cursor, limit = 20, shipmentId } = req.query;

  const result = await getTelemetryService({
    cursor: cursor as string | undefined,
    limit: Number(limit),
    shipmentId: shipmentId as string | undefined,
  });

  res.json(result);
};
