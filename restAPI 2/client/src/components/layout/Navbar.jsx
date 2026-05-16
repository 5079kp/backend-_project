import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?search=${encodeURIComponent(keyword)}`);
    } else {
      navigate("/products");
    }
    setIsOpen(false); // Close mobile menu on search
  };

  const getNavPath = (item) => {
    const paths = {
      Home: "/",
      Collection: "/collections",
      Featured: "/featured",
      Blog: "/blog",
      Contact: "/contact",
    };
    return paths[item] || "/products";
  };

  const getMobilePath = (item) => {
    const paths = {
      "NEW SEASON": "/collections/new-season",
      "EVENING": "/collections/evening",
      "ACCESSORIES": "/collections/accessories",
      "ATELIER": "/atelier",
    };
    return paths[item] || "/products";
  };

  return (
    <>
      {/* Premium Navbar */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-black/90 backdrop-blur-xl border-b border-white/20" 
            : "bg-black/10 backdrop-blur-xl border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="text-4xl italic font-light text-white tracking-wide hover:scale-105 transition-transform duration-500"
            >
              Zivora
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
              {["Home", "Collection", "Featured", "Blog", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={getNavPath(item)}
                  className="relative text-sm tracking-[2px] text-white/80 hover:text-white transition-all duration-500 group"
                >
                  {item}
                  <span className="absolute left-0 -bottom-2 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-44 bg-white/10 border border-white/10 rounded-full px-4 py-2 pl-10 text-white placeholder:text-white/50 outline-none focus:w-56 focus:bg-white/20 transition-all duration-500"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/70" />
              </form>

              {/* Icons */}
              <Link 
                to="/profile" 
                className="text-white/80 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link 
                to="/wishlist" 
                className="text-white/80 hover:text-red-400 hover:scale-110 transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
              </Link>

              <Link
                to="/cart"
                className="relative text-white/80 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/95 backdrop-blur-2xl px-6 py-6 space-y-5 border-t border-white/10">
            {["NEW SEASON", "EVENING", "ACCESSORIES", "ATELIER"].map((item) => (
              <Link
                key={item}
                to={getMobilePath(item)}
                onClick={() => setIsOpen(false)}
                className="block text-white/80 hover:text-white tracking-[2px] transition-all duration-300"
              >
                {item}
              </Link>
            ))}

            <form onSubmit={handleSearch} className="relative pt-4">
              <input
                type="text"
                placeholder="Search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-full px-4 py-3 pl-10 text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-all duration-500"
              />
              <Search className="absolute left-3 top-7 w-4 h-4 text-white/70" />
            </form>

            <div className="flex items-center gap-6 pt-4">
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <User className="text-white/80 hover:text-white transition-colors" />
              </Link>
              <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                <Heart className="text-white/80 hover:text-red-400 transition-colors" />
              </Link>
              <Link to="/cart" className="relative" onClick={() => setIsOpen(false)}>
                <ShoppingBag className="text-white/80 hover:text-white transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with proper buttons */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5b0000] via-[#8b0000] to-[#2b0000]"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-white max-w-2xl">
            <p className="uppercase tracking-[5px] text-sm mb-4 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
              New Evening Collection
            </p>
            <h1 className="text-6xl md:text-8xl font-serif leading-none mb-6 opacity-0 animate-[slideUp_1s_ease-out_0.3s_forwards]">
              After Dark
            </h1>
            <button 
              onClick={() => navigate("/collections/evening")}
              className="group relative overflow-hidden border border-white px-8 py-4 uppercase tracking-[3px] text-sm hover:text-black transition-all duration-500"
            >
              <span className="relative z-10">Explore The Edit</span>
              <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};


export default Navbar;