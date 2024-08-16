import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { ref, set } from "firebase/database"; // Import ref and set from Firebase SDK
import { db } from '../firebase'; // Correctly import the db instance


export default function FaceVerificationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const handleNameChange = (event) => setName(event.target.value);
  const handlePhoneChange = (event) => setPhone(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleImageChange = (event) => setImage(event.target.files[0]);

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCameraImage(imageSrc);
    setIsCameraEnabled(false);
  }, [webcamRef]);

  const enableCamera = () => {
    setIsCameraEnabled(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("uploaded_image", image);
    formData.append("captured_image", cameraImage);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);

    try {
      const response = await fetch("http://localhost:5000/verify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);

      if (result.status === "1") {
        // Update Firebase Realtime Database
        set(ref(db, `data/${name}`), {
          phone: phone,
          email: email,
        });
        setVerificationMessage(
          "The face is verified and stored in the database."
        );
      } else {
        setVerificationMessage(
          "Please upload another photo. The face was not verified."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setVerificationMessage(
        "An error occurred while verifying the face. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 sm:p-8 lg:p-10 w-full max-w-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={handleNameChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number:
          </label>
          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={phone}
            onChange={handlePhoneChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleEmailChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          And Verify Your face:
        </label>
        <div className="mb-4">
          {isCameraEnabled && (
            <Webcam
              audio={false}
              height={720}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
              className="rounded-lg w-full"
            />
          )}
          <button
            type="button"
            onClick={enableCamera}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Enable Camera
          </button>
          {isCameraEnabled && (
            <button
              type="button"
              onClick={handleCapture}
              className="mt-2 ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Capture Image
            </button>
          )}
          {cameraImage && (
            <div className="mt-4">
              <img
                src={cameraImage}
                alt="Captured"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          )}
        </div>
        <div className="mt-4">
          {verificationMessage && (
            <p className="text-center text-red-500">{verificationMessage}</p>
          )}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
}
