import Link from "next/link"; 
import { auth } from "@/auth"; 
import { getProducts } from "@/lib/products"; 
import { AuthButtons } from "@/components/auth-buttons"; 

export default async function HomePage() { 
  const session = await auth(); 
  const products = getProducts(); 
  const isLoggedIn = !!session?.user; 

  return ( 
    <main className="home-container"> 
      <header className="home-header">
        <h1>รายการสินค้า</h1> 
        <div className="auth-section">
          <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} /> 
        </div>
      </header> 

      <div className="product-grid"> 
        {products.map((product) => ( 
          <article key={product.id} data-testid="product" className="product-card">
            <div className="product-info">
              <h2>{product.name}</h2> 
              <p className="product-desc">{product.description}</p> 
              <p className="product-price">฿{product.price.toLocaleString("th-TH")}</p> 
            </div>
            
            {isLoggedIn && ( 
              <div className="product-actions"> 
                <Link href={`/products/${product.id}/edit`} className="btn-edit">แก้ไข</Link> 
                <Link href={`/products/${product.id}/delete`} className="btn-delete">ลบ</Link> 
              </div> 
            )} 
          </article> 
        ))} 
      </div> 

      {products.length === 0 && <p className="no-product">ไม่มีสินค้า</p>} 
    </main> 
  ); 
}