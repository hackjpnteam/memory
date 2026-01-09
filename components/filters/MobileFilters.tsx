"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilters } from "./ProductFilters";

export function MobileFilters() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <Filter className="h-4 w-4 mr-2" />
          フィルタ
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>絞り込み</SheetTitle>
        </SheetHeader>
        <ProductFilters className="mt-6" />
      </SheetContent>
    </Sheet>
  );
}
