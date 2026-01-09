import axiosClient from "@/lib/axios-client";
import { s } from "framer-motion/client";

export const pageVotCauLong = {
  //Hàm lấy danh sách trang (pages)
  getPages:  async (searchParams: any) => {
    const res = await axiosClient.get("/products", { params : searchParams});
    console.log("API Call to  /products with params:", searchParams, res);
    return res;
  },
};
