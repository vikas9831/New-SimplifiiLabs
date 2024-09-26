

// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Tesseract from "tesseract.js"; 

// const ImageUploader = () => {
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState("");
//   const [readable, setReadable] = useState(false);
//   const [fileStatus, setFileStatus] = useState("");
//   const [isBlurry, setIsBlurry] = useState(false);
//   const [isTextReadable, setIsTextReadable] = useState(false);
//   const navigate = useNavigate();

//   // Validate file type and size
//   const validateFile = (file) => {
//     const fileSize = file.size / 1024 / 1024; // Convert size to MB
//     const validTypes = ["image/jpeg", "image/png"];
//     if (!validTypes.includes(file.type)) {
//       setError("Only .jpg and .png formats are allowed.");
//       return false;
//     }
//     if (fileSize > 1) {
//       setError("File size exceeds 1MB.");
//       return false;
//     }
//     return true;
//   };

//   const handleFileChange = (file) => {
//     setError(""); 
//     setFileStatus(""); 
//     setIsBlurry(false); 
//     setIsTextReadable(false); 
//     setReadable(false); 

//     if (validateFile(file)) {
//       const previewUrl = URL.createObjectURL(file);
//       setImage({ file, preview: previewUrl });
//       setError("");
//       checkFileReadable(file);
//     }
//   };

//   // Check if the file is readable
//   const checkFileReadable = (file) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setReadable(true);
//       setFileStatus("✅ File is readable By Browser and ready to upload.");
//       setError("");
//       checkForBlur(file); // Check for blurriness
//       checkForTextRecognition(file); // Check for text recognition
//     };
//     reader.onerror = () => {
//       setReadable(false);
//       setFileStatus("❌ File is not readable. Please choose a different file.");
//       setError("File is not readable.");
//     };
//     reader.readAsDataURL(file);
//   };

//   // Check for blurriness using Canvas
//   const checkForBlur = (file) => {
//     const img = new Image();
//     img.src = URL.createObjectURL(file);
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const size = 600; // Scale image for analysis
//       canvas.width = size;
//       canvas.height = size;
//       ctx.drawImage(img, 0, 0, size, size); // Scale down the image

//       // Check the type of image (basic analysis)
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const pixels = imageData.data;
//       let avgR = 0, avgG = 0, avgB = 0;

//       // Histogram-based analysis for contrast
//       const histogram = Array(256).fill(0);
//       for (let i = 0; i < pixels.length; i += 4) {
//         const r = pixels[i];
//         const g = pixels[i + 1];
//         const b = pixels[i + 2];
//         const brightness = Math.round((r + g + b) / 3);
//         histogram[brightness]++;
//         avgR += r;
//         avgG += g;
//         avgB += b;
//       }

//       avgR /= (pixels.length / 4);
//       avgG /= (pixels.length / 4);
//       avgB /= (pixels.length / 4);

//       const contrastThreshold = 10; // Define a threshold for low-contrast/blurry images
//       const brightPixels = histogram.slice(200).reduce((a, b) => a + b, 0); // Check for bright pixels

//       if (brightPixels < contrastThreshold) {
//         // If the image has low contrast and brightness
//         setIsBlurry(true);
//         setFileStatus((prev) => prev + " ❌ This image appears blurry or low-quality. Try a different one.");
//         setError("The image is too blurry.");
//       } else {
//         // Artistic image with good contrast and brightness
//         setIsBlurry(false);
//         setFileStatus((prev) => prev + " ✅ The image is sharp and suitable for upload.");
//       }
//     };
//   };

//   // Check for text readability using Tesseract.js
//   const checkForTextRecognition = (file) => {
//     Tesseract.recognize(
//       file,
//       "eng",
//       {
//         logger: (m) => console.log(m), // Log progress
//       }
//     ).then(({ data: { text } }) => {
//       if (text.trim().length > 0) {
//         setIsTextReadable(true);
//         setFileStatus((prev) => prev + " ✅ The text is readable.");
//       } else {
//         setIsTextReadable(false);
//         setFileStatus((prev) => prev + " ❌ The text is not readable.");
//         setError("The text in the image is not readable.");
//       }
//     }).catch(() => {
//       setIsTextReadable(false);
//       setError("Error while checking text readability.");
//     });
//   };

//   // Handle image upload
//   const handleImageUpload = useCallback(async () => {
//     if (!image) {
//       setError("Please select an image.");
//       return;
//     }
//     if (!readable || isBlurry || !isTextReadable) {
//       setError("File is not ready for upload. Please select a valid, sharp, and readable image.");
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     const formData = new FormData();
//     formData.append("file", image.file);
//     formData.append("upload_preset", "react_preset");

