import { NextRequest } from "next/server";
import GetCart from "./GetCart";

export async function GET(req: NextRequest) {
  try {
    const carts = await GetCart(); 
    return new Response(JSON.stringify({ message: carts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Error fetching cart" }),
      { status: 500 }
    );
  }
}
