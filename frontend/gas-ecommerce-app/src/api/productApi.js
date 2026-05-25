import publicApi from "./publicApi";

export const getProducts = () => {
    return publicApi.get("products/");
};

export const getProduct = (id) => {
  return publicApi.get(`products/${id}/`);
};
