"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteCart from "../api/users/DeleteCart";
import AlertSuccess from "./share/AlertSuccess";
import AlertError from "./share/AlertError";
import { notifyCartChange } from "@/hooks/cartEvent";
import RedirectTransaction from "../api/users/RedirectTransaction";
import { useRouter } from "next/navigation";

const ListCart = ({ carts }: { carts: any }) => {
  const imageUrl = "http://localhost:5000/uploads/";
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [cartItems, setCartItems] = useState(carts);
  const [address, setAdress] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("cod");
  const [message, setMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    { id: string; price: string; quantity: number }[]
  >([]);
  const [selectedCountCartItems, setSelectedCountCartItems] = useState(0);
  const [countCartItems, setCountCartItems] = useState(cartItems.length || 0);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();

  const [totalPriceItem, setTotalPriceItem] = useState<
    Partial<{ [key: string]: number }>
  >(() => {
    const initPriceItem: Partial<{ [key: string]: number }> = {};
    carts.forEach((cartItem: any) => {
      initPriceItem[cartItem.id] = cartItem.product.price;
    });
    return initPriceItem;
  });

  const [itemQuantities, setItemQuantities] = useState<{
    [key: string]: number;
  }>(() => {
    const initialQuantities: { [key: string]: number } = {};
    carts.forEach((cartItem: any) => {
      initialQuantities[cartItem.id] = 1;
    });
    return initialQuantities;
  });

  const toggleSelect = (id: number, price: number, quantity: number) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some(
        (item) => item.id === id.toString()
      );
      if (isSelected) {
        const updatedItems = prevSelectedItems.filter(
          (item) => item.id !== id.toString()
        );
        setSelectedCountCartItems(updatedItems.length);

        return updatedItems;
      } else {
        const updatedItems = [
          ...prevSelectedItems,
          { id: id.toString(), price: price.toString(), quantity },
        ];
        setSelectedCountCartItems(updatedItems.length);
        return updatedItems;
      }
    });
  };

  const handleIncrease = (id: string) => {
    setItemQuantities((prev) => {
      const newQuantity = (prev[id] || 1) + 1;
      return { ...prev, [id]: newQuantity };
    });
  };

  const handleDecrease = (id: string) => {
    if (itemQuantities[id] > 1) {
      setItemQuantities((prev) => {
        const newQuantity = (prev[id] || 1) - 1;
        return { ...prev, [id]: newQuantity };
      });
    }
  };

  const DeleteCartItem = async (cartItemId: string) => {
    const result = await DeleteCart(cartItemId);
    if (result.message === "Cart item deleted") {
      setMessage("Cart item deleted successfully");
      setSuccess(true);
      setCartItems((prev: any[]) =>
        prev.filter((item) => item.id !== cartItemId)
      );
      setCountCartItems(countCartItems - 1);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      notifyCartChange();
    } else {
      setMessage("Failed to delete cart item");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  const handleRedirect = async () => {
    if (!selectedItems || !address || !phone || !method) {
      setMessage("Please slect items and provede address and phone number");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      return;
    }

    const quantityUpdatedItems = Object.entries(itemQuantities).map(
      ([id, quantity]) => ({
        id: Number(id),
        quantity,
      })
    );

    const quantityUpdatedItemsFiltered = quantityUpdatedItems.filter((item) =>
      selectedItems.some((selected) => Number(selected.id) === item.id)
    );

    console.log(
      "Quantity Updated Items Filtered:",
      quantityUpdatedItemsFiltered
    );
    try {
      const results = await RedirectTransaction({
        selectedItems,
        address,
        phone,
        method,
        quantityUpdatedItemsFiltered,
      });
      if (results && results.method === "payment") {
        window.location.href = results.checkoutUrl;
      } else if (results && results.orderId) {
        const query = results.orderId;
        router.push(`/success?orderId=${query}`);
      }
    } catch (error) {
      console.error("Error during transaction redirect:", error);
      return;
    }
  };

  useEffect(() => {
    let total = 0;
    selectedItems.forEach((item) => {
      const price = Number(item.price);
      const quantity = itemQuantities[item.id] || 1;
      total += price * quantity;
    });
    setTotalPrice(total);
  });
 
  return (
    <>
      <div className="col-12 col-md-8 bg-white p-4">
        <div className="d-flex justify-content-between border-bottom pb-3">
          <h1 className="fw-semibold fs-3">Shopping Cart</h1>
          <h2 className="fw-semibold fs-3">{countCartItems} Items</h2>
        </div>

        {cartItems && cartItems.length > 0 ? (
          cartItems.map((cartItem: any) => (
            <div key={cartItem.id} className="row py-4 border-top">
              {/* Checkbox */}
              <div className="col-1 d-flex align-items-start pt-2">
                <input
                  type="checkbox"
                  checked={selectedItems.some(
                    (item) => item.id === cartItem.id.toString()
                  )}
                  onChange={() =>
                    toggleSelect(
                      cartItem.id,
                      cartItem.product.price,
                      itemQuantities[cartItem.id] || 1
                    )
                  }
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
              </div>

              {/* Ảnh */}
              <div className="col-md-3 col-11">
                <Image
                  className="img-fluid d-none d-md-block"
                  width={300}
                  height={300}
                  alt={cartItem.product.productName}
                  src={`${imageUrl}${cartItem.product.image}`}
                />
                <img
                  src="https://i.ibb.co/TTnzMTf/Rectangle-21.png"
                  alt="Product"
                  className="img-fluid d-md-none"
                />
              </div>

              {/* Thông tin */}
              <div className="col-md-8 d-flex flex-column justify-content-center">
                <p className="small text-muted mb-1">#{cartItem.product.id}</p>

                <div className="d-flex justify-content-between align-items-center">
                  <p className="fw-bold mb-0">{cartItem.product.productName}</p>

                  {/* Nút tăng giảm số lượng */}
                  <div className="btn-group rounded-4 shadow-sm" role="group">
                    <button
                      type="button"
                      className="btn btn-light border fw-bold px-3 py-1"
                      style={{ borderRadius: "12px 0 0 12px" }}
                      onClick={() => handleDecrease(cartItem.id)}
                    >
                      −
                    </button>

                    <button
                      type="button"
                      className="btn btn-white fw-semibold px-3 py-1"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderTop: "1px solid #dee2e6",
                        borderBottom: "1px solid #dee2e6",
                      }}
                    >
                      {itemQuantities[cartItem.id] || 1}
                    </button>

                    <button
                      type="button"
                      className="btn btn-light border fw-bold px-3 py-1"
                      style={{ borderRadius: "0 12px 12px 0" }}
                      onClick={() => handleIncrease(cartItem.id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className="small text-secondary mt-2 mb-1">
                  Height: 10 inches
                </p>
                <p className="small text-secondary mb-1">Color: Black</p>
                <p className="small text-secondary">
                  Composition: 100% calf leather
                </p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <a
                      href="#"
                      className="small text-decoration-underline text-dark"
                    >
                      Add to favorites
                    </a>
                    <a
                      href="#"
                      className="small text-decoration-underline text-danger ms-3"
                      onClick={() => DeleteCartItem(cartItem.id)}
                    >
                      Remove
                    </a>
                  </div>

                  <p className="fw-bold mb-0">
                    {(
                      (totalPriceItem[cartItem.id] || 0) *
                      (itemQuantities[cartItem.id] || 1)
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}

        <Link
          href={"/shop"}
          className="d-flex align-items-center fw-semibold text-primary text-decoration-none mt-4"
        >
          <svg
            className="me-2"
            width="16"
            fill="currentColor"
            viewBox="0 0 448 512"
          >
            <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      <div className="col-12 col-md-4 p-4">
        <h1 className="fw-semibold fs-3 border-bottom pb-3">Order Summary</h1>
        <div className="d-flex justify-content-between mt-4 mb-3">
          <span className="fw-semibold text-uppercase small">
            Items {selectedCountCartItems}
          </span>
          <span className="fw-semibold small">
            {totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium small text-uppercase">
            Shipping
          </label>
          <select
            name="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="form-select form-select-sm"
          >
            <option value={"cod"}>COD</option>
            <option value={"payment"}>Thanh Toán</option>
          </select>
        </div>
        <div className="mb-3">
          <label
            htmlFor="promo"
            className="form-label fw-semibold small text-uppercase"
          >
            Promo Code
          </label>
          <input
            type="text"
            id="promo"
            className="form-control form-control-sm"
            placeholder="Enter your code"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="phone"
            className="form-label fw-semibold small text-uppercase"
          >
            Phone Number
          </label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-control form-control-sm"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="address"
            className="form-label fw-semibold small text-uppercase"
          >
            Your Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-control form-control-sm"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAdress(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-danger btn-sm text-uppercase">Apply</button>
        <div className="border-top mt-4 pt-3">
          <div className="d-flex justify-content-between fw-semibold small text-uppercase py-2">
            <span>Total cost</span>
            <span>
              {totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>
          <button
            onClick={handleRedirect}
            className="btn btn-primary w-100 text-uppercase fw-semibold"
          >
            Checkout
          </button>
        </div>
      </div>

      {success && <AlertSuccess message={message} />}
      {error && <AlertError message={message} />}
    </>
  );
};

export default ListCart;
