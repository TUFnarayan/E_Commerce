export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
      <img
        src={product.imageUrl || "https://via.placeholder.com/200"}
        alt={product.name}
        className="rounded-xl w-full h-48 object-cover"
      />
      <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
      <p className="text-gray-500 text-sm">{product.description}</p>
      <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>
      <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  );
}
