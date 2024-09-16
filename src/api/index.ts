import axios from "axios";

export const api = axios.create({
  // url local do pc de voces. a mesma que o expo tá rodando,
  // mas com a porta da api
  baseURL: "http://192.168.0.194:3000",
});
