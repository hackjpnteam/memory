"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";
import {
  PRODUCT_STATUS,
  FORM_FACTORS,
  MEMORY_TYPES,
  TEMP_GRADES,
  IProduct,
} from "@/lib/models/Product";

interface ProductFormProps {
  product?: Partial<IProduct>;
  token: string;
  mode: "create" | "edit";
}

const CHIP_MANUFACTURERS = [
  "Samsung",
  "SK hynix",
  "Micron",
  "その他",
] as const;

export function ProductForm({ product, token, mode }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    product?.specs || []
  );

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    manufacturer: product?.manufacturer || "センチュリーマイクロ",
    chipManufacturer: "", // 搭載チップメーカー（参考情報）
    status: product?.status || "アクティブ",
    formFactor: product?.formFactor || "UDIMM",
    memoryType: product?.memoryType || "DDR5",
    capacityGB: product?.capacityGB || 8,
    ecc: product?.ecc || false,
    speedMT: product?.speedMT || 4800,
    voltageV: product?.voltageV || 1.1,
    tempGrade: product?.tempGrade || "民生",
    leadTimeDays: product?.leadTimeDays || null,
    stockQty: product?.stockQty || 0,
    moq: product?.moq || 1,
    datasheetUrl: product?.datasheetUrl || "",
    imageUrl: product?.imageUrl || "",
    shortDesc: product?.shortDesc || "",
    referencePriceJPY: product?.referencePriceJPY || null,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? null
            : parseFloat(value)
          : value,
    }));
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function addSpec() {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSpec(index: number, field: "key" | "value", value: string) {
    setSpecs((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        specs: specs.filter((s) => s.key && s.value),
        // 搭載チップメーカーをspecsに追加
        ...(formData.chipManufacturer && {
          specs: [
            ...specs.filter((s) => s.key && s.value),
            { key: "搭載チップ", value: formData.chipManufacturer },
          ],
        }),
      };

      const url =
        mode === "create"
          ? `/api/admin/products?token=${token}`
          : `/api/admin/products/${product?._id}?token=${token}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      router.push(`/admin/products?token=${token}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("商品の保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">商品名 *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="例: CD8G-D5U4800"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">スラッグ（自動生成）</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="空欄で自動生成"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDesc">商品説明</Label>
            <Textarea
              id="shortDesc"
              name="shortDesc"
              value={formData.shortDesc}
              onChange={handleChange}
              placeholder="商品の簡単な説明"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">ステータス *</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleSelectChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chipManufacturer">搭載チップメーカー（参考）</Label>
              <Select
                value={formData.chipManufacturer}
                onValueChange={(v) => handleSelectChange("chipManufacturer", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {CHIP_MANUFACTURERS.map((mfr) => (
                    <SelectItem key={mfr} value={mfr}>
                      {mfr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* スペック情報 */}
      <Card>
        <CardHeader>
          <CardTitle>スペック情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memoryType">メモリタイプ *</Label>
              <Select
                value={formData.memoryType}
                onValueChange={(v) => handleSelectChange("memoryType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEMORY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="formFactor">フォームファクター *</Label>
              <Select
                value={formData.formFactor}
                onValueChange={(v) => handleSelectChange("formFactor", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORM_FACTORS.map((form) => (
                    <SelectItem key={form} value={form}>
                      {form}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacityGB">容量 (GB) *</Label>
              <Input
                id="capacityGB"
                name="capacityGB"
                type="number"
                value={formData.capacityGB}
                onChange={handleChange}
                min={1}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speedMT">速度 (MT/s) *</Label>
              <Input
                id="speedMT"
                name="speedMT"
                type="number"
                value={formData.speedMT}
                onChange={handleChange}
                min={1}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voltageV">電圧 (V)</Label>
              <Input
                id="voltageV"
                name="voltageV"
                type="number"
                step="0.01"
                value={formData.voltageV || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tempGrade">温度グレード</Label>
              <Select
                value={formData.tempGrade}
                onValueChange={(v) => handleSelectChange("tempGrade", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMP_GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="ecc"
                checked={formData.ecc}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, ecc: checked }))
                }
              />
              <Label htmlFor="ecc">ECC対応</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 在庫・価格情報 */}
      <Card>
        <CardHeader>
          <CardTitle>在庫・価格情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockQty">在庫数</Label>
              <Input
                id="stockQty"
                name="stockQty"
                type="number"
                value={formData.stockQty}
                onChange={handleChange}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moq">最小注文数量 (MOQ)</Label>
              <Input
                id="moq"
                name="moq"
                type="number"
                value={formData.moq}
                onChange={handleChange}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadTimeDays">リードタイム（日）</Label>
              <Input
                id="leadTimeDays"
                name="leadTimeDays"
                type="number"
                value={formData.leadTimeDays || ""}
                onChange={handleChange}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referencePriceJPY">参考価格（円）</Label>
              <Input
                id="referencePriceJPY"
                name="referencePriceJPY"
                type="number"
                value={formData.referencePriceJPY || ""}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メディア */}
      <Card>
        <CardHeader>
          <CardTitle>メディア・リンク</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">商品画像URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl || ""}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="datasheetUrl">データシートURL</Label>
              <Input
                id="datasheetUrl"
                name="datasheetUrl"
                type="url"
                value={formData.datasheetUrl || ""}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 追加スペック */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>追加スペック</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addSpec}>
            <Plus className="h-4 w-4 mr-1" />
            追加
          </Button>
        </CardHeader>
        <CardContent>
          {specs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              追加のスペック情報がありません
            </p>
          ) : (
            <div className="space-y-2">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="項目名"
                    value={spec.key}
                    onChange={(e) => updateSpec(index, "key", e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="値"
                    value={spec.value}
                    onChange={(e) => updateSpec(index, "value", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpec(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 送信ボタン */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/products?token=${token}`)}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {mode === "create" ? "商品を作成" : "変更を保存"}
        </Button>
      </div>
    </form>
  );
}
