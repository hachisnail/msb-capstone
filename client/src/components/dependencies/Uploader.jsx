import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axiosClient from '../../lib/axiosClient';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'; 

export default function Uploader({
  endpoint,
  onUploadSuccess = () => {},
  onUploadError = () => {},
  isPublic = false,
  acceptedFileTypes = '*',
  maxFileSize = 5 * 1024 * 1024,
  children,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { executeRecaptcha } = useGoogleReCaptcha(); // ✅ Use the hook

  const triggerFileInput = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // (Validation logic remains the same)
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      let uploadToken = null;

      // --- ✅ Public Upload Flow (Simplified) ---
      if (isPublic) {
        if (!executeRecaptcha) {
          throw new Error("reCAPTCHA not ready. Check your site key.");
        }
        // The hook handles loading, so we can call it directly.
        const captchaToken = await executeRecaptcha('SUBMIT_FILE');
        const tokenResponse = await axiosClient.post('/api/issue-upload-token', { captchaToken });
        uploadToken = tokenResponse.data.uploadToken;
      }

      // --- Core Upload Logic (Remains the same) ---
      const formData = new FormData();
      formData.append('file', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(isPublic && { 'x-access-token': uploadToken }),
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      };

      const response = await axiosClient.post(endpoint, formData, config);
      onUploadSuccess(response.data);

    } catch (err) {
      const errorMsg = err.normalized?.data?.message || err.normalized?.data?.error || "An unknown error occurred.";
      setError(errorMsg);
      onUploadError(err.normalized);

    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // (The JSX returned by the component remains the same)
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept={acceptedFileTypes}
      />
      <div onClick={!isUploading ? triggerFileInput : undefined} style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}>
        {children}
      </div>
      {isUploading && <div>Uploading: {progress}%</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
}

// (PropTypes remain the same)
Uploader.propTypes = {
  endpoint: PropTypes.string.isRequired,
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
  isPublic: PropTypes.bool,
  acceptedFileTypes: PropTypes.string,
  maxFileSize: PropTypes.number,
  children: PropTypes.node.isRequired,
};
