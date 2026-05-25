import privateApi from "./privateApi";

export const addToCart = (product_id, quantity=1) => {
    return privateApi.post("cart/add/", {
        product_id: product_id,
        quantity: quantity
    });
};

export const getCart = () => {
    return privateApi.get("cart/");
};

export const removeCartItem = (itemId) => {
  return privateApi.delete(`cart/item/${itemId}/`);
};

export const increaseCartItem = (itemId) => {
  return privateApi.patch(`cart/item/${itemId}/increase/`);
};


export const decreaseCartItem = (itemId) => {
  return privateApi.patch(`cart/item/${itemId}/decrease/`);
};