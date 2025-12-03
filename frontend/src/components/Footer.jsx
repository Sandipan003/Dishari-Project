import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand & About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-accent">Dishari Physics Academy</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Dedicated to excellence in Physics education. We nurture curiosity and build strong conceptual foundations for competitive success.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                                <span>123 Education Lane, Knowledge City, West Bengal, India</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-2 flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-2 flex-shrink-0" />
                                <span>info@dishariphysics.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Dishari Physics Academy. All rights reserved.</p>
                    <p className="mt-2">Designed & Developed by Piyush and Sandipan</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
