export function formatFileSize(sizeInBytes) {
  if (sizeInBytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  return (
    parseFloat((sizeInBytes / Math.pow(1024, i)).toFixed(2)) + " " + units[i]
  );
}

export function formatDate(date) {
  const formattedDate = date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .split("/")
    .join(".");

  return formattedDate;
}
