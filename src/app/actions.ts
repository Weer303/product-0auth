"use server";

import { auth } from "@/auth";
import { deleteProduct, updateProduct } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const category = String(formData.get("category") ?? "laptops") as any;
  updateProduct(id, { title, description, price, stock, category });
  revalidatePath("/");
  redirect("/");
}

export async function deleteProductAction(id: string) {
  await requireUser();
  deleteProduct(id);
  revalidatePath("/");
  redirect("/");
}