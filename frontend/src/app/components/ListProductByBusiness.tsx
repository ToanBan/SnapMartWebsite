import React from "react";
import Pagination from "./share/Pagination";
import Image from "next/image";
import { Plus } from "lucide-react";
interface ProductProps {
  id: string;
  productName: string;
  price: string;
  description: string;
  image: string;
}

const ListProductByBusiness = ({ products, shopId, page}: { products: ProductProps[], shopId:string, page:number}) => {
  const imageUrl = "http://localhost:5000/uploads/";
  console.log(products);
  return (
    <>
      <section className="py-5 mt-5" id="products">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
          </div>
          <div className="row g-4">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div className="product-card shadow-sm">
                    <div className="product-img-wrapper">
                      <Image
                        src={`${imageUrl}${product.image}`}
                        alt={`${product.productName}`}
                        width={250}
                        height={250}
                      ></Image>
                    </div>
                    <div className="p-4">
                      <h5 className="fw-bold mb-2">{product.productName}</h5>
                      <p className="text-muted small">{product.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="fw-bold text-primary fs-5">
                          {product.price} VND
                        </span>
                        <button className="btn btn-sm btn-outline-primary">
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </section>

      <Pagination page={page} pathName={`http://localhost:3000/shop/${shopId}?page=`} />
    </>
  );
};

export default ListProductByBusiness;