//     try {
//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dxciq1y9t/image/upload",
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(progress);
//           },
//         }
//       );

//       navigate("/image-details", { state: { uploadedImage: response.data } });
//     } catch {
//       setError("Failed to upload. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   }, [image, navigate, readable, isBlurry, isTextReadable]);

//   useEffect(() => {
//     return () => {
//       if (image?.preview) URL.revokeObjectURL(image.preview);
//     };
//   }, [image]);

//   const handleDrag = (event) => {
//     event.preventDefault();
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     if (event.dataTransfer.files[0]) handleFileChange(event.dataTransfer.files[0]);
//   };

//   const resetImage = () => {
//     setImage(null);
//     setError("");
//     setFileStatus("");
//     setIsBlurry(false);
//     setIsTextReadable(false);
//     setReadable(false);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center w-full p-6 mt-20">
//       {uploading ? (
//         <div className="flex flex-col items-center">
//           <div className="relative w-20 h-20">
//             <svg className="animate-spin text-blue-600" viewBox="0 0 36 36" width="100" height="100">
//               <circle className="text-gray-300" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" />
//               <circle className="text-blue-600" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" strokeDasharray="100" strokeDashoffset={100 - uploadProgress} />
//             </svg>
//             <div className="absolute top-0 left-0 ml-2 w-full h-full flex items-center justify-center">
//               <p className="text-lg font-bold">{uploadProgress}%</p>
//             </div>
//           </div>
//           <p className="text-gray-600 mt-4 text-center">Uploading...</p>
//         </div>
//       ) : (
//         <>
//           <div
//             className="w-full p-10 bg-slate-100 rounded-xl shadow-lg flex flex-col items-center justify-center border-4 border-dashed border-orange-300 hover:border-orange-500 transition-all"
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//             onClick={() => document.querySelector("#fileInput").click()}
//             style={{ cursor: "pointer", minHeight: "300px", maxHeight: "500px" }} 
//           >
//             <input
//               type="file"
//               id="fileInput"
//               accept="image/png, image/jpeg"
//               className="hidden"
//               onChange={(e) => handleFileChange(e.target.files[0])}
//             />
//             <h2 className="text-xl font-bold text-center">Drag and Drop Image or Click to Select</h2>
//             {error && <p className="text-red-500 mt-4 font-bold text-center text-xl">{error}</p>}
//           </div>

//           {image?.preview && (
//             <div className="w-full mt-8 flex flex-col items-center">
//               <h3 className="text-xl font-mono font-extrabold mb-4 mt-10 text-center">Preview Image Before Uploading!</h3>
//               <img src={image.preview} alt="Preview" className="w-full max-w-lg h-auto object-cover border-4 border-gray-300 rounded-lg" style={{ maxHeight: "500px" }} />
//               <button
//                 className="mt-4 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
//                 onClick={resetImage}
//               >
//                 Reset Image
//               </button>
//             </div>
//           )}

//           {fileStatus && (
//             <p className={`text-lg mt-4 font-semibold text-center ${readable ? "text-green-600" : "text-red-600"}`}>
//               {fileStatus}
//             </p>
//           )}

//           {readable && !isBlurry && isTextReadable && (
//             <button
//               onClick={handleImageUpload}
//               disabled={!image}
//               className="mt-4 px-6 py-2 font-semibold text-white bg-blue-700 rounded-lg hover:bg-purple-600 transition-colors"
//             >
//               Upload Image
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;








// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Tesseract from "tesseract.js"; 
// import { useNavigate } from "react-router-dom";

// const ImageUploader = () => {
//   const [image, setImage] = useState(null);
//   const [isBlurry, setIsBlurry] = useState(false);
//   const [error, setError] = useState("");
//   const [fileStatus, setFileStatus] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const navigate = useNavigate();

//   const validateFile = (file) => {
//     const fileSize = file.size / 1024 / 1024; // Size in MB
//     const validTypes = ["image/jpeg", "image/png"];
//     if (!validTypes.includes(file.type)) {
//       setError("Only .jpg and .png formats are allowed.");
//       return false;
//     }
//     if (fileSize > 1) {
//       setError("File size exceeds 1MB.");
//       return false;
//     }
//     return true;
//   };

//   const handleFileChange = (file) => {
//     setError("");
//     setIsBlurry(false);
//     setFileStatus("");

//     if (validateFile(file)) {
//       const previewUrl = URL.createObjectURL(file);
//       setImage({ file, preview: previewUrl });
//       checkForBlur(file); // Call the OpenCV blur check function
//     }
//   };

