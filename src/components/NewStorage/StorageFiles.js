import { useState } from "react";
import { formatFileSize, formatDate } from "../../utils/Utils.js";
import {
  api_uploadFileToBucket,
  api_deleteFileFromBucket,
} from "../../services/ApiService.js";

export default function StorageFiles({
  fileList,
  bucketName,
  onFileListUpdate,
}) {
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const newFile = {
        name: file.name,
        dateAdded: formatDate(new Date()),
        size: file.size,
      };
      await addOrUpdateFileInList(bucketName, newFile);
    }
  }

  function handleUploadButtonClick() {
    document.getElementById("fileInput").click();
  }

  async function handleDeleteButtonClick() {
    if (selectedFile) {
      const isConfirmed = window.confirm(
        `Are you sure you want to delete ${selectedFile.name}?`
      );
      if (isConfirmed) {
        await deleteFileFromList(bucketName, selectedFile.name);
        setSelectedFile(null);
      }
    }
  }

  function handleFileClick(file) {
    setSelectedFile(file);
  }

  async function addOrUpdateFileInList(bucketName, newFile) {
    try {
      const existingFileIndex = fileList.findIndex(
        (file) => file.name === newFile.name
      );
      let updatedFileList;
      if (existingFileIndex !== -1) {
        updatedFileList = [...fileList];
        updatedFileList[existingFileIndex] = newFile;
      } else {
        updatedFileList = [...fileList, newFile];
      }

      await api_uploadFileToBucket(bucketName, newFile);
      onFileListUpdate(updatedFileList);
    } catch (error) {
      console.error("Error adding or updating file in list:", error);
    }
  }

  async function deleteFileFromList(bucketName, fileName) {
    try {
      await api_deleteFileFromBucket(bucketName, fileName);
      const updatedFileList = fileList.filter((file) => file.name !== fileName);
      onFileListUpdate(updatedFileList);
    } catch (error) {
      console.error("Error deleting file from list:", error);
    }
  }

  return (
    <>
      <div className="col-md-6 col-sm-12 d-flex align-items-center justify-content-start pt-3 pb-3">
        <p>All Files ({fileList.length})</p>
      </div>

      <div className="col-md-6 col-sm-12 d-flex align-items-center justify-content-md-end pt-3 pb-3">
        <button className="mr-3 ml-md-3" onClick={handleDeleteButtonClick}>
          Delete Object
        </button>
        <button onClick={handleUploadButtonClick}>Upload Object</button>
        <input
          id="fileInput"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div className="col-12 pt-3 pb-3">
        <div id="bucketList" className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Last modified</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {fileList.map((file, index) => (
                <tr
                  key={index}
                  onClick={() => handleFileClick(file)}
                  className={selectedFile === file ? "table-active" : ""}
                >
                  <td>{file.name}</td>
                  <td>{file.dateAdded}</td>
                  <td>{formatFileSize(file.size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
