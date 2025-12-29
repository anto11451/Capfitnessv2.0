import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Dumbbell, Mail, Instagram, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Calculators", path: "/calculators" },
  { name: "Knowledge Hub", path: "/knowledge" },
  { name: "Fitness Quiz", path: "/quiz" },
  { name: "Pricing", path: "/pricing" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
];

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/anto_mathew1",
    color: "hover:text-pink-500 hover:shadow-[0_0_10px_#ec4899]",
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    href: "https://wa.me/+919136331206",
    color: "hover:text-green-500 hover:shadow-[0_0_10px_#22c55e]",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:anto.anand111@gmail.com",
    color: "hover:text-accent hover:shadow-[0_0_10px_hsl(var(--accent))]",
  },
];

export default function Footer() {
  const [, setLocation] = useLocation();

  return (
    <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* LOGO + ABOUT */}
          <div className="md:col-span-2 space-y-4">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center neon-border">
                <Dumbbell className="w-7 h-7 text-primary" />
              </div>
              <span className="font-display font-bold text-2xl text-primary neon-text">
                Cap's FITNESS
              </span>
            </motion.div>

            <p className="text-muted-foreground max-w-md">
              Transform your body, elevate your mind, achieve your goals.
              Personalized fitness coaching backed by science and experience.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground transition-all ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <motion.button
                    onClick={() => setLocation(link.path)}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                    whileHover={{ x: 5 }}
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg text-foreground">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:anto.anand111@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  anto.anand111@gmail.com
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/+919136331206"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-green-500 transition-colors flex items-center gap-2"
                >
                  <FaWhatsapp className="w-4 h-4 text-green-500" />
                  WhatsApp Support
                </a>
              </li>

              <li>
                <a
                  href="https://instagram.com/anto_mathew1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4 text-pink-500" />
                  @anto_mathew1
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Cap's Fitness. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground/70 italic text-center md:text-right">
            "The change begins the moment you get back up and keep pushing forward."
          </p>
        </div>

        {/* PRIVACY + TERMS */}
        <div className="mt-8 border-t border-border/40 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-primary transition-colors">
                Terms & Conditions
              </a>
            </div>

            

          </div>
        </div>

      </div>
    </footer>
  );
}
