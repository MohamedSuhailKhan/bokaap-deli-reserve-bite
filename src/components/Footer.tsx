
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bokaap-Deli</h3>
            <p className="text-gray-600">
              Authentic flavors, modern dining experience
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/menu" className="block text-gray-600 hover:text-primary">
                Menu
              </Link>
              <Link to="/reservations" className="block text-gray-600 hover:text-primary">
                Reservations
              </Link>
              <Link to="/order" className="block text-gray-600 hover:text-primary">
                Order Online
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase">Contact</h4>
            <div className="space-y-2 text-gray-600">
              <p>123 Main Street</p>
              <p>Cape Town, South Africa</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: info@bokaapdeli.com</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Bokaap-Deli. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
