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

export const getOrdersCount = async () => {
  try {
    const response = await getOrders();
    return response.data?.length || 0;
  } catch (error) {
    console.error("Error fetching orders count:", error);
    return 0;
  }
};