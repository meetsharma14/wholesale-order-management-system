import api from "../api/axios";

const endpoints = {
  categories: "/categories/",
  orders: "/orders/",
  payments: "/payments/",
  products: "/products/",
  retailers: "/retailers/",
  salesmen: "/salesmen/",
  suppliers: "/suppliers/",
};

export const getResource = async (resource) => {
  const endpoint = endpoints[resource];

  if (!endpoint) {
    throw new Error(`Unknown API resource: ${resource}`);
  }

  const response = await api.get(endpoint);
  return response.data;
};

export const createResource = async (resource, data) => {
  const response = await api.post(endpoints[resource], data);
  return response.data;
};

export const updateResource = async (resource, id, data) => {
  const response = await api.put(`${endpoints[resource]}${id}`, data);
  return response.data;
};

export const deleteResource = async (resource, id) => {
  await api.delete(`${endpoints[resource]}${id}`);
};
