import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contenxt/CartContext";

export default function Cart() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    // nothing here now — data is provided by CartContext
  }, [cart]);

  if (loading) return <div className="text-center py-10">Loading your cart...</div>;
  if (!cart || !cart.length)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty 🛒</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Continue Shopping →
        </Link>
      </div>
    );

  const total = cart.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.product?.imageUrl}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                <p className="text-gray-500">₹{item.product?.price}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <p className="font-semibold">₹{(item.product?.price || 0) * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <h2 className="text-2xl font-semibold">Total: ₹{total.toFixed(2)}</h2>
        <Link
          to="/checkout"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
