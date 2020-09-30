import owner from "./owner.js";
import productCount from "./productCount.js";

export default {
  createdAt: (shop) => shop.createdAt,
  owner,
  productCount
};
