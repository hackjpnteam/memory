"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  token: string;
}

export function DeleteProductButton({
  productId,
  productName,
  token,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`「${productName}」を削除しますか？\nこの操作は取り消せません。`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/products/${productId}?token=${token}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("商品の削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
