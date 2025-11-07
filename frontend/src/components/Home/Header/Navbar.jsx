import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Link, useLocation } from 'react-router-dom';
import TotalOrder from '../../Common/TotalOrder';
import { useOrder } from '../../../context/OrderContext';
import { useAuth } from '../../../context/AuthContext';
import { useDeliveryAddress } from '../../../context/DeliveryAddressContext';
import { MapPin } from 'lucide-react';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [navbarColor, setNavbarColor] = useState("bg-transparent");
    const [titleColor, setTitleColor] = useState("text-customred");


    const { orders } = useOrder();
    const { user } = useAuth();
    const { currentAddress } = useDeliveryAddress();
    const location = useLocation(); // React Router hook to access the current location

    // Navigation items
    const navItems = [
        { path: '/about', label: 'About' },
        { path: '/products', label: 'Menu' },
        { path: '/portfolio', label: 'Portfolio' },
        { path: '/client', label: 'Clients' },
        { path: '/blog', label: 'Blog' },
        { path: '/contact', label: 'Contact' },
        { path: '/profile', label: 'Profile' },
        ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : [])
    ];


    // Set the initial color based on the current pathname
    useEffect(() => {
        if (location.pathname === '/') {
            setNavbarColor('bg-transparent');
            setTitleColor('text-customred')
        } else {
            setNavbarColor('bg-customred');
            setTitleColor('text-[#fc9a30]')
        }
    }, [location.pathname]); // Re-run when pathname changes

    // Change color based on scroll position
    useEffect(() => {
        const changeColor = () => {
            if (window.scrollY >= 20) {
                setNavbarColor("backdrop-blur-sm  shadow-md bg-customred/90");
                setTitleColor('text-[#fc9a30]')
            } else if (location.pathname === '/') {
                setNavbarColor("bg-transparent text-white-green");
                setTitleColor("text-customred");
            } else {
                setNavbarColor("bg-customred");
                setTitleColor('text-[#fc9a30]');
            }
        };

        window.addEventListener("scroll", changeColor);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener("scroll", changeColor);
        };
    }, [location.pathname]); // Re-run when pathname changes to ensure correct behavior

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        <div className={`sticky top-0 z-50 w-full ${navbarColor}`}>
            <div className=" container  mx-auto wrapper  w-full relative z-40">
                <div className="bg-transparent text-white">
                    <div className="flex justify-between items-center  py-4">
                        <div className="flex items-center gap-10">
                            <Link to={'/'} className="flex items-center gap-2 ">
                                <img src={"/sitelogo.svg"} className='w-12' alt="Site Logo" />
                                <p className=" text-2xl font-poppins"><span className={`${titleColor} text-4xl`}>H</span>ungry <span className={`text-[#fc9a30] text-4xl`}>B</span>ellies</p>
                            </Link>
                            <nav className="hidden text-lg lg:flex space-x-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`border-b-2 ${location.pathname === item.path ? " border-yellow-400" : "text-white border-transparent"} hover:text-yellow-400 `}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="lg:flex hidden items-center justify-end gap-2 border-">
                            {user && (
                                <div className="flex items-center gap-2 text-white mr-4">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            )}
                            {currentAddress && (
                                <div className="flex items-center gap-2 text-white mr-4 bg-white/10 px-3 py-2 rounded-lg">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        Delivering to: {currentAddress.label || 'Current Location'}
                                    </span>
                                </div>
                            )}
                            <TotalOrder />
                            <button className="bg-yellow-400 text-black px-4 py-2 xl:text-base text-sm font-poppins font-semibold hidden lg:block">
                                Book a Table
                            </button>
                        </div>

                        <div className="lg:hidden flex items-center gap-3">
                            <TotalOrder />
                            <button onClick={toggleSidebar} className="text-white text-2xl ">
                                <img src="/icon/menu.svg" alt="Menu Icon" />
                            </button>
                        </div>
                    </div>
                </div>

                <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} user={user} />
            </div>
        </div>
    );
};

export default Navbar;
