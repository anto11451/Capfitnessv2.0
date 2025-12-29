import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageWrapperProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

export default function PageWrapper({
  children,
  showNavbar = true,
  showFooter = true,
  className = "",
}: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex-1 ${showNavbar ? "pt-16" : ""} ${className}`}
      >
        {children}
      </motion.main>
      
      {showFooter && <Footer />}
    </div>
  );
}
