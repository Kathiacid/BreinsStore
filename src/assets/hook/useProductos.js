// src/hook/useProductos.js
import { useState, useEffect, useCallback, useRef } from "react";
import shopService from "../services/shopService";

// Comparación superficial para evitar recargas si el objeto es idéntico
function shallowEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

export const useProductos = (initialFilters = {}) => {
  const [productos, setProductos] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Usamos ref para controlar los filtros actuales sin causar renders infinitos
  const filtersRef = useRef(initialFilters);
  const [triggerFetch, setTriggerFetch] = useState(0); 

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const data = await shopService.getProductos(currentFilters);

      // Manejo robusto de la respuesta del API
      let list = [];
      let metaData = null;

      if (data?.results?.results && Array.isArray(data.results.results)) {
        list = data.results.results;
        metaData = data.results;
      } else if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.results)) {
        list = data.results;
        metaData = data;
      }

      setProductos(list);
      setMeta(metaData);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error al cargar los productos");
      setProductos([]); 
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchProductos();
  }, [triggerFetch, fetchProductos]); 

  // ✅ CORRECCIÓN: Reemplaza los filtros completamente en lugar de mezclarlos
  const updateFilters = useCallback((newFilters) => {
    const cleanFilters = {};
    // Solo guardamos valores válidos (no undefined/null)
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k] !== undefined && newFilters[k] !== null && newFilters[k] !== "") {
        cleanFilters[k] = newFilters[k];
      }
    });

    // Si los filtros cambiaron, actualizamos y recargamos
    if (!shallowEqual(filtersRef.current, cleanFilters)) {
      filtersRef.current = cleanFilters;
      setTriggerFetch(t => t + 1); 
    }
  }, []);

  return {
    productos,
    meta,
    loading,
    error,
    updateFilters,
    refresh: () => setTriggerFetch(t => t + 1),
  };
};