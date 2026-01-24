const SendAction = async ({ actions }: { actions: any[] }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/send-action`, {
      method: "POST",
      body: JSON.stringify({ actions }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Send action failed");
    }
    const data = await res.json();
    if (data.recommendProductIds) {
      localStorage.setItem(
        "productIds",
        JSON.stringify({
          ids: data.recommendProductIds,
          createdAt: Date.now(),
        })
      );
    }

    return;
  } catch (error) {
    console.error(error);
  }
};

export default SendAction;
