import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-2">No Orders Yet 😅</h2>
        <p className="text-gray-500">Place an order to see it here!</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🧾 Your Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Order #{order.id}
                </h2>
                <p className="text-gray-500 text-sm">
                  Placed on {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <span className="text-indigo-600 font-bold text-lg">
                ₹{order.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="divide-y">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-3 text-gray-700"
                >
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
