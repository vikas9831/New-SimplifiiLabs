# Image Uploader App

## Overview

The Image Uploader App is a React application that allows users to upload images, view their details, and manage themes. The app features a simple interface for dragging and dropping or selecting images, previewing them, and displaying detailed information about the uploaded image.

## Features

- Upload images with a file size limit of 1MB.
- Preview images before uploading.
- Automatic file readability check before upload.
- View details of the uploaded image including size, dimensions, and format.
- Copy the image URL to the clipboard.
- Toggle between light and dark themes.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/image-uploader-app.git
cd image-uploader-app
```

### 2. Install Dependencies
```bash
npm install
```
### 3. Set Up Cloudinary Variables

Replace your_cloud_name and your_upload_preset with your actual Cloudinary Cloud Name and Upload Preset in the ImageUploader.jsx file .




#### To obtain these values:

#### Cloud Name: Log in to your Cloudinary account, and you’ll find it in the top right corner of your dashboard.
#### Upload Preset: Create one in the Cloudinary dashboard under the Upload Presets section.

### 4. Run the Development Server
```bash
npm run dev
```
The application will be available at http://localhost:5173.

### 5. Build the Project
To build the project for production, run:
```bash
npm run build
```
The production build will be created in the dist directory.

### 6. Preview the Build
To preview the production build locally, run:
```bash
npm run preview
```

## Usage

### 1.Upload Image:
- Drag and drop an image file onto the designated area or click to select a file.
- The app will display a preview of the image before uploading.
- Click "Upload Image" to upload the image.
  
  ### 2.View Image Details:
- After the image is uploaded, you will be redirected to the Image Details page.
- The page displays information such as the image name, size, dimensions, format, and URL.
  
  ### 3.Copy Image URL:
- Click the "Copy URL" button to copy the image URL to your clipboard (publicly accessible).
  
  ### 4.Toggle Theme:
- Click the sun/moon icon in the navbar to switch between light and dark themes.


 ## File Readability Check
Before allowing the image to be uploaded, the app automatically checks if the selected image is readable. This ensures that the file is in a valid format and can be processed.

### Readability Check Workflow:
- When an image is selected or dropped into the upload area, the app uses a FileReader to check if the image is readable.
- If the image passes the check, a success message (✅ File is readable) is shown, and the upload button becomes active.
- If the image is not readable, an error message (❌ File is not readable) is displayed, preventing the user from proceeding with the upload.

This feature helps in detecting corrupted or unsupported files early, providing a better user experience.



## Cloudinary Configuration

 To integrate Cloudinary, follow these steps:

### 1.Create a Cloudinary Account:
- Sign up at Cloudinary's website.

### 2.Obtain Cloudinary Credentials:
- Cloud Name: Find it in your Cloudinary Dashboard.
- Upload Preset: Create one under the Upload Presets section in your Cloudinary settings.

### 3.Configure Environment Variables:
-Add your Cloudinary Cloud Name and Upload Preset to the .env file as described in the "Set Up Environment Variables" section.

### 4.Update Your Application Code:
- Ensure the ImageUploader component in src/components/ImageUploader.jsx uses these environment variables in the upload URL.

  
## Dependencies
This project uses the following dependencies:

- axios
- cloudinary
- react
- react-dom
- react-dropzone
- react-router-dom
- sass
- tailwindcss
- vite

## Screenshots
![Screenshot 2024-09-15 170158](https://github.com/user-attachments/assets/d1d95479-966f-4f29-9191-7303896a4103)

![Screenshot 2024-09-15 170207](https://github.com/user-attachments/assets/b9ddf003-ab1f-433b-9aae-85b84c5f6d0f)

![Screenshot 2024-09-17 121925](https://github.com/user-attachments/assets/1e8b55b3-c45d-454e-9feb-ab684bb83539)

![Screenshot 2024-09-15 170239](https://github.com/user-attachments/assets/9178cd61-0ed0-44b2-8d87-9a1e87c10ad0)

![Screenshot 2024-09-15 170244](https://github.com/user-attachments/assets/6b56f4f7-670e-4d7f-832d-6b8f43549fde)


## Contributing
If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
Cloudinary for providing a simple image upload service.
Vite for the fast build tool.
