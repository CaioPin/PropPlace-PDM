import axios from "axios";

export const api = axios.create({
  // url local do pc de voces. a mesma que o expo tá rodando,
  // mas com a porta da api
  baseURL: "http://192.168.1.68:3000",
});

export const IMAGE_API_URL = `${process.env.EXPO_PUBLIC_API_URL}/images/`;
