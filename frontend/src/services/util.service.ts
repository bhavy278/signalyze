import api from "./api";

export const keepServerRunning = async () => {
  setInterval(async () => {
    const response = await api.get("/");
    console.log(response.data);
  }, 10000);
};
