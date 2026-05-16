import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Logo Animation
    gsap.fromTo(
      logoRef.current,
      {
        opacity: 0,
        y: 120,
        scale: 0.7,
        rotateX: 90,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        },
      }
    );

    // Footer Content Animation
    gsap.fromTo(
      contentRef.current,
      {
        opacity: 0,
        y: 80,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.3,
        delay: 0.3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 70%",
        },
      }
    );

    // Cleanup ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Helper function for navigation paths
  const getNavPath = (item) => {
    if (item === "Home") return "/";
    if (item === "Shop") return "/products";
    if (item === "Collections") return "/collections";
    return `/${item.toLowerCase()}`;
  };

  const getCategoryPath = (category) => {
    const param = category.toLowerCase().replace(' ', '-');
    return `/products?category=${param}`;
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-black text-white overflow-hidden"
    >
      {/* Rest of your JSX remains the same until the links */}

      {/* Links - Fixed paths */}
      <div>
        <h3 className="text-lg mb-6 uppercase tracking-[3px]">
          Quick Links
        </h3>

        <ul className="space-y-4 text-white/60">
          {["Home", "Shop", "Collections", "Contact"].map((item) => (
            <li key={item}>
              <Link
                to={getNavPath(item)}
                className="hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories - Dynamic paths */}
      <div>
        <h3 className="text-lg mb-6 uppercase tracking-[3px]">
          Categories
        </h3>

        <ul className="space-y-4 text-white/60">
          {["Evening Wear", "Luxury Fashion", "Accessories", "Street Style"].map((category) => (
            <li key={category}>
              <Link
                to={getCategoryPath(category)}
                className="hover:text-red-400 transition-all duration-300 hover:translate-x-2 inline-block"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter - Add form handling */}
      <div>
        <h3 className="text-lg mb-6 uppercase tracking-[3px]">
          Newsletter
        </h3>

        <p className="text-white/60 mb-5">
          Subscribe for exclusive fashion drops
          and luxury offers.
        </p>

        <form onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email.value;
          console.log('Newsletter signup:', email);
          // Add your newsletter API call here
          e.target.reset();
        }}>
          <div className="flex border border-white/10 rounded-full overflow-hidden backdrop-blur-xl bg-white/5">
            <input
              name="email"
              type="email"
              placeholder="Your email"
              required
              className="bg-transparent px-5 py-3 w-full outline-none text-white placeholder:text-white/40"
            />
            <button 
              type="submit"
              className="bg-red-700 hover:bg-red-600 px-6 transition-all duration-500"
            >
              Join
            </button>
          </div>
        </form>
      </div>

      {/* Rest of your footer remains the same */}
    </footer>
  );
};

export default Footer;