import mongoose, { Schema, Document, Model } from "mongoose";

export const LEAD_TYPES = ["見積", "相談"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;
  type: LeadType;
  company: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  productSlug: string | null;
  qty: number | null;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    type: { type: String, enum: LEAD_TYPES, required: true, index: true },
    company: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    message: { type: String, required: true },
    productSlug: { type: String, default: null },
    qty: { type: Number, default: null },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });

export const Lead: Model<ILead> =
  (mongoose.models?.Lead as Model<ILead>) || mongoose.model<ILead>("Lead", LeadSchema);
