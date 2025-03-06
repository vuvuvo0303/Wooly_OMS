import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = () => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    const file = acceptedFiles[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleSubmit = async () => {
    // const result = await uploadImage(files[0]);
    // console.log("Upload result: ", result);
  };

  return (
    <div className="mb-5">
      <div
        {...getRootProps({ className: "dropzone" })}
        className="p-5 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex-col"
      >
        <Upload className="mb-2 size-9" />
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>
      {selectedImage && (
        <div className="image-preview">
          <h3>Image Preview:</h3>
          <img src={selectedImage} alt="Preview" style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }} />
        </div>
      )}
      <Button onClick={handleSubmit} className="btn btn-primary mt-5">
        Upload
      </Button>
    </div>
  );
};

export default Dropzone;
