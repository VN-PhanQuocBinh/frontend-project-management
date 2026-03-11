import axiosClient from "./axios-client";

export const uploadImage = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosClient.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("Upload response:", response);

  return response.data;
};
