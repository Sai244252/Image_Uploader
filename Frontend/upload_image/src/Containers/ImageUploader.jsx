import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MessageStatus from "../Components/MessageStatus";

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [messageStatus, setMessageStatus] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedSrc, setUploadedSrc] = useState("");

  const inputRef = useRef();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    const url = "http://localhost:8081/api/v1/s3";
    axios
      .get(url)
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if ((file && file.type === "image/png") || file.type === "image/jpeg") {
      setSelectedFile(event.target.files[0]);
    } else {
      alert("invalid file type");
      setSelectedFile(null);
    }
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    if (selectedFile) {
      uploadImageToServer();
    } else {
      alert("Invalid file type or select an image first");
      return;
    }
  };

  const uploadImageToServer = () => {
    const url = `http://localhost:8081/api/v1/s3`;
    const data = new FormData();
    data.append("file", selectedFile);
    setIsUploading(true);
    axios
      .post(url, data)
      .then((res) => {
        console.log(res?.data);
        setUploadedSrc(res.data);
        setMessageStatus(true);
        fetchImages();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        console.log("request finished!!");
        setIsUploading(false);
      });
  };

  const resetHandler = () => {
    setSelectedFile(null);
    setMessageStatus(false);
    const currentNode = inputRef.current.value;
    currentNode.value = "";
  };

  return (
    <div className="main flex flex-col items-center mx-auto justify-center">
      <div className="rounded card border shadow-sm m-4 p-4">
        <h1 className="text-2xl">Image Uploader</h1>

        <div className="form_container mt-3">
          <form onSubmit={formSubmitHandler} className="text-center">
            <div className="field_container flex flex-col gap-y-3 shadow-md">
              <label htmlFor="file" className="italic">
                Select Image
              </label>
              <input
                ref={inputRef}
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                id="file"
              />
            </div>
            <div className="field_container text-center mt-3 flex justify-evenly">
              <button
                type="submit"
                className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
              >
                Upload
              </button>
              <button
                onClick={resetHandler}
                type="reset"
                className="px-3 py-2 bg-red-700 hover:bg-blue-600 text-white rounded"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {isUploading && (
          <div className="p-3 text-center">
            <div className="flex justify-center items-center my-3">
              <div className="loader"></div>
            </div>
            <h1>Uploading...</h1>
          </div>
        )}

        {messageStatus && (
          <div className="mt-3">
            <MessageStatus
              messageStatus={messageStatus}
              toggleMessageStatus={setMessageStatus}
            />
          </div>
        )}

        {uploadedSrc && messageStatus && (
          <div className="uploaded_view">
            <img
              className=" h-[300px] mx-auto mt-4 rounded shadow-slate-900"
              src={uploadedSrc}
              alt=""
            />
          </div>
        )}
      </div>

      <div className="mt-4 px-4 justify-center flex overflow-auto">
        {files.map((img) => {
          return (
            <img src={img} className="h-[200px] m-2 shadow rounded" key={img} />
          );
        })}
      </div>
    </div>
  );
};

export default ImageUploader;
