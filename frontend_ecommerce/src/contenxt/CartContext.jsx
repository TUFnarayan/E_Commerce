import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosClient.get('/cart');
        if (response.data && response.data.length > 0) {
          const latestCart = response.data[0];
          setCartId(latestCart.id);
          setCart(latestCart.items || []);
        } else {
          setCart([]);
          setCartId(null);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  
  const addToCart = async (product) => {
      try {

      setCart(prev => {
        const existing = prev.find(i => i.productId === product.id);
        if (existing) {
          return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        
        return [...prev, { productId: product.id, quantity: 1, product }];
      });

      const response = await axiosClient.post(`/cart/add`, null, {
        params: { productId: product.id, quantity: 1 }
      });

      
      if (response.data) {
        setCartId(response.data.id ?? cartId);
        setCart(response.data.items || []);
      }
    } catch (error) {
  console.error("Error adding to cart:", error);

      try {
        const res = await axiosClient.get('/cart');
        if (res.data && res.data.length > 0) {
          setCartId(res.data[0].id);
          setCart(res.data[0].items || []);
        }
      } catch (e) {
        console.error('Error refetching cart after failed add:', e);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
  if (quantity < 1) return;

    
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));

  if (!cartId) return;

    try {
      await axiosClient.put('/cart/update', null, { params: { cartId, productId, quantity } });
    } catch (error) {
      console.error('Error updating quantity:', error);
      
      try {
        const res = await axiosClient.get('/cart');
        if (res.data && res.data.length > 0) {
          setCartId(res.data[0].id);
          setCart(res.data[0].items || []);
        }
      } catch (e) {
        console.error('Error refetching cart after failed update:', e);
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (!cartId) {
      
      setCart(prev => prev.filter(i => i.productId !== productId));
      return;
    }
    try {
      await axiosClient.delete('/cart/remove', { params: { cartId, productId } });
      setCart(prev => prev.filter(i => i.productId !== productId));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      if (cartId) {
        await axiosClient.delete(`/cart/${cartId}`);
      }
      setCart([]);
      setCartId(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartId,
      addToCart, 
      updateQuantity,
      removeFromCart, 
      clearCart,
      loading 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
