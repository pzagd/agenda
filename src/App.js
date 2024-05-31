import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import StoragePage from "./pages/StoragePage.js"; // Updated import for StoragePage

import "./reset.css";
import "./App.css";

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/storage/:bucketName', element: <StoragePage /> }, // Route with parameter
]);

export default function App() {
  return <RouterProvider router={router} />;
}