//   // Function to check for blurriness using OpenCV.js
//   const checkForBlur = (file) => {
//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0, img.width, img.height);

//       const src = cv.imread(canvas); // Read image from canvas using OpenCV.js
//       const gray = new cv.Mat();
//       cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0); // Convert to grayscale
//       const laplacian = new cv.Mat();
//       cv.Laplacian(gray, laplacian, cv.CV_64F); // Apply Laplacian filter

//       const mean = new cv.Mat();
//       const stddev = new cv.Mat();
//       cv.meanStdDev(laplacian, mean, stddev); // Compute the standard deviation

//       const varianceOfLaplacian = Math.pow(stddev.data64F[0], 2); // Variance
//       const blurThreshold = 100.0; // You can adjust this threshold

//       if (varianceOfLaplacian < blurThreshold) {
//         setIsBlurry(true);
//         setFileStatus("❌ This image appears blurry. Try a different one.");
//       } else {
//         setIsBlurry(false);
//         setFileStatus("✅ The image is sharp and suitable for upload.");
//       }

//       // Clean up
//       src.delete();
//       gray.delete();
//       laplacian.delete();
//       mean.delete();
//       stddev.delete();
//     };
//   };



//   // const checkForBlur = (file) => {
//   //   const img = new Image();
//   //   img.src = URL.createObjectURL(file);
  
//   //   img.onload = () => {
//   //     const canvas = document.createElement("canvas");
//   //     const ctx = canvas.getContext("2d");
//   //     canvas.width = img.width;
//   //     canvas.height = img.height;
//   //     ctx.drawImage(img, 0, 0, img.width, img.height);
  
//   //     const src = cv.imread(canvas); // Read image from canvas using OpenCV.js
//   //     const gray = new cv.Mat();
//   //     cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0); // Convert to grayscale
  
//   //     // Resize the image to a smaller size for more reliable blur detection
//   //     const resized = new cv.Mat();
//   //     const newSize = new cv.Size(300, 300); // Resize to 300x300
//   //     cv.resize(gray, resized, newSize);
  
//   //     // Apply a small Gaussian blur to normalize the image (optional)
//   //     const blurred = new cv.Mat();
//   //     cv.GaussianBlur(resized, blurred, new cv.Size(5, 5), 0);
  
//   //     const laplacian = new cv.Mat();
//   //     cv.Laplacian(blurred, laplacian, cv.CV_64F); // Apply Laplacian filter
  
//   //     const mean = new cv.Mat();
//   //     const stddev = new cv.Mat();
//   //     cv.meanStdDev(laplacian, mean, stddev); // Compute the standard deviation
  
//   //     const varianceOfLaplacian = Math.pow(stddev.data64F[0], 2); // Variance
//   //     const blurThreshold = 60.0; // Adjusted threshold for smaller blur detection
  
//   //     if (varianceOfLaplacian < blurThreshold) {
//   //       setIsBlurry(true);
//   //       setFileStatus("❌ This image appears blurry. Try a different one.");
//   //     } else {
//   //       setIsBlurry(false);
//   //       setFileStatus("✅ The image is sharp and suitable for upload.");
//   //     }
  
//   //     // Clean up
//   //     src.delete();
//   //     gray.delete();
//   //     laplacian.delete();
//   //     mean.delete();
//   //     stddev.delete();
//   //     resized.delete();
//   //     blurred.delete();
//   //   };
//   // };
  

//   const handleImageUpload = useCallback(async () => {
//     if (!image) {
//       setError("Please select an image.");
//       return;
//     }

//     if (isBlurry) {
//       setError("The image is too blurry. Please select a different image.");
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     const formData = new FormData();
//     formData.append("file", image.file);
//     formData.append("upload_preset", "react_preset");

//     try {
//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dxciq1y9t/image/upload",
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(progress);
//           },
//         }
//       );

//       navigate("/image-details", { state: { uploadedImage: response.data } });
//     } catch {
//       setError("Failed to upload. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   }, [image, navigate, isBlurry]);

