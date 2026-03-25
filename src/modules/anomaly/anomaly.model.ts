import { Schema, Types, model } from 'mongoose';

const AnomalySchema = new Schema(
  {
    shipmentId: { type: Types.ObjectId, ref: 'Shipment', required: true },
    telemetryId: { type: Types.ObjectId, ref: 'Telemetry', required: true },
    type: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    message: { type: String, required: true },
    detectedValue: { type: Number, required: true },
    threshold: { type: Number, required: true },
  },
  { timestamps: true },
);

AnomalySchema.index({ shipmentId: 1, createdAt: -1 });
AnomalySchema.index({ severity: 1, createdAt: -1 });
AnomalySchema.index({ createdAt: -1, _id: -1 });

export const Anomaly = model('Anomaly', AnomalySchema);
