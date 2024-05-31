import axios from "axios";
import CONFIG from "../Config";

function api_fetchFileList(bucketName) {
  return axios.get(`${CONFIG.apiURL}/bucketList?bucketName=${bucketName}`);
}

function api_fetchBucketDetails(bucketName) {
  return axios.get(`${CONFIG.apiURL}/bucketDetails?bucketName=${bucketName}`);
}

function api_fetchBuckets() {
  return axios.get(`${CONFIG.apiURL}/bucketList/buckets`);
}

function api_addBucket(bucketName, bucketLocation) {
  return axios.post(`${CONFIG.apiURL}/bucketList/bucket`, {
    bucketName,
    bucketLocation,
  });
}

function api_deleteBucket(bucketName) {
  return axios.delete(`${CONFIG.apiURL}/bucketList/bucket`, {
    data: { bucketName },
  });
}

function api_uploadFileToBucket(bucketName, newFile) {
  return axios.post(`${CONFIG.apiURL}/bucketList/file`, {
    bucketName,
    file: newFile,
  });
}

function api_deleteFileFromBucket(bucketName, fileName) {
  return axios.delete(`${CONFIG.apiURL}/bucketList/file`, {
    data: { bucketName, fileName },
  });
}

export {
  api_fetchFileList,
  api_fetchBucketDetails,
  api_fetchBuckets,
  api_addBucket,
  api_deleteBucket,
  api_uploadFileToBucket,
  api_deleteFileFromBucket,
};
