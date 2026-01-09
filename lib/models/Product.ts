import mongoose, { Schema, Document, Model } from "mongoose";

export const PRODUCT_STATUS = [
  "アクティブ",
  "新規設計非推奨",
  "生産中止品",
  "購入可能最終日あり",
] as const;

export const FORM_FACTORS = [
  "UDIMM",
  "SODIMM",
  "RDIMM",
  "LRDIMM",
  "その他",
] as const;

export const MEMORY_TYPES = [
  "DDR5",
  "DDR4",
  "LPDDR5",
  "LPDDR4",
  "DDR3",
  "DDR2",
  "その他",
] as const;

export const TEMP_GRADES = ["民生", "産業", "車載", "不明"] as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[number];
export type FormFactor = (typeof FORM_FACTORS)[number];
export type MemoryType = (typeof MEMORY_TYPES)[number];
export type TempGrade = (typeof TEMP_GRADES)[number];

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  manufacturer: string;
  category: string;
  status: ProductStatus;
  formFactor: FormFactor;
  memoryType: MemoryType;
  capacityGB: number;
  ecc: boolean;
  speedMT: number;
  voltageV: number | null;
  tempGrade: TempGrade;
  leadTimeDays: number | null;
  stockQty: number;
  moq: number;
  datasheetUrl: string | null;
  imageUrl: string | null;
  shortDesc: string;
  specs: { key: string; value: string }[];
  referencePriceJPY: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true, index: true },
    category: { type: String, default: "memory-module" },
    status: {
      type: String,
      enum: PRODUCT_STATUS,
      default: "アクティブ",
      index: true,
    },
    formFactor: {
      type: String,
      enum: FORM_FACTORS,
      required: true,
      index: true,
    },
    memoryType: {
      type: String,
      enum: MEMORY_TYPES,
      required: true,
      index: true,
    },
    capacityGB: { type: Number, required: true, index: true },
    ecc: { type: Boolean, default: false, index: true },
    speedMT: { type: Number, required: true, index: true },
    voltageV: { type: Number, default: null },
    tempGrade: { type: String, enum: TEMP_GRADES, default: "民生" },
    leadTimeDays: { type: Number, default: null },
    stockQty: { type: Number, default: 0, index: true },
    moq: { type: Number, default: 1 },
    datasheetUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    shortDesc: { type: String, default: "" },
    specs: [{ key: String, value: String }],
    referencePriceJPY: { type: Number, default: null },
  },
  { timestamps: true }
);

// Compound indexes for common queries
ProductSchema.index({ manufacturer: 1, memoryType: 1 });
ProductSchema.index({ memoryType: 1, capacityGB: 1 });
ProductSchema.index({ stockQty: -1 });
ProductSchema.index({ createdAt: -1 });

export const Product: Model<IProduct> =
  (mongoose.models?.Product as Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);
