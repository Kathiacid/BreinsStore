// src/assets/services/shopService.js
import apiClient from "../api/apiCliente";

const shopService = {
  async getProductos(params = {}) {
    // ✅ limpia undefined / null
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
    );

    // ✅ normaliza keys por si llega "precio max" => "precio_max"
    const normalized = Object.fromEntries(
      Object.entries(cleaned).map(([k, v]) => [String(k).replace(/\s+/g, "_"), v])
    );

    const res = await apiClient.get("/productos/", { params: normalized });
    return res.data;
  },

  // (opcional) si después quieres endpoint para categorías:
  // async getCategorias() {
  //   const res = await apiClient.get("/categorias/");
  //   return res.data;
  // },
};

export default shopService;

