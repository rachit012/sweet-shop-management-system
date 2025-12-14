import { useState, useEffect } from 'react'
import api from '../services/api'
import SweetCard from '../components/SweetCard'

function AdminPanel() {
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSweet, setEditingSweet] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadSweets()
  }, [])

  const loadSweets = async () => {
    try {
      const response = await api.get('/sweets')
      setSweets(response.data)
    } catch (error) {
      console.error('Failed to load sweets:', error)
      setError('Failed to load sweets')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: ''
    })
    setEditingSweet(null)
    setShowAddForm(false)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      }

      if (editingSweet) {
        await api.put(`/sweets/${editingSweet._id}`, payload)
        setSuccess('Sweet updated successfully!')
      } else {
        await api.post('/sweets', payload)
        setSuccess('Sweet added successfully!')
      }

      resetForm()
      loadSweets()
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (sweet) => {
    setEditingSweet(sweet)
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString()
    })
    setShowAddForm(true)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return
    }

    try {
      await api.delete(`/sweets/${id}`)
      setSuccess('Sweet deleted successfully!')
      loadSweets()
    } catch (error) {
      setError(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleRestock = async (id, amount) => {
    try {
      await api.post(`/sweets/${id}/restock`, { amount: Number(amount) })
      setSuccess('Sweet restocked successfully!')
      loadSweets()
    } catch (error) {
      setError(error.response?.data?.message || 'Restock failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white text-lg">Manage your sweet shop inventory</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium"
              >
                + Add New Sweet
              </button>
            )}
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Sweet name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Quantity"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium"
                >
                  {editingSweet ? 'Update Sweet' : 'Add Sweet'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sweets List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Sweets</h2>
          {sweets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No sweets found. Add your first sweet!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sweets.map((sweet) => (
                <div key={sweet._id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
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
                          {sweet.quantity} in stock
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(sweet)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sweet._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Restock amount"
                          id={`restock-${sweet._id}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                        <button
                          onClick={() => {
                            const amount = document.getElementById(`restock-${sweet._id}`).value
                            if (amount) {
                              handleRestock(sweet._id, amount)
                              document.getElementById(`restock-${sweet._id}`).value = ''
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Restock
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel



