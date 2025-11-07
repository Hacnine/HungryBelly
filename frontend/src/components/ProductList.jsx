import { useState } from "react";
import { useGetFoodItemsQuery, useUpdateFoodItemMutation } from "../store/foodItemsApi";
import ProductDetailModal from "./ProductDetailModal";
import { Search, Filter, Loader, Eye, EyeOff, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function ProductList() {
  const { data: foodItems, isLoading, error } = useGetFoodItemsQuery();
  const [updateFoodItem] = useUpdateFoodItemMutation();
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-2">Error loading products</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      await updateFoodItem({
        id: productId,
        isActive: !currentStatus
      }).unwrap();
    } catch (error) {
      console.error("Failed to update product status:", error);
    }
  };

  // Get unique categories
  const categories = ["All", ...new Set(foodItems?.map((item) => item.category) || [])];

  // Filter products
  const filteredProducts = foodItems?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" ||
                         (selectedStatus === "Active" && item.isActive) ||
                         (selectedStatus === "Inactive" && !item.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-gray-600 text-lg">Discover delicious food prepared with love</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 -xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 -xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Eye className="text-gray-400 w-5 h-5" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 -xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const finalPrice = product.discount > 0
              ? (product.price * (1 - product.discount / 100)).toFixed(2)
              : product.price.toFixed(2);

            return (
              <div
                key={product.id}
                className={`bg-white -xl shadow-md overflow-hidden transform transition group hover:cursor-pointer hover:scale-105 hover:shadow-xl relative ${
                  !product.isActive ? 'opacity-60' : ''
                }`}
                onClick={() => handleProductClick(product)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 -full text-xs font-semibold">
                      {product.discount}% OFF
                    </div>
                  )}
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold">Out of Stock</span>
                    </div>
                  )}
                  {/* Active/Inactive Status */}
                  <div className={`absolute top-2 left-2 px-2 py-1 -full text-xs font-semibold ${
                    product.isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-lg font-semibold line-clamp-1 ${
                      product.isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {product.name}
                    </h3>
                    {/* Admin Toggle Button */}
                    {user?.role === 'admin' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(product.id, product.isActive);
                        }}
                        className={`p-1 -full transition ${
                          product.isActive
                            ? 'text-green-600 hover:bg-green-100'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={product.isActive ? 'Deactivate product' : 'Activate product'}
                      >
                        {product.isActive ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                    )}
                  </div>

                  <p className={`text-sm mb-3 line-clamp-2 ${
                    product.isActive ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 -full">
                      {product.category}
                    </span>
                    {product.preparationTime && (
                      <span className="text-xs text-gray-500">
                        ⏱️ {product.preparationTime} min
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-purple-100 text-purple-600 -full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    {product.discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${
                          product.isActive ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          ${finalPrice}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className={`text-xl font-bold ${
                        product.isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        ${finalPrice}
                      </span>
                    )}
                  </div>

                  {/* Click to view details */}
                  <div className="mt-3 text-center">
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium underline"
                    >
                      View Details
                    </button> */}
                  </div>
                </div>

                {/* Hover overlay sliding from bottom */}
                <div className="absolute -bottom-1 left-0 right-0 bg-customred flex items-center justify-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out h-[25%] flex-col">
                  <span className='font-bebus text-yellow-500'>$ {finalPrice}</span>
                  <span className="text-white font-bebus text-sm tracking-wider border-2 px-2 py-1">View Details</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default ProductList;