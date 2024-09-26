import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ImageDetails = () => {
  const { state } = useLocation();
  const { uploadedImage } = state;
  const navigate = useNavigate();


  const handleCopyURL = () => {
    navigator.clipboard.writeText(uploadedImage.secure_url);
    alert("URL copied to clipboard");
  };

  const handleGoBack = () => {
    navigate("/");
  };


 return (
    <div className="mx-auto mt-10 p-6  lg:p-10 bg-gradient-to-r from-gray-100 via-white to-gray-300 rounded-lg shadow-lg">
      
      <button
        onClick={handleGoBack}
        className="mb-4 sm:mb-6 px-3 py-2 bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 hover:bg-gray-700 hover:shadow-lg text-xs sm:text-sm md:text-sm max-w-xs w-auto mx-auto"
      >
        Go Back
      </button>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-teal-500 mb-10 sm:mb-8 text-center tracking-wide">
        UPLOADED IMAGE DETAILS
      </h2>

      <div className="flex flex-col lg:flex-row lg:justify-evenly gap-4 lg:gap-12">
        <div className="flex-1 lg:w-1/2 flex justify-center">
          <img
            src={uploadedImage.secure_url}
            alt="Uploaded"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg border-4 border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
          />
        </div>


        <div className="flex-1 lg:w-1/2  flex flex-col justify-center space-y-4 sm:space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            <strong className="text-teal-500">Name:</strong>{" "}
            {uploadedImage.original_filename}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            <strong className="text-teal-500">Size:</strong>{" "}
            {(uploadedImage.bytes / 1024).toFixed(2)} KB
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            <strong className="text-teal-500">Dimensions:</strong>{" "}
            {uploadedImage.width} x {uploadedImage.height}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            <strong className="text-teal-500">Format:</strong>{" "}
            {uploadedImage.format}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            <strong className="text-teal-500">URL:</strong>
          </p>


          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <input
              type="text"
              value={uploadedImage.secure_url}
              readOnly
              className="w-full sm:w-auto p-2 sm:max-w-xs sm:p-3 lg:p-4 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-teal-400"
            />
            <button
              onClick={handleCopyURL}
              className="sm:self-start sm:mt-0 px-3 py-2 bg-teal-500 text-white font-bold rounded-lg transition-all duration-300 hover:bg-teal-600 hover:shadow-lg text-xs sm:text-sm md:text-sm w-full sm:w-auto h-[90%]"
            >
              Copy URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetails;





