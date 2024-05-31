import { useState, useEffect } from "react";
import { api_fetchBuckets, api_addBucket } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";

export default function BucketList() {
  const [buckets, setBuckets] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [bucketName, setBucketName] = useState("");
  const [bucketLocation, setBucketLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBuckets();
  });

  async function fetchBuckets() {
    try {
      const response = await api_fetchBuckets();
      setBuckets(response.data.buckets);
    } catch (error) {
      console.error("Error fetching buckets:", error);
    }
  }

  async function handleRowClick(bucketName) {
    setSelectedBucket(bucketName);
    navigate(`/storage/${bucketName}`);
  }

  async function handleCreateBucket(event) {
    event.preventDefault();
    setErrorMessage("");
    try {
      await api_addBucket(bucketName, bucketLocation);
      fetchBuckets();
      setBucketName("");
      setBucketLocation("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(`Bucket with name ${bucketName} already exists.`);
      } else {
        setErrorMessage("Error creating bucket. Please try again.");
      }
    }
  }

  function toggleFormVisibility() {
    setIsFormVisible(!isFormVisible);
  }

  return (
    <>
      <div className="container">
        <div className="row align-items-center">
          <div className="col text-left mb-3">
            <h1 className="responsive-title-h1">Bucket List</h1>
          </div>
        </div>

        <div className="row bg-white p-md-5 p-3">
          <div className="col-md-6 col-sm-12 d-flex align-items-center justify-content-start pt-3 pb-3">
            <p>All Buckets ({buckets.length})</p>
          </div>
          <div className="col-md-6 col-sm-12 d-flex align-items-center justify-content-md-end pt-3 pb-3">
            <button onClick={toggleFormVisibility}>
              {isFormVisible ? "Close" : "Create New Bucket"}
            </button>
          </div>
        </div>

        {isFormVisible && (
          <div
            id="createNewBucketForm"
            className="row bg-white p-md-5 p-3 mt-3 mb-3"
          >
            <div className="col-12 pt-3 pb-3">
              <h2 className="responsive-title-h2 ">Create New Bucket</h2>
            </div>
            <div className="col-12 pt-3 pb-3">
              <form onSubmit={handleCreateBucket}>
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="bucketName">Bucket Name*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="bucketName"
                        value={bucketName}
                        onChange={(e) => setBucketName(e.target.value)}
                        placeholder="Enter bucket name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="bucketLocation">Bucket Location*</label>
                      <select
                        className="form-control"
                        id="bucketLocation"
                        value={bucketLocation}
                        onChange={(e) => setBucketLocation(e.target.value)}
                        required
                      >
                        <option value="">Select bucket location</option>
                        <option value="Kranj">Kranj</option>
                        <option value="Ljubljana">Ljubljana</option>
                        <option value="Maribor">Maribor</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-sm-12 text-left">
                    <button type="submit">Create Bucket</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="row bg-white p-md-5 p-3">
          <div className="col-12 pt-3 pb-3">
            <div id="bucketList" className="table-responsive">
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {buckets.map((bucket, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(bucket.name)}
                      className={`clickable-row ${
                        selectedBucket === bucket.name ? "table-active" : ""
                      }`}
                    >
                      <td>{bucket.name}</td>
                      <td>{bucket.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