//   return (
//     <div className="flex flex-col items-center justify-center w-full p-6 mt-20">
//       {uploading ? (
//         <div className="flex flex-col items-center">
//           <div className="relative w-20 h-20">
//             <svg className="animate-spin text-blue-600" viewBox="0 0 36 36" width="100" height="100">
//               <circle className="text-gray-300" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" />
//               <circle className="text-blue-600" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" strokeDasharray="100" strokeDashoffset={100 - uploadProgress} />
//             </svg>
//             <div className="absolute top-0 left-0 ml-2 w-full h-full flex items-center justify-center">
//               <p className="text-lg font-bold">{uploadProgress}%</p>
//             </div>
//           </div>
//           <p className="text-gray-600 mt-4 text-center">Uploading...</p>
//         </div>
//       ) : (
//         <>
//           <div
//             className="w-full p-10 bg-slate-100 rounded-xl shadow-lg flex flex-col items-center justify-center border-4 border-dashed border-orange-300 hover:border-orange-500 transition-all"
//             onDragOver={(e) => e.preventDefault()}
//             onDrop={(e) => {
//               e.preventDefault();
//               handleFileChange(e.dataTransfer.files[0]);
//             }}
//             onClick={() => document.querySelector("#fileInput").click()}
//             style={{ cursor: "pointer", minHeight: "300px", maxHeight: "500px" }}
//           >
//             <input
//               type="file"
//               id="fileInput"
//               accept="image/png, image/jpeg"
//               className="hidden"
//               onChange={(e) => handleFileChange(e.target.files[0])}
//             />
//             <h2 className="text-xl font-bold text-center">Drag and Drop Image or Click to Select</h2>
//             {error && <p className="text-red-500 mt-4 font-bold text-center text-xl">{error}</p>}
//           </div>

//           {image?.preview && (
//             <div className="w-full mt-8 flex flex-col items-center">
//               <h3 className="text-xl font-mono font-extrabold mb-4 mt-10 text-center">Preview Image Before Uploading!</h3>
//               <img src={image.preview} alt="Preview" className="w-full max-w-lg h-auto object-cover border-4 border-gray-300 rounded-lg" style={{ maxHeight: "500px" }} />
//               <button
//                 className="mt-4 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
//                 onClick={() => setImage(null)}
//               >
//                 Reset Image
//               </button>
//             </div>
//           )}

//           {fileStatus && (
//             <p className={`text-lg mt-4 font-semibold text-center ${isBlurry ? "text-red-600" : "text-green-600"}`}>
//               {fileStatus}
//             </p>
//           )}

//           {!isBlurry && image && (
//             <button
//               onClick={handleImageUpload}
//               className="mt-4 px-6 py-2 font-semibold text-white bg-blue-700 rounded-lg hover:bg-purple-600 transition-colors"
//             >
//               Upload Image
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;


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

//-------------------------------------------------------


// import React, { useState, useCallback } from "react";
// import axios from "axios";
// import Tesseract from "tesseract.js";
// import { useNavigate } from "react-router-dom";

// const ImageUploader = () => {
//   const [image, setImage] = useState(null);
//   const [isBlurry, setIsBlurry] = useState(false);
//   const [isTextImage, setIsTextImage] = useState(false);
//   const [error, setError] = useState("");
//   const [fileStatus, setFileStatus] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const navigate = useNavigate();

//   const validateFile = (file) => {
//     const fileSize = file.size / 1024 / 1024; // Size in MB
//     const validTypes = ["image/jpeg", "image/png"];
//     if (!validTypes.includes(file.type)) {
//       setError("Only .jpg and .png formats are allowed.");
//       return false;
//     }
//     if (fileSize > 1) {
//       setError("File size exceeds 1MB.");
//       return false;
//     }
//     return true;
//   };

//   const handleFileChange = (file) => {
//     setError("");
//     setIsBlurry(false);
//     setFileStatus("");

//     if (validateFile(file)) {
//       const previewUrl = URL.createObjectURL(file);
//       setImage({ file, preview: previewUrl });
//       checkForBlur(file); // Call the OpenCV blur check function
//       checkForText(file); // Call the OCR function to check for text readability
//     }
//   };

//   // Function to check for blurriness and structured patterns using OpenCV.js
//   const checkForBlur = (file) => {
//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0, img.width, img.height);

//       const src = cv.imread(canvas); // Read image from canvas using OpenCV.js
//       const gray = new cv.Mat();
//       cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0); // Convert to grayscale

//       // 1. Blurriness check using Laplacian variance
//       const laplacian = new cv.Mat();
//       cv.Laplacian(gray, laplacian, cv.CV_64F); // Apply Laplacian filter
//       const mean = new cv.Mat();
//       const stddev = new cv.Mat();
//       cv.meanStdDev(laplacian, mean, stddev); // Compute the standard deviation
//       const varianceOfLaplacian = Math.pow(stddev.data64F[0], 2); // Variance
//       const blurThreshold = 100.0; // Threshold for sharpness

//       // 2. Check for high contrast (QR-like) images using histogram
//       const histogram = new cv.Mat();
//       const mask = new cv.Mat();
//       const histSize = [256];
//       const ranges = [0, 256];
//       const channels = [0];
//       cv.calcHist(gray, channels, mask, histogram, histSize, ranges);

//       let totalPixels = 0;
//       for (let i = 0; i < histogram.rows; i++) {
//         totalPixels += histogram.data32F[i];
//       }

//       // Check for QR-like structure: high contrast binary patterns
//       const blackPixels = histogram.data32F[0];
//       const whitePixels = histogram.data32F[255];
//       const blackWhiteRatio = (blackPixels + whitePixels) / totalPixels;
//       const highContrastThreshold = 0.7; // Threshold for black/white ratio

//       // 3. Edge detection using Canny
//       const edges = new cv.Mat();
//       cv.Canny(gray, edges, 100, 200); // Canny edge detection
//       const edgeCount = cv.countNonZero(edges);

//       // Custom logic: If too many edges or high contrast, flag as QR-like
//       const edgeThreshold = 1000; // Number of edges to flag as "QR-like"

//       if (varianceOfLaplacian < blurThreshold) {
//         setIsBlurry(true);
//         setFileStatus("❌ This image appears blurry. Try a different one.");
//       } else if (blackWhiteRatio > highContrastThreshold || edgeCount > edgeThreshold) {
//         setIsBlurry(true);
//         setFileStatus("❌ This image has a high-contrast QR-like structure. Please upload a normal image.");
//       } else {
//         setIsBlurry(false);
//         setFileStatus("✅ The image is sharp and suitable for upload.");
//       }

//       // Clean up
//       src.delete();
//       gray.delete();
//       laplacian.delete();
//       mean.delete();
//       stddev.delete();
//       histogram.delete();
//       mask.delete();
//       edges.delete();
//     };
//   };

//   // Function to check if image contains text using Tesseract.js
//   const checkForText = (file) => {
//     Tesseract.recognize(
//       file,
//       'eng',
//       {
//         logger: (m) => console.log(m), // Optionally log OCR progress
//       }
//     ).then(({ data: { text } }) => {
//       // If text is detected in the image
//       if (text.trim()) {
//         setIsTextImage(true);
//         console.log("Detected text in image:", text);

//         // We could apply additional checks for text readability here
//         if (text.length > 5) { // Assuming that a valid text image should have more than 5 characters
//           setFileStatus("✅ The image contains readable text.");
//         } else {
//           setFileStatus("❌ The image contains text, but it might not be clear.");
//           setIsBlurry(true); // Mark image as blurry if text isn't clear enough
//         }
//       } else {
//         setIsTextImage(false); // No text detected
//         setFileStatus("✅ This appears to be a normal image.");
//       }
//     });
//   };

//   const handleImageUpload = useCallback(async () => {
//     if (!image) {
//       setError("Please select an image.");
//       return;
//     }

//     if (isBlurry) {
//       setError("The image is too blurry or has QR-like structure. Please select a different image.");
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     const formData = new FormData();
//     formData.append("file", image.file);
//     formData.append("upload_preset", "react_preset");

//     try {
//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dxciq1y9t/image/upload",
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(progress);
//           },
//         }
//       );

//       navigate("/image-details", { state: { uploadedImage: response.data } });
//     } catch {
//       setError("Failed to upload. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   }, [image, navigate, isBlurry]);

//   return (
//     <div className="flex flex-col items-center justify-center w-full p-6 mt-20">
//       {uploading ? (
//         <div className="flex flex-col items-center">
//           <div className="relative w-20 h-20">
//             <svg className="animate-spin text-blue-600" viewBox="0 0 36 36" width="100" height="100">
//               <circle className="text-gray-300" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" />
//               <circle className="text-blue-600" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" strokeDasharray="100" strokeDashoffset={100 - uploadProgress} />
//             </svg>
//             <div className="absolute top-0 left-0 ml-2 w-full h-full flex items-center justify-center">
//               <p className="text-lg font-bold">{uploadProgress}%</p>
//             </div>
//           </div>
//           <p className="text-gray-600 mt-4 text-center">Uploading...</p>
//         </div>
//       ) : (
//         <>
//           <div
//             className="w-full p-10 bg-slate-100 rounded-xl shadow-lg flex flex-col items-center justify-center border-4 border-dashed border-orange-300 hover:border-orange-500 transition-all"
//             onDragOver={(e) => e.preventDefault()}
//             onDrop={(e) => {
//               e.preventDefault();
//               handleFileChange(e.dataTransfer.files[0]);
//             }}
//             onClick={() => document.querySelector("#fileInput").click()}
//             style={{ cursor: "pointer", minHeight: "300px", maxHeight: "500px" }}
//           >
//             <input
//               type="file"
//               id="fileInput"
//               accept="image/png, image/jpeg"
//               className="hidden"
//               onChange={(e) => handleFileChange(e.target.files[0])}
//             />
//             <span className="text-xl text-gray-400">
//               {image ? (
//                 <img src={image.preview} alt="Preview" className="object-contain w-full max-h-96" />
//               ) : (
//                 "Drag and drop or click to upload an image"
//               )}
//             </span>
//           </div>

//           {error && <p className="text-red-500 mt-2">{error}</p>}
//           {fileStatus && <p className="text-blue-500 mt-2">{fileStatus}</p>}

//           <button
//             className={`mt-4 px-6 py-3 text-white font-bold rounded-md ${uploading || isBlurry ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"}`}
//             disabled={uploading || isBlurry}
//             onClick={handleImageUpload}
//           >
//             Upload Image
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;



//--------------------------------------


// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Tesseract from "tesseract.js"; 
// import { useNavigate } from "react-router-dom";

// const ImageUploader = () => {
//   const [image, setImage] = useState(null);
//   const [isBlurry, setIsBlurry] = useState(false);
//   const [isTextImage, setIsTextImage] = useState(false);
//   const [error, setError] = useState("");
//   const [fileStatus, setFileStatus] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const navigate = useNavigate();

//   const validateFile = (file) => {
//     const fileSize = file.size / 1024 / 1024; // Size in MB
//     const validTypes = ["image/jpeg", "image/png"];
//     if (!validTypes.includes(file.type)) {
//       setError("Only .jpg and .png formats are allowed.");
//       return false;
//     }
//     if (fileSize > 1) {
//       setError("File size exceeds 1MB.");
//       return false;
//     }
//     return true;
//   };

//   const handleFileChange = (file) => {
//     setError("");
//     setIsBlurry(false);
//     setFileStatus("");

//     if (validateFile(file)) {
//       const previewUrl = URL.createObjectURL(file);
//       setImage({ file, preview: previewUrl });
//       checkForBlur(file); // Call the OpenCV blur check function
//       checkForText(file); // Call the OCR function to check for text readability
//     }
//   };

//   // Function to check for blurriness using OpenCV.js
//   const checkForBlur = (file) => {
//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0, img.width, img.height);

//       const src = cv.imread(canvas); // Read image from canvas using OpenCV.js
//       const gray = new cv.Mat();
//       cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0); // Convert to grayscale
//       const laplacian = new cv.Mat();
//       cv.Laplacian(gray, laplacian, cv.CV_64F); // Apply Laplacian filter

//       const mean = new cv.Mat();
//       const stddev = new cv.Mat();
//       cv.meanStdDev(laplacian, mean, stddev); // Compute the standard deviation

//       const varianceOfLaplacian = Math.pow(stddev.data64F[0], 2); // Variance
//       const blurThreshold = 100.0; // You can adjust this threshold

//       if (varianceOfLaplacian < blurThreshold) {
//         setIsBlurry(true);
//         setFileStatus("❌ This image appears blurry. Try a different one.");
//       } else {
//         setIsBlurry(false);
//         setFileStatus("✅ The image is sharp and suitable for upload.");
//       }

//       // Clean up
//       src.delete();
//       gray.delete();
//       laplacian.delete();
//       mean.delete();
//       stddev.delete();
//     };
//   };

//   // Function to check if image contains text using Tesseract.js
//   const checkForText = (file) => {
//     Tesseract.recognize(
//       file,
//       'eng',
//       {
//         logger: (m) => console.log(m), // Optionally log OCR progress
//       }
//     ).then(({ data: { text } }) => {
//       // If text is detected in the image
//       if (text.trim()) {
//         setIsTextImage(true);
//         console.log("Detected text in image:", text);

//         // We could apply additional checks for text readability here
//         if (text.length > 5) { // Assuming that a valid text image should have more than 5 characters
//           setFileStatus("✅ The image contains readable text.");
//         } else {
//           setFileStatus("❌ The image contains text, but it might not be clear.");
//           setIsBlurry(true); // Mark image as blurry if text isn't clear enough
//         }
//       } else {
//         setIsTextImage(false); // No text detected
//         setFileStatus("✅ This appears to be a normal image.");
//       }
//     });
//   };

//   const handleImageUpload = useCallback(async () => {
//     if (!image) {
//       setError("Please select an image.");
//       return;
//     }

//     if (isBlurry) {
//       setError("The image is too blurry. Please select a different image.");
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     const formData = new FormData();
//     formData.append("file", image.file);
//     formData.append("upload_preset", "react_preset");

