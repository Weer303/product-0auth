import { z } from "zod";

export const CATEGORIES = [
  "beauty", "fragrances", "furniture", "groceries",
  "home-decoration", "kitchen-accessories", "laptops",
  "mens-shirts", "mens-shoes", "mens-watches",
  "mobile-accessories", "motorcycle", "skin-care",
  "smartphones", "sports-accessories", "sunglasses",
  "tablets", "tops", "vehicle", "womens-bags",
  "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches",
] as const;

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.coerce.number().min(0, "ราคาต้องไม่ติดลบ"),
  stock: z.coerce.number().min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.string(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
});

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;

const BASE_URL = "https://dummyjson.com/products";
let memoryProducts: Product[] = [];
export async function getProducts(): Promise<Product[]> {
  if (memoryProducts.length > 0) {
    return memoryProducts;
  }
  try {
    const res = await fetch(`${BASE_URL}?limit=20`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    const parsed = ProductListSchema.safeParse(data);
    if (parsed.success) {
      memoryProducts = parsed.data.products;
      return memoryProducts;
    }
    return [];
  } catch (error) {
    return [];
  }
}

export async function getProduct(id: string | number): Promise<Product | undefined> {
  const numericId = Number(id);
  const found = memoryProducts.find((p) => p.id === numericId);
  if (found) return found;

  try {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' });
    if (!res.ok) return undefined;
    const data = await res.json();
    return ProductSchema.parse(data);
  } catch (error) {
    return undefined;
  }
}

export function updateProduct(
  id: string | number,
  values: Pick<Product, "title" | "price" | "description" | "category" | "stock">
) {
  const numericId = Number(id);
  const product = memoryProducts.find((p) => p.id === numericId);
  if (!product) {
    throw new Error("Product not found");
  }
  product.title = values.title;
  product.price = values.price;
  product.description = values.description;
  product.category = values.category;
  product.stock = values.stock;
}

export function deleteProduct(id: string | number) {
  const numericId = Number(id);
  const index = memoryProducts.findIndex((p) => p.id === numericId);
  if (index === -1) {
    throw new Error("Product not found");
  }
  memoryProducts.splice(index, 1);
}