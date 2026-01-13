import React from "react";

const RedirectTransaction = async ({
  selectedItems,
  address,
  phone,
  method,
  quantityUpdatedItemsFiltered,
}: {
  selectedItems: any[];
  address: string;
  phone: string;
  method: string;
  quantityUpdatedItemsFiltered: { id: number; quantity: number }[];
}) => {
  try {
    const res = await fetch("http://localhost:5000/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ selectedItems, address, phone, method, quantityUpdatedItemsFiltered}),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default RedirectTransaction;