//     try {
//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dxciq1y9t/image/upload",
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(progress);
//           },
//         }
//       );

//       navigate("/image-details", { state: { uploadedImage: response.data } });
//     } catch {
//       setError("Failed to upload. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   }, [image, navigate, isBlurry]);

//   return (
//     <div className="flex flex-col items-center justify-center w-full p-6 mt-20">
//       {uploading ? (
//         <div className="flex flex-col items-center">
//           <div className="relative w-20 h-20">
//             <svg className="animate-spin text-blue-600" viewBox="0 0 36 36" width="100" height="100">
//               <circle className="text-gray-300" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" />
//               <circle className="text-blue-600" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" strokeDasharray="100" strokeDashoffset={100 - uploadProgress} />
//             </svg>
//             <div className="absolute top-0 left-0 ml-2 w-full h-full flex items-center justify-center">
//               <p className="text-lg font-bold">{uploadProgress}%</p>
//             </div>
//           </div>
//           <p className="text-gray-600 mt-4 text-center">Uploading...</p>
//         </div>
//       ) : (
//         <>
//           <div
//             className="w-full p-10 bg-slate-100 rounded-xl shadow-lg flex flex-col items-center justify-center border-4 border-dashed border-orange-300 hover:border-orange-500 transition-all"
//             onDragOver={(e) => e.preventDefault()}
//             onDrop={(e) => {
//               e.preventDefault();
//               handleFileChange(e.dataTransfer.files[0]);
//             }}
//             onClick={() => document.querySelector("#fileInput").click()}
//             style={{ cursor: "pointer", minHeight: "300px", maxHeight: "500px" }}
//           >
//             <input
//               type="file"
//               id="fileInput"
//               accept="image/png, image/jpeg"
//               className="hidden"
//               onChange={(e) => handleFileChange(e.target.files[0])}
//             />
//             <h2 className="text-xl font-bold text-center">Drag and Drop Image or Click to Select</h2>
//             {error && <p className="text-red-500 mt-4 font-bold text-center text-xl">{error}</p>}
//           </div>

//           {image?.preview && (
//             <div className="w-full mt-8 flex flex-col items-center">
//               <h3 className="text-xl font-mono font-extrabold mb-4 mt-10 text-center">Preview Image Before Uploading!</h3>
//               <img src={image.preview} alt="Preview" className="max-h-96" />
//               <p className={`mt-4 ${isBlurry ? "text-red-500" : "text-green-500"} font-semibold`}>{fileStatus}</p>
//               <button
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
//                 onClick={handleImageUpload}
//                 disabled={uploading}
//               >
//                 Upload Image
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;




// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Tesseract from "tesseract.js";

// const ImageUploader = () => {
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState("");
//   const [readable, setReadable] = useState(false);
//   const [fileStatus, setFileStatus] = useState("");
//   const [isBlurry, setIsBlurry] = useState(false);
//   const [isTextReadable, setIsTextReadable] = useState(false);
//   const navigate = useNavigate();

//   // Validate file type and size
//   const validateFile = (file) => {
//     const fileSize = file.size / 1024 / 1024; // Convert size to MB
//     const validTypes = ["image/jpeg", "image/png"];
//     if (!validTypes.includes(file.type)) {
//       setError("Only .jpg and .png formats are allowed.");
//       return false;
//     }
//     if (fileSize > 1) {
//       setError("File size exceeds 1MB.");
//       return false;
//     }
//     return true;
//   };

//   const handleFileChange = (file) => {
//     setError("");
//     setFileStatus("");
//     setIsBlurry(false);
//     setIsTextReadable(false);
//     setReadable(false);

//     if (validateFile(file)) {
//       const previewUrl = URL.createObjectURL(file);
//       setImage({ file, preview: previewUrl });
//       setError("");
//       checkFileReadable(file);
//     }
//   };

//   // Check if the file is readable
//   const checkFileReadable = (file) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setReadable(true);
//       setFileStatus("✅ File is readable By Browser and ready to upload.");
//       setError("");
//       checkForBlur(file); // Check for blurriness
//       checkForTextRecognition(file); // Check for text recognition
//     };
//     reader.onerror = () => {
//       setReadable(false);
//       setFileStatus("❌ File is not readable. Please choose a different file.");
//       setError("File is not readable.");
//     };
//     reader.readAsDataURL(file);
//   };

//   // Check for blurriness using Canvas or OpenCV.js
//   const checkForBlur = (file) => {
//     // Implementation for blur detection (using OpenCV or basic Canvas)
//     // You can use your existing blur detection logic here
//   };

