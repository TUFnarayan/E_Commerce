import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contenxt/CartContext";

export default function Checkout() {
  const { cart, cartId, loading, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);

    // Build Order object expected by the backend
    const order = {
      customerName: customerName,
      totalAmount: total,
      items: cart.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.product?.price || 0
      }))
    };

    try {
      // POST to the correct backend endpoint: /api/orders
      const res = await axiosClient.post('/orders', order);
      console.log('Order response:', res.data);
      alert('✅ Order placed successfully!');
      // clear local cart
      try {
        await clearCart();
      } catch (e) {
        console.warn('Failed to clear cart after order:', e);
      }
      navigate('/orders');
    } catch (err) {
      console.error('Error placing order:', err);
      // try to show backend error message if available
      let backendMsg = null;
      try {
        backendMsg = err?.response?.data || err?.message || null;
      } catch (e) {
        backendMsg = err?.message || null;
      }
      if (backendMsg) {
        console.error('Backend error:', backendMsg);
        const text = typeof backendMsg === 'string' ? backendMsg : JSON.stringify(backendMsg);
        alert(`❌ Failed to place order. Server says: ${text}`);
      } else {
        alert('❌ Failed to place order. Try again.');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading checkout...</div>;
  if (!cart || cart.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty 🛒</h2>
      </div>
    );

  const total = cart.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="mb-6">
        <label className="block mb-2 text-gray-700 font-medium">Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-center border-b pb-3"
          >
            <div>
              <h3 className="font-medium">{item.product?.name}</h3>
              <p className="text-sm text-gray-500">
                {item.quantity} × ₹{item.product?.price}
              </p>
            </div>
            <p className="font-semibold">
              ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-lg font-semibold border-t pt-4 mb-6">
        <span>Total:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      <button
        onClick={handleOrder}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
      >
        Place Order →
      </button>
    </div>
  );
}
