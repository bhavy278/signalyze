import axios from "axios";
import api from "./api";

export const keepServerRunning = async () => {
  const response = await axios.get("http://localhost:5001/api/v1");
};
