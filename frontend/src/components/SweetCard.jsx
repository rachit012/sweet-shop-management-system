import { useState } from 'react'
import api from '../services/api'

function SweetCard({ sweet, onPurchase, onUpdate, onDelete, isAdmin }) {
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')

  const handlePurchase = async () => {
    if (sweet.quantity === 0) return
    
    setPurchasing(true)
    setError('')
    
    try {
      await api.post(`/sweets/${sweet._id}/purchase`)
      onPurchase()
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed')
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{sweet.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{sweet.category}</p>
          </div>
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            ₹{sweet.price}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Quantity:</span>
            <span className={`text-sm font-semibold ${sweet.quantity === 0 ? 'text-red-600' : 'text-green-600'}`}>
              {sweet.quantity} {sweet.quantity === 0 ? '(Out of Stock)' : 'in stock'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          {!isAdmin && (
            <button
              onClick={handlePurchase}
              disabled={sweet.quantity === 0 || purchasing}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                sweet.quantity === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {purchasing ? 'Purchasing...' : 'Purchase'}
            </button>
          )}
          
          {isAdmin && (
            <>
              <button
                onClick={() => onUpdate(sweet)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(sweet._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SweetCard

