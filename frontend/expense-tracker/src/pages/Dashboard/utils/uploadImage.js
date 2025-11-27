import { API_PATHS } from './apiPath'; // filename and export match!
import axiosInstance from './axiosInstance'; // Should have baseURL: "http://localhost:8000"

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    // Use correct config key!
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading the image:', error);
    throw error;
  }
};

export default uploadImage;
