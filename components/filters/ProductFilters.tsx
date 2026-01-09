"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  PRODUCT_STATUS,
  FORM_FACTORS,
  MEMORY_TYPES,
} from "@/lib/models/Product";

const CAPACITIES = [8, 16, 32, 64, 128];
const SPEED_MIN = 2666;
const SPEED_MAX = 6400;

interface ProductFiltersProps {
  className?: string;
}

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset page when filters change
      if (!("page" in updates)) {
        params.delete("page");
      }

      return params.toString();
    },
    [searchParams]
  );

  const toggleArrayValue = (key: string, value: string) => {
    const current = searchParams.get(key)?.split(",").filter(Boolean) ?? [];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    router.push(
      `/products?${createQueryString({
        [key]: newValue.length > 0 ? newValue.join(",") : null,
      })}`
    );
  };

  const isChecked = (key: string, value: string) => {
    const current = searchParams.get(key)?.split(",") ?? [];
    return current.includes(value);
  };

  const handleSpeedChange = (value: number[]) => {
    router.push(
      `/products?${createQueryString({
        speedMin: value[0] > SPEED_MIN ? String(value[0]) : null,
        speedMax: value[1] < SPEED_MAX ? String(value[1]) : null,
      })}`
    );
  };

  const handleReset = () => {
    router.push("/products");
  };

  const currentSpeedMin = Number(searchParams.get("speedMin")) || SPEED_MIN;
  const currentSpeedMax = Number(searchParams.get("speedMax")) || SPEED_MAX;
  const inStock = searchParams.get("inStock") === "true";
  const eccOnly = searchParams.get("ecc") === "true";

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Product Status */}
        <div>
          <h3 className="font-semibold mb-3">製品ステータス</h3>
          <div className="space-y-2">
            {PRODUCT_STATUS.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={isChecked("status", status)}
                  onCheckedChange={() => toggleArrayValue("status", status)}
                />
                <Label
                  htmlFor={`status-${status}`}
                  className="text-sm cursor-pointer"
                >
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Type */}
        <div>
          <h3 className="font-semibold mb-3">メモリタイプ</h3>
          <div className="space-y-2">
            {MEMORY_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={isChecked("type", type)}
                  onCheckedChange={() => toggleArrayValue("type", type)}
                />
                <Label
                  htmlFor={`type-${type}`}
                  className="text-sm cursor-pointer"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Form Factor */}
        <div>
          <h3 className="font-semibold mb-3">フォームファクタ</h3>
          <div className="space-y-2">
            {FORM_FACTORS.map((form) => (
              <div key={form} className="flex items-center space-x-2">
                <Checkbox
                  id={`form-${form}`}
                  checked={isChecked("form", form)}
                  onCheckedChange={() => toggleArrayValue("form", form)}
                />
                <Label
                  htmlFor={`form-${form}`}
                  className="text-sm cursor-pointer"
                >
                  {form}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div>
          <h3 className="font-semibold mb-3">容量 (GB)</h3>
          <div className="space-y-2">
            {CAPACITIES.map((cap) => (
              <div key={cap} className="flex items-center space-x-2">
                <Checkbox
                  id={`cap-${cap}`}
                  checked={isChecked("cap", String(cap))}
                  onCheckedChange={() => toggleArrayValue("cap", String(cap))}
                />
                <Label
                  htmlFor={`cap-${cap}`}
                  className="text-sm cursor-pointer"
                >
                  {cap}GB
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* ECC */}
        <div className="flex items-center justify-between">
          <Label htmlFor="ecc-toggle" className="font-semibold">
            ECC対応のみ
          </Label>
          <Switch
            id="ecc-toggle"
            checked={eccOnly}
            onCheckedChange={(checked) =>
              router.push(
                `/products?${createQueryString({
                  ecc: checked ? "true" : null,
                })}`
              )
            }
          />
        </div>

        {/* Speed Range */}
        <div>
          <h3 className="font-semibold mb-3">
            速度 (MT/s): {currentSpeedMin} - {currentSpeedMax}
          </h3>
          <Slider
            min={SPEED_MIN}
            max={SPEED_MAX}
            step={100}
            value={[currentSpeedMin, currentSpeedMax]}
            onValueChange={handleSpeedChange}
            className="w-full"
          />
        </div>

        {/* In Stock Only */}
        <div className="flex items-center justify-between">
          <Label htmlFor="stock-toggle" className="font-semibold">
            在庫ありのみ
          </Label>
          <Switch
            id="stock-toggle"
            checked={inStock}
            onCheckedChange={(checked) =>
              router.push(
                `/products?${createQueryString({
                  inStock: checked ? "true" : null,
                })}`
              )
            }
          />
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={handleReset} className="w-full">
          フィルタをリセット
        </Button>
      </div>
    </div>
  );
}
