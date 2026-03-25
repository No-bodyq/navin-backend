import { Router } from 'express';
import { asyncHandler } from '../../shared/http/asyncHandler.js';
import { getTelemetry } from './telemetry.controller.js';

export const telemetryRouter = Router();

telemetryRouter.get('/', asyncHandler(getTelemetry));
