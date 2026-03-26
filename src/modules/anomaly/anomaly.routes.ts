import { Router } from 'express';
import { asyncHandler } from '../../shared/http/asyncHandler.js';
import { getAnomalies } from './anomaly.controller.js';

export const anomaliesRouter = Router();

anomaliesRouter.get('/', asyncHandler(getAnomalies));
