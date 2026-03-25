import { Anomaly } from './anomaly.model.js';
import type { FilterQuery } from 'mongoose';

interface TelemetryData {
  _id: string;
  shipmentId: string;
  temperature: number;
  humidity: number;
  batteryLevel: number;
}

interface AnomalyResult {
  detected: boolean;
  anomaly?: {
    _id: string;
    shipmentId: string;
    telemetryId: string;
    type: string;
    severity: string;
    message: string;
    detectedValue: number;
    threshold: number;
  };
}

export async function detectAnomaly(data: TelemetryData): Promise<AnomalyResult> {
  if (data.temperature > 25) {
    const anomaly = await Anomaly.create({
      shipmentId: data.shipmentId,
      telemetryId: data._id,
      type: 'temperature',
      severity: data.temperature > 30 ? 'high' : 'medium',
      message: `Temperature exceeded threshold: ${data.temperature}°C`,
      detectedValue: data.temperature,
      threshold: 25,
    });
    const obj = anomaly.toObject();
    return {
      detected: true,
      anomaly: {
        _id: obj._id.toString(),
        shipmentId: obj.shipmentId.toString(),
        telemetryId: obj.telemetryId.toString(),
        type: obj.type,
        severity: obj.severity,
        message: obj.message,
        detectedValue: obj.detectedValue,
        threshold: obj.threshold,
      },
    };
  }

  if (data.humidity > 80) {
    const anomaly = await Anomaly.create({
      shipmentId: data.shipmentId,
      telemetryId: data._id,
      type: 'humidity',
      severity: data.humidity > 90 ? 'high' : 'medium',
      message: `Humidity exceeded threshold: ${data.humidity}%`,
      detectedValue: data.humidity,
      threshold: 80,
    });
    const obj = anomaly.toObject();
    return {
      detected: true,
      anomaly: {
        _id: obj._id.toString(),
        shipmentId: obj.shipmentId.toString(),
        telemetryId: obj.telemetryId.toString(),
        type: obj.type,
        severity: obj.severity,
        message: obj.message,
        detectedValue: obj.detectedValue,
        threshold: obj.threshold,
      },
    };
  }

  if (data.batteryLevel < 20) {
    const anomaly = await Anomaly.create({
      shipmentId: data.shipmentId,
      telemetryId: data._id,
      type: 'battery',
      severity: data.batteryLevel < 10 ? 'high' : 'low',
      message: `Battery level critically low: ${data.batteryLevel}%`,
      detectedValue: data.batteryLevel,
      threshold: 20,
    });
    const obj = anomaly.toObject();
    return {
      detected: true,
      anomaly: {
        _id: obj._id.toString(),
        shipmentId: obj.shipmentId.toString(),
        telemetryId: obj.telemetryId.toString(),
        type: obj.type,
        severity: obj.severity,
        message: obj.message,
        detectedValue: obj.detectedValue,
        threshold: obj.threshold,
      },
    };
  }

  return { detected: false };
}

export async function getAnomaliesService(params: {
  cursor?: string;
  limit: number;
  shipmentId?: string;
  severity?: string;
}) {
  const { cursor, limit, shipmentId, severity } = params;
  const query: FilterQuery<unknown> = {};

  if (shipmentId) query.shipmentId = shipmentId;
  if (severity) query.severity = severity;
  if (cursor) query._id = { $lt: cursor };

  const anomalies = await Anomaly.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = anomalies.length > limit;
  const data = hasMore ? anomalies.slice(0, limit) : anomalies;
  const nextCursor = hasMore && data.length > 0 ? data[data.length - 1]._id.toString() : null;

  return { data, nextCursor, hasMore };
}
