import React from "react";
import Link from "next/link";
import GetCart from "@/app/api/users/GetCart";
import ListCart from "@/app/components/ListCart";
const CartPage = async() => {
  const carts = await GetCart();

  return (
    <>
      <div className="container" style={{marginTop:"8rem"}}>
        <div className="row shadow my-4">
          <ListCart carts={carts}/>
          
        </div>
      </div>
    </>
  );
};

export default CartPage;
