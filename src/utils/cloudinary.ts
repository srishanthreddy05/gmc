export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "gmc_products");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dakgppa8o/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Cloudinary error:", error);
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url;
}
