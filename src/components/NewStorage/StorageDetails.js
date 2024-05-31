import { formatFileSize } from "../../utils/Utils";
import { api_deleteBucket } from "../../services/ApiService";

export default function StorageDetails({
  bucketName,
  location,
  storageSize,
  onDelete,
}) {
  const handleDeleteBucket = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the bucket "${bucketName}"?`
    );
    if (!isConfirmed) return;

    try {
      await api_deleteBucket(bucketName);
      onDelete();
    } catch (error) {
      console.error("Error deleting bucket:", error);
    }
  };

  return (
    <div id="BucketDetails" className="col bg-white p-md-5 p-3">
      <div className="mb-3 text-right">
        <button onClick={handleDeleteBucket}>Delete Bucket</button>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>
                <strong>Bucket name:</strong>
              </td>
              <td>{bucketName}</td>
            </tr>
            <tr>
              <td>
                <strong>Location:</strong>
              </td>
              <td>{location}</td>
            </tr>
            <tr>
              <td>
                <strong>Storage size:</strong>
              </td>
              <td>{formatFileSize(storageSize)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}