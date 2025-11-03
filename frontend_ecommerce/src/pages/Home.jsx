import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useCart } from "../contenxt/CartContext";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // ✅ get addToCart function

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Featured Products
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center">No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5"
            >
              <img
                src={product.imageUrl || "https://via.placeholder.com/300"}
                alt={product.name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />

              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {product.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-blue-600 font-semibold text-lg">
                  ₹{product.price}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await addToCart(product);
                      alert('Product added to cart!');
                    } catch (error) {
                      console.error('Error adding to cart:', error);
                      alert('Failed to add product to cart. Please try again.');
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
