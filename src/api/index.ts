import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const IMAGE_API_URL = `${process.env.EXPO_PUBLIC_API_URL}/images/`;
