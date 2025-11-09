import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../contenxt/CartContext";
import { useAuth } from "../contenxt/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, loading } = useCart(); 
  const auth = useAuth();

  const totalItems = loading ? 0 : (cart ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          eStore
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/cart"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Cart
          </Link>
          <Link
            to="/orders"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Orders
          </Link>
          <Link
            to="/account"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Account
          </Link>

          {!auth?.token ? (
            <Link to="/login" className="hover:text-gray-200 transition-colors duration-200">Login</Link>
          ) : (
            <button onClick={auth.logout} className="hover:text-gray-200 transition-colors duration-200">Logout</button>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-white text-blue-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-700 to-purple-800 px-6 py-3 space-y-3">
          <Link to="/" className="block hover:text-gray-200">
            Home
          </Link>
          <Link to="/cart" className="block hover:text-gray-200">
            Cart
          </Link>
          <Link to="/orders" className="block hover:text-gray-200">
            Orders
          </Link>
          <Link to="/account" className="block hover:text-gray-200">
            Account
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
