import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id.toString());

  return (
    <main className="delete-container">
      <div className="delete-card">
        <div className="delete-icon-wrapper">
          <span className="delete-icon">⚠️</span>
        </div>
        <h1>ยืนยันการลบ</h1>
        <p className="delete-message">
          คุณต้องการลบสินค้า <span>"{product.title}"</span> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>

        <div className="delete-actions">
          <form action={deleteAction} className="delete-form-btn">
            <button type="submit" className="btn-confirm-delete">ยืนยันการลบ</button>
          </form>
          <Link href="/" className="btn-back">ยกเลิก</Link>
        </div>
      </div>
    </main>
  );
}