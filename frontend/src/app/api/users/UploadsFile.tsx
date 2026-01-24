import React from "react";

const UploadsFile = async (file: File) => {
  const formData = new FormData();
  formData.append("fileName", file);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-file`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default UploadsFile;
