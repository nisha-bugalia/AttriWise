import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi"; // Fi = Feather Icons
import axios from "axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function UploadZone({ setPredictions }) {
  const [file, setFile] = useState(null);

  
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/predict`, formData);
      setPredictions(res.data); // set predictions in parent state
    } catch (err) {
      console.error("Upload failed", err);
      alert("Something went wrong. Check console.");
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      setFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <motion.div
      {...getRootProps()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full max-w-[350px] p-10 rounded-2xl border-2 border-dashed 
        ${isDragActive ? "border-purple-400 bg-black/30" : "border-gray-600 bg-black/10"}
        text-center cursor-pointer hover:shadow-xl hover:shadow-purple-500/10
        transition-all duration-300 ease-in-out`}
    >
      <input      
      {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-purple-200">
        <FiUploadCloud className="w-10 h-10 text-purple-400 animate-bounce" />
        <p className="text-lg">
          {isDragActive ? "Drop the file here..." : "Drag & drop your CSV file or click to browse"}
        </p>
        {file && <p className="text-sm text-green-300 mt-2"> Uploaded: {file.name}</p>}
        <button
  className="mt-2 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
  onClick={(e) => {
    e.stopPropagation();  // ✅ prevent click from reaching dropzone
    handleUpload();
  }}
>
  Predict
</button>

      </div>
    </motion.div>
  );
}
