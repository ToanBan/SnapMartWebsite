import api from "@/app/api/axios";

const DeleteCart = async (cartItemId: string) => {
  try {
    const res = await api.delete(`/api/carts/${cartItemId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return null;
  }
};

export default DeleteCart;
