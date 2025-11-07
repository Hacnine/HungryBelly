import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DeliveryAddressContext = createContext();

export const useDeliveryAddress = () => {
  const context = useContext(DeliveryAddressContext);
  if (!context) {
    throw new Error('useDeliveryAddress must be used within a DeliveryAddressProvider');
  }
  return context;
};

export const DeliveryAddressProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentAddress, setCurrentAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Load saved addresses when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSavedAddresses();
    } else {
      setSavedAddresses([]);
      setCurrentAddress(null);
    }
  }, [isAuthenticated, user]);

  const loadSavedAddresses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/addresses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const addresses = await response.json();
        setSavedAddresses(addresses);

        // Set default address as current if no current address is set
        if (!currentAddress) {
          const defaultAddress = addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setCurrentAddress(defaultAddress);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load saved addresses:', error);
    }
  };

  const setDeliveryAddress = (address) => {
    setCurrentAddress(address);
    // Store in localStorage for persistence
    localStorage.setItem('currentDeliveryAddress', JSON.stringify(address));
  };

  const clearDeliveryAddress = () => {
    setCurrentAddress(null);
    localStorage.removeItem('currentDeliveryAddress');
  };

  const saveAddress = async (addressData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        const newAddress = await response.json();
        setSavedAddresses(prev => [...prev, newAddress]);
        return newAddress;
      } else {
        throw new Error('Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        const updatedAddress = await response.json();
        setSavedAddresses(prev =>
          prev.map(addr => addr.id === addressId ? updatedAddress : addr)
        );

        // Update current address if it was the one updated
        if (currentAddress?.id === addressId) {
          setCurrentAddress(updatedAddress);
        }

        return updatedAddress;
      } else {
        throw new Error('Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));

        // Clear current address if it was the one deleted
        if (currentAddress?.id === addressId) {
          clearDeliveryAddress();
        }
      } else {
        throw new Error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  };

  const value = {
    currentAddress,
    savedAddresses,
    setDeliveryAddress,
    clearDeliveryAddress,
    saveAddress,
    updateAddress,
    deleteAddress,
    loadSavedAddresses,
  };

  return (
    <DeliveryAddressContext.Provider value={value}>
      {children}
    </DeliveryAddressContext.Provider>
  );
};