import React, { createContext, useContext, useState, useEffect } from 'react';
import ProductService from '../services/api/ProductService';

const DiscountContext = createContext();

export const useDiscount = () => useContext(DiscountContext);

export const DiscountProvider = ({ children }) => {
  const [discountSuggestions, setDiscountSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    ProductService.getAlldDiscountSuggestions()
      .then((data) => {
        setDiscountSuggestions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <DiscountContext.Provider value={{ discountSuggestions, loading, error }}>
      {children}
    </DiscountContext.Provider>
  );
};
