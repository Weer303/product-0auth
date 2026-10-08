import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct, CATEGORIES } from "@/lib/products";
import { updateProductAction } from "@/app/actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, product.id.toString());

  return (
    <main className="edit-container">
      <div className="edit-card">
        <h1>แก้ไขสินค้า</h1>
        <form action={updateAction} className="edit-form">
          <div className="form-group">
            <label htmlFor="title">ชื่อสินค้า</label>
            <input id="title" name="title" defaultValue={product.title} required />
          </div>

          <div className="form-group">
            <label htmlFor="price">ราคา</label>
            <input id="price" name="price" type="number" min="0" step="0.01" defaultValue={product.price} required />
          </div>

          <div className="form-group">
            <label htmlFor="stock">จำนวนคงเหลือ (Stock)</label>
            <input id="stock" name="stock" type="number" min="0" defaultValue={product.stock} required />
          </div>

          <div className="form-group">
            <label htmlFor="category">หมวดหมู่</label>
            <select id="category" name="category" defaultValue={product.category} required>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">รายละเอียด</label>
            <textarea id="description" name="description" rows={4} defaultValue={product.description} />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">บันทึก</button>
            <Link href="/" className="btn-cancel">ยกเลิก</Link>
          </div>
        </form>
      </div>
    </main>
  );
}