import { useState } from "react";
import { X, Clock, Tag, Heart, ShoppingCart, ToggleLeft, ToggleRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useUpdateFoodItemMutation } from "../store/foodItemsApi";
import { useAuth } from "../context/AuthContext";

function ProductDetailModal({ product, isOpen, onClose }) {
  const dispatch = useDispatch();
  const [updateFoodItem] = useUpdateFoodItemMutation();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    onClose();
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleToggleActive = async () => {
    try {
      await updateFoodItem({
        id: product.id,
        isActive: !product.isActive
      }).unwrap();
    } catch (error) {
      console.error("Failed to update product status:", error);
    }
  };

  const finalPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image Section */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.discount}% OFF
              </div>
            )}
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.isActive
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{product.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Admin Toggle Button */}
              {user?.role === 'admin' && (
                <button
                  onClick={handleToggleActive}
                  className={`p-2 rounded-full transition ${
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
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full ${
                  isFavorite ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-400"
                } hover:scale-110 transition`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>            {/* Price */}
            <div className="mb-4">
              {product.discount > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-green-600">${finalPrice}</span>
                  <span className="text-xl text-gray-400 line-through">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">${finalPrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                  >
                    <Tag className="w-4 h-4" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Preparation Time */}
            <div className="flex items-center gap-2 mb-6 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>Preparation time: {product.preparationTime} minutes</span>
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                      <span className="text-gray-700">{ingredient.name}</span>
                      <span className="text-gray-500">{ingredient.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition */}
            {product.nutrition && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutritional Information</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded text-center">
                    <div className="font-semibold text-gray-900">{product.nutrition.calories}</div>
                    <div className="text-gray-600">Calories</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded text-center">
                    <div className="font-semibold text-gray-900">{product.nutrition.protein}</div>
                    <div className="text-gray-600">Protein</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded text-center">
                    <div className="font-semibold text-gray-900">{product.nutrition.carbs}</div>
                    <div className="text-gray-600">Carbs</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            {product.isAvailable && product.isActive ? (
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">({product.stock} available)</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart - ${(finalPrice * quantity).toFixed(2)}
                </button>
              </div>
            ) : (
              <div className="mt-auto">
                <div className="w-full py-4 bg-gray-300 text-gray-500 font-semibold rounded-xl flex items-center justify-center gap-2">
                  {product.isActive ? 'Out of Stock' : 'Product Inactive'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;