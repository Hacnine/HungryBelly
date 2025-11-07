
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Search, Clock, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDeliveryAddress } from '../../context/DeliveryAddressContext';

const Hero = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { currentAddress, savedAddresses, setDeliveryAddress, saveAddress } = useDeliveryAddress();
    const [address, setAddress] = useState('');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.address-input-container')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mock address suggestions - in real app, this would come from an API
    const addressSuggestions = [
        'Downtown Restaurant District',
        'Midtown Business Center',
        'Uptown Residential Area',
        'Airport Terminal 1',
        'Shopping Mall Central'
    ];

    const handleLocationDetection = async () => {
        setIsLoadingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // In a real app, you'd use a geocoding service like Google Maps API
                    // For demo purposes, we'll simulate getting an address
                    const mockAddress = `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    setAddress(mockAddress);
                    setShowSuggestions(false);
                } catch (error) {
                    setLocationError('Unable to get address from location.');
                }

                setIsLoadingLocation(false);
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location.';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location services.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }

                setLocationError(errorMessage);
                setIsLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        if (!address.trim()) return;

        try {
            // Create a temporary address object
            const addressData = {
                street: address,
                city: 'Unknown City', // In a real app, this would be parsed from the address
                state: 'Unknown State',
                zipCode: null,
                country: 'US',
                type: 'delivery',
                label: 'Current Location',
                latitude: null,
                longitude: null,
            };

            // If user is authenticated, save to backend
            if (isAuthenticated && user) {
                setIsSavingAddress(true);
                const savedAddr = await saveAddress(addressData);
                setDeliveryAddress(savedAddr);
            } else {
                // For non-authenticated users, just set as current address temporarily
                setDeliveryAddress({
                    ...addressData,
                    id: 'temp-' + Date.now(),
                    isDefault: false,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            }

            // Navigate to products page
            navigate('/products');
        } catch (error) {
            console.error('Error saving address:', error);
            setLocationError('Failed to save address. Please try again.');
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleSignInClick = () => {
        navigate('/login');
    };

    const handleAddressChange = (value) => {
        setAddress(value);
        setShowSuggestions(value.length > 0);
        setLocationError('');
    };

    const selectSuggestion = (suggestion) => {
        setAddress(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-col items-center justify-center md:bg-hero-bg bg-hero-sm bg-cover overflow-hidden -mt-20 text-white px-4 h-[750px]">
            {/* Header */}
            <div data-aos="fadeIn" className="mb-6 text-center">
                <h1
                    data-testid="HomePageHeroHeader"
                    className="text-3xl md:text-4xl font-semibold font-poppins capitalize mb-2"
                >
                    Discover restaurants and more near you.
                </h1>
                <p className="text-white/80 text-lg">
                    Order from your favorite restaurants with fast delivery
                </p>
            </div>

            {/* Address Input Section */}
            <div data-aos="slideInUp" className="flex flex-col items-center w-full max-w-lg space-y-4">
                <form
                    onSubmit={handleAddressSubmit}
                    autoComplete="off"
                    className="w-full relative address-input-container"
                >
                    {/* Location Detection Button */}
                    <button
                        type="button"
                        onClick={handleLocationDetection}
                        disabled={isLoadingLocation}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 p-2 text-gray-600 hover:text-orange-500 transition-colors disabled:opacity-50"
                        title="Use current location"
                    >
                        {isLoadingLocation ? (
                            <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-orange-500 rounded-full"></div>
                        ) : (
                            <Navigation className="w-5 h-5" />
                        )}
                    </button>

                    {/* Input Field */}
                    <div className="relative">
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            placeholder="Enter delivery address"
                            aria-label="Enter delivery address"
                            className="w-full py-4 pl-12 pr-14 rounded-full text-black outline-none shadow-lg focus:ring-2 focus:ring-orange-300 transition-all"
                            onFocus={() => address && setShowSuggestions(true)}
                        />

                        {/* Clear button */}
                        {address && (
                            <button
                                type="button"
                                onClick={() => {
                                    setAddress('');
                                    setShowSuggestions(false);
                                }}
                                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        {/* Search Button */}
                        <button
                            type="submit"
                            disabled={!address.trim() || isSavingAddress}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                            title="Find restaurants"
                        >
                            {isSavingAddress ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            ) : (
                                <Search className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>

                    {/* Address Suggestions Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                            {/* Saved Addresses for authenticated users */}
                            {isAuthenticated && savedAddresses.length > 0 && (
                                <div className="p-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-2">
                                        <Clock className="w-4 h-4" />
                                        Saved addresses
                                    </div>
                                    {savedAddresses.slice(0, 3).map((savedAddr) => (
                                        <button
                                            key={savedAddr.id}
                                            type="button"
                                            onClick={() => {
                                                setAddress(savedAddr.street);
                                                setDeliveryAddress(savedAddr);
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                        >
                                            <div className="font-medium">{savedAddr.label}</div>
                                            <div className="text-sm text-gray-500">{savedAddr.street}</div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Popular Areas */}
                            <div className="p-3">
                                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Popular areas
                                </div>
                                {addressSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => selectSuggestion(suggestion)}
                                        className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </form>

                {/* Error Message */}
                {locationError && (
                    <div className="w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span className="text-sm">{locationError}</span>
                        </div>
                    </div>
                )}

                {/* Sign-in for saved address */}
                <button
                    type="button"
                    onClick={handleSignInClick}
                    data-aos="fadeInUp"
                    className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                    <span>🔑</span>
                    Sign in for saved addresses
                </button>

                {/* Additional Info */}
                <div className="text-center text-white/70 text-sm space-y-1">
                    <p>Free delivery on orders over $25</p>
                    <p>Estimated delivery: 25-35 minutes</p>
                </div>
            </div>
        </div>
    );
};

export default Hero;
