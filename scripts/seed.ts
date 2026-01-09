import mongoose from "mongoose";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in .env.local");
}

// Product schema (inline to avoid import issues)
const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    category: { type: String, default: "memory-module" },
    status: {
      type: String,
      enum: ["アクティブ", "新規設計非推奨", "生産中止品", "購入可能最終日あり"],
      default: "アクティブ",
    },
    formFactor: {
      type: String,
      enum: ["UDIMM", "SODIMM", "RDIMM", "LRDIMM", "その他"],
      required: true,
    },
    memoryType: {
      type: String,
      enum: ["DDR5", "DDR4", "LPDDR5", "LPDDR4", "DDR3", "DDR2", "その他"],
      required: true,
    },
    capacityGB: { type: Number, required: true },
    ecc: { type: Boolean, default: false },
    speedMT: { type: Number, required: true },
    voltageV: { type: Number, default: null },
    tempGrade: {
      type: String,
      enum: ["民生", "産業", "車載", "不明"],
      default: "民生",
    },
    leadTimeDays: { type: Number, default: null },
    stockQty: { type: Number, default: 0 },
    moq: { type: Number, default: 1 },
    datasheetUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    shortDesc: { type: String, default: "" },
    specs: [{ key: String, value: String }],
    referencePriceJPY: { type: Number, default: null },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

// Seed data configuration
const MANUFACTURERS = ["Century Micro", "Micron", "Samsung", "SK hynix"];
const STATUSES = [
  "アクティブ",
  "アクティブ",
  "アクティブ",
  "新規設計非推奨",
  "生産中止品",
  "購入可能最終日あり",
];
const FORM_FACTORS = ["UDIMM", "SODIMM", "RDIMM", "LRDIMM"];
const MEMORY_TYPES_DDR4 = ["DDR4"];
const MEMORY_TYPES_DDR5 = ["DDR5"];
const CAPACITIES = [8, 16, 32, 64, 128];
const SPEEDS_DDR4 = [2666, 2933, 3200];
const SPEEDS_DDR5 = [4800, 5200, 5600, 6000, 6400];
const TEMP_GRADES = ["民生", "民生", "産業"];
const VOLTAGES_DDR4 = [1.2];
const VOLTAGES_DDR5 = [1.1];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSlug(
  manufacturer: string,
  memoryType: string,
  capacity: number,
  formFactor: string,
  index: number
): string {
  const mfrCode = manufacturer.toLowerCase().replace(/\s+/g, "-");
  return `${mfrCode}-${memoryType.toLowerCase()}-${capacity}gb-${formFactor.toLowerCase()}-${index
    .toString()
    .padStart(3, "0")}`;
}

function generateProducts(count: number) {
  const products = [];

  for (let i = 0; i < count; i++) {
    const manufacturer = randomItem(MANUFACTURERS);
    const isDDR5 = Math.random() > 0.4; // 60% DDR5
    const memoryType = isDDR5
      ? randomItem(MEMORY_TYPES_DDR5)
      : randomItem(MEMORY_TYPES_DDR4);
    const capacity = randomItem(CAPACITIES);
    const formFactor = randomItem(FORM_FACTORS);
    const speed = isDDR5 ? randomItem(SPEEDS_DDR5) : randomItem(SPEEDS_DDR4);
    const voltage = isDDR5 ? randomItem(VOLTAGES_DDR5) : randomItem(VOLTAGES_DDR4);
    const ecc = Math.random() > 0.6;
    const tempGrade = randomItem(TEMP_GRADES);
    const status = randomItem(STATUSES);
    const stockQty = Math.random() > 0.3 ? randomInt(0, 500) : 0;
    const hasLeadTime = Math.random() > 0.4;
    const leadTimeDays = hasLeadTime ? randomInt(7, 60) : null;
    const moq = randomItem([1, 5, 10, 25, 50]);
    const hasPrice = Math.random() > 0.3;
    const basePrice = capacity * 100 + speed / 10 + (ecc ? 500 : 0);
    const referencePriceJPY = hasPrice
      ? Math.round(basePrice * (0.8 + Math.random() * 0.4))
      : null;

    const slug = generateSlug(manufacturer, memoryType, capacity, formFactor, i + 1);

    const name = `${manufacturer} ${memoryType} ${capacity}GB ${formFactor}${
      ecc ? " ECC" : ""
    } ${speed}MT/s`;

    const shortDesc = `${manufacturer}製 ${memoryType} メモリモジュール。${capacity}GB、${speed}MT/s、${formFactor}フォームファクタ。${
      tempGrade === "産業" ? "産業グレード対応。" : ""
    }${ecc ? "ECC対応で高い信頼性を実現。" : ""}`;

    const specs = [
      { key: "チップ構成", value: `${capacity / 8}Gbit x8` },
      { key: "動作温度", value: tempGrade === "産業" ? "-40°C ~ +85°C" : "0°C ~ +70°C" },
      { key: "CAS Latency", value: isDDR5 ? "CL40" : "CL22" },
    ];

    products.push({
      slug,
      name,
      manufacturer,
      category: "memory-module",
      status,
      formFactor,
      memoryType,
      capacityGB: capacity,
      ecc,
      speedMT: speed,
      voltageV: voltage,
      tempGrade,
      leadTimeDays,
      stockQty,
      moq,
      datasheetUrl: null,
      imageUrl: null,
      shortDesc,
      specs,
      referencePriceJPY,
    });
  }

  return products;
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  console.log("Clearing existing products...");
  await Product.deleteMany({});

  const products = generateProducts(40);
  console.log(`Inserting ${products.length} products...`);
  await Product.insertMany(products);

  console.log("Seed completed successfully!");
  console.log(`Created ${products.length} products.`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