//   // Check for text readability using Tesseract.js
//   const checkForTextRecognition = (file) => {
//     Tesseract.recognize(
//       file,
//       "eng",
//       {
//         logger: (m) => console.log(m), // Log progress
//       }
//     ).then(({ data: { text } }) => {
//       if (text.trim().length > 0) {
//         setIsTextReadable(true);
//         setFileStatus((prev) => prev + " ✅ The text is readable.");
//       } else {
//         setIsTextReadable(false);
//         setFileStatus((prev) => prev + " ❌ The text is not readable.");
//         setError("The text in the image is not readable.");
//       }
//     }).catch(() => {
//       setIsTextReadable(false);
//       setError("Error while checking text readability.");
//     });
//   };

//   // Handle image upload
//   const handleImageUpload = useCallback(async () => {
//     if (!image) {
//       setError("Please select an image.");
//       return;
//     }
//     if (!readable || isBlurry || !isTextReadable) {
//       setError("File is not ready for upload. Please select a valid, sharp, and readable image.");
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     const formData = new FormData();
//     formData.append("file", image.file);
//     formData.append("upload_preset", "react_preset");

//     try {
//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dxciq1y9t/image/upload",
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(progress);
//           },
//         }
//       );

//       navigate("/image-details", { state: { uploadedImage: response.data } });
//     } catch {
//       setError("Failed to upload. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   }, [image, navigate, readable, isBlurry, isTextReadable]);

//   useEffect(() => {
//     return () => {
//       if (image?.preview) URL.revokeObjectURL(image.preview);
//     };
//   }, [image]);

//   const handleDrag = (event) => {
//     event.preventDefault();
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     if (event.dataTransfer.files[0]) handleFileChange(event.dataTransfer.files[0]);
//   };

//   const resetImage = () => {
//     setImage(null);
//     setError("");
//     setFileStatus("");
//     setIsBlurry(false);
//     setIsTextReadable(false);
//     setReadable(false);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center w-full p-6 mt-20">
//       {uploading ? (
//         <div className="flex flex-col items-center">
//           <div className="relative w-20 h-20">
//             <svg className="animate-spin text-blue-600" viewBox="0 0 36 36" width="100" height="100">
//               <circle className="text-gray-300" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" />
//               <circle className="text-blue-600" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="16" strokeDasharray="100" strokeDashoffset={100 - uploadProgress} />
//             </svg>
//             <div className="absolute top-0 left-0 ml-2 w-full h-full flex items-center justify-center">
//               <p className="text-lg font-bold">{uploadProgress}%</p>
//             </div>
//           </div>
//           <p className="text-gray-600 mt-4 text-center">Uploading...</p>
//         </div>
//       ) : (
//         <>
//           <div
//             className="w-full p-10 bg-slate-100 rounded-xl shadow-lg flex flex-col items-center justify-center border-4 border-dashed border-orange-300 hover:border-orange-500 transition-all"
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//             onClick={() => document.querySelector("#fileInput").click()}
//             style={{ cursor: "pointer", minHeight: "300px", maxHeight: "500px" }} 
//           >
//             <input
//               type="file"
//               id="fileInput"
//               accept="image/png, image/jpeg"
//               className="hidden"
//               onChange={(e) => handleFileChange(e.target.files[0])}
//             />
//             <h2 className="text-xl font-bold text-center">Drag and Drop Image or Click to Select</h2>
//             {error && <p className="text-red-500 mt-4 font-bold text-center text-xl">{error}</p>}
//           </div>

//           {image?.preview && (
//             <div className="w-full mt-8 flex flex-col items-center">
//               <h3 className="text-xl font-mono font-extrabold mb-4 mt-10 text-center">Preview Image Before Uploading!</h3>
//               <img src={image.preview} alt="Preview" className="w-full max-w-lg h-auto object-cover border-4 border-gray-300 rounded-lg" style={{ maxHeight: "500px" }} />
//               <button
//                 className="mt-4 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
//                 onClick={resetImage}
//               >
//                 Reset Image
//               </button>
//             </div>
//           )}

//           {fileStatus && (
//             <p className={`text-lg mt-4 font-semibold text-center ${readable ? "text-green-600" : "text-red-600"}`}>
//               {fileStatus}
//             </p>
//           )}

//           {readable && !isBlurry && isTextReadable && (
//             <button
//               onClick={handleImageUpload}
//               disabled={!image}
//               className="mt-4 px-6 py-2 font-semibold text-white bg-blue-700 rounded-lg hover:bg-purple-600 transition-colors"
//             >
//               Upload Image
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;
