"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { fetchOrderDetail } from "../store/orderSlice"
import LiveOrderTracking from "../components/LiveOrderTracking"

export default function OrderTrackingPage() {
  const { orderIdentifier } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedOrder, loading } = useSelector((state) => state.order)

  useEffect(() => {
    if (orderIdentifier) {
      dispatch(fetchOrderDetail(orderIdentifier))
    }
  }, [orderIdentifier, dispatch])

  if (loading && !selectedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center animate__animated animate__fadeIn">
        <div className="text-gray-500">Loading order...</div>
      </div>
    )
  }

  if (!selectedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center animate__animated animate__fadeIn">
        <div className="text-center animate__animated animate__zoomIn">
          <p className="text-gray-500 mb-4">Order not found</p>
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 animate__animated animate__fadeIn">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate("/")} className="text-blue-600 hover:underline mb-6 animate__animated animate__fadeInLeft">
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 animate__animated animate__fadeInUp">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 animate__animated animate__bounceIn">Order Tracking</h1>
            <p className="text-gray-600">ID: {selectedOrder.id}</p>
          </div>

          <div className="animate__animated animate__slideInUp"><LiveOrderTracking orderId={orderId} initialOrder={selectedOrder} /></div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 animate__animated animate__fadeInUp">
            <div className="animate__animated animate__slideInLeft">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="animate__animated animate__slideInRight">
              <h2 className="text-xl font-bold mb-4">Status Timeline</h2>
              <div className="space-y-2">
                {selectedOrder.steps && Array.isArray(selectedOrder.steps) ? (
                  selectedOrder.steps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="font-medium capitalize text-blue-900">{step.step.replace(/_/g, " ")}</p>
                      <p className="text-sm text-blue-700">{new Date(step.timestamp).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No status updates yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
