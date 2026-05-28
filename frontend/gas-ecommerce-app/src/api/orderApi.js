import privateApi from "./privateApi";


export const checkout = (phoneNumber) => {
  return privateApi.post("checkout/", {
    phone_number: phoneNumber
  });
};

export const getOrders = () => {
  return privateApi.get("orders/");
};

export const getOrder = (orderId) => {
  return privateApi.get(`orders/${orderId}/`);
};