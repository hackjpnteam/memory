import { z } from "zod";

export const leadSchema = z.object({
  type: z.enum(["見積", "相談"]),
  company: z.string().min(1, "会社名を入力してください"),
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  phone: z.string().optional().nullable(),
  message: z.string().min(1, "お問い合わせ内容を入力してください"),
  productSlug: z.string().optional().nullable(),
  qty: z.number().optional().nullable(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const checkoutSchema = z.object({
  slug: z.string().min(1),
  qty: z.number().min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productFilterSchema = z.object({
  mfr: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  form: z.string().optional(),
  capMin: z.coerce.number().optional(),
  capMax: z.coerce.number().optional(),
  ecc: z.enum(["true", "false"]).optional(),
  speedMin: z.coerce.number().optional(),
  speedMax: z.coerce.number().optional(),
  inStock: z.enum(["true", "false"]).optional(),
  sort: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type ProductFilter = z.infer<typeof productFilterSchema>;
