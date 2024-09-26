


import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Tesseract from "tesseract.js"; 
import { useNavigate } from "react-router-dom";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [isBlurry, setIsBlurry] = useState(false);
  const [isTextImage, setIsTextImage] = useState(false);
  const [error, setError] = useState("");
  const [fileStatus, setFileStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  // Function to validate the file type and size
  const validateFile = (file) => {
    const fileSize = file.size / 1024 / 1024; // Size in MB
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Only .jpg and .png formats are allowed.");
      return false;
    }
    if (fileSize > 1) {
      setError("File size exceeds 1MB.");
      return false;
    }
    return true;
  };

  // Function to handle file selection/change
  const handleFileChange = (file) => {
    if (file) {
      // Reset errors and statuses when a new file is selected
      setError("");
      setIsBlurry(false);
      setIsTextImage(false);
      setFileStatus("");

      if (validateFile(file)) {
        const previewUrl = URL.createObjectURL(file);
        setImage({ file, preview: previewUrl });
        checkForBlur(file); // Call the OpenCV blur check function
        checkForText(file); // Call the OCR function to check for text readability
      }
    }
  };

  // Function to check for blurriness using OpenCV.js
  const checkForBlur = (file) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const src = cv.imread(canvas); // Read image from canvas using OpenCV.js
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0); // Convert to grayscale
      const laplacian = new cv.Mat();
      cv.Laplacian(gray, laplacian, cv.CV_64F); // Apply Laplacian filter

      const mean = new cv.Mat();
      const stddev = new cv.Mat();
      cv.meanStdDev(laplacian, mean, stddev); // Compute the standard deviation

      const varianceOfLaplacian = Math.pow(stddev.data64F[0], 2); // Variance
      const blurThreshold = 10 // You can adjust this threshold

      if (varianceOfLaplacian < blurThreshold) {
        setIsBlurry(true);
        setFileStatus("❌ This image appears blurry. Try a different one.");
      } else {
        setIsBlurry(false);
        setFileStatus("✅ The image is sharp and suitable for upload.");
      }

      // Clean up
      src.delete();
      gray.delete();
      laplacian.delete();
      mean.delete();
      stddev.delete();
    };
  };

  // Function to check if image contains text using Tesseract.js
  const checkForText = (file) => {
    Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => console.log(m), // Optionally log OCR progress
      }
    ).then(({ data: { text } }) => {
      // If text is detected in the image
      if (text.trim()) {
        setIsTextImage(true);
        console.log("Detected text in image:", text);

        // We could apply additional checks for text readability here
        if (text.length > 5) { // Assuming that a valid text image should have more than 5 characters
          setFileStatus("✅ The image contains readable text.");
        } else {
          setFileStatus("❌ The image contains text, but it might not be clear.");
          setIsBlurry(true); // Mark image as blurry if text isn't clear enough
        }
      } else {
        setIsTextImage(false); // No text detected
        setFileStatus("✅ This appears to be a normal image.");
      }
    });
  };

  // Function to handle image upload
  const handleImageUpload = useCallback(async () => {
    if (!image) {
      setError("Please select an image.");
      return;
    }

    if (isBlurry) {
      setError("The image is too blurry. Please select a different image.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", image.file);
    formData.append("upload_preset", "react_preset");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxciq1y9t/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        }
      );

      navigate("/image-details", { state: { uploadedImage: response.data } });
    } catch {
      setError("Failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [image, navigate, isBlurry]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-6 mt-20">
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <svg className="animate-spin text-blue-600" viewBox="0 0 36 36" width="100" height="100">
              <circle className="text-gray-300" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" />
              <circle className="text-blue-600" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" strokeDasharray="100" strokeDashoffset={100 - uploadProgress} />
            </svg>
            <div className="absolute top-0 left-0 ml-2 w-full h-full flex items-center justify-center">
              <p className="text-lg font-bold">{uploadProgress}%</p>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-center">Uploading...</p>
        </div>
      ) : (
        <>
          <div
            className="w-full p-10 bg-slate-100 rounded-xl shadow-lg flex flex-col items-center justify-center border-4 border-dashed border-orange-300 hover:border-orange-500 transition-all"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange(e.dataTransfer.files[0]);
            }}
            onClick={() => document.querySelector("#fileInput").click()}
            style={{ cursor: "pointer", minHeight: "300px", maxHeight: "500px" }}
          >
            <input
              type="file"
              id="fileInput"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
            <h2 className="text-xl font-bold text-center">Drag and Drop Image or Click to Select</h2>
            {error && <p className="text-red-500 mt-4 font-bold text-center text-xl">{error}</p>}
          </div>

          {image?.preview && (
            <div className="w-full mt-8 flex flex-col items-center">
              <h3 className="text-xl font-mono font-extrabold mb-4 mt-10 text-center">Preview Image Before Uploading!</h3>
              <img src={image.preview} alt="Preview" className="max-h-96" />
              <p className={`mt-4 ${isBlurry ? "text-red-500" : "text-green-500"} font-semibold`}>{fileStatus}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
                onClick={handleImageUpload}
                disabled={uploading}
              >
                Upload Image
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUploader;

