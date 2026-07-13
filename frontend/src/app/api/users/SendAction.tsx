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

    return;
  } catch (error) {
    console.error(error);
  }
};

export default SendAction;
