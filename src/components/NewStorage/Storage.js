import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TabButton from "../NewStorage/TabButton";

import StorageFiles from "../NewStorage/StorageFiles";
import StorageDetails from "../NewStorage/StorageDetails";
import { api_fetchFileList, api_fetchBucketDetails } from "../../services/ApiService";

export default function Storage() {
    const { bucketName } = useParams();
    const navigate = useNavigate();
  
    const [selectedTopic, setSelectedTopic] = useState("files");
    const [fileList, setFileList] = useState([]);
    const [storageDetails, setStorageDetails] = useState({
      name: "",
      location: "",
      size: 0,
    });
  
    useEffect(() => {
      async function fetchFileList() {
        try {
          const response = await api_fetchFileList(bucketName);
          setFileList(response.data.bucket.files);
        } catch (error) {
          console.error("Error fetching file list:", error);
        }
      }
  
      async function fetchBucketDetails() {
        try {
          const response = await api_fetchBucketDetails(bucketName);
          setStorageDetails(response.data);
        } catch (error) {
          console.error("Error fetching bucket details:", error);
        }
      }
  
      fetchFileList();
      fetchBucketDetails();
    }, [bucketName]);
  
    useEffect(() => {
      async function fetchBucketDetails() {
        try {
          const response = await api_fetchBucketDetails(bucketName);
          setStorageDetails(response.data);
        } catch (error) {
          console.error("Error fetching bucket details:", error);
        }
      }
  
      fetchBucketDetails();
    }, [fileList, bucketName]);
  
    function handleSelect(selectedButton) {
      setSelectedTopic(selectedButton);
    }
  
    async function handleDeleteBucket() {
      navigate('/');
    }

    
    return (
          <div className="container bg-light p-md-5 p-3">
            <div className="row">
              <div className="col mb-3">
                <h1 className="responsive-title-h1">{bucketName} Storage</h1>
              </div>
            </div>
    
            <div className="row mt-3 bg-light">
              <div
                id="tabs"
                className="col-12 d-flex align-items-center justify-content-start"
              >
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <TabButton
                      onSelect={() => handleSelect("files")}
                      isActive={selectedTopic === "files"}
                    >
                      Files
                    </TabButton>
                  </li>
                  <li className="nav-item">
                    <TabButton
                      onSelect={() => handleSelect("storageDetails")}
                      isActive={selectedTopic === "storageDetails"}
                    >
                      Details
                    </TabButton>
                  </li>
                </ul>
              </div>
            </div>
    
            <div className="row bg-white p-md-5 p-3 mb-3">
              {selectedTopic === "files" ? (
                <StorageFiles
                  fileList={fileList}
                  bucketName={bucketName}
                  onFileListUpdate={setFileList}
                />
              ) : (
                <StorageDetails
                  bucketName={storageDetails.name}
                  location={storageDetails.location}
                  storageSize={storageDetails.size}
                  onDelete={handleDeleteBucket}
                />
              )}
            </div>
    
            <div className="row">
              <div className="col text-center">
                <button onClick={() => navigate('/')}>
                  Back
                </button>
              </div>
            </div>
    
          </div>
      );
}