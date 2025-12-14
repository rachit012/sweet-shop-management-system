import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import SweetCard from '../components/SweetCard'

function Dashboard() {
  const { user } = useAuth()
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [filteredSweets, setFilteredSweets] = useState([])

  useEffect(() => {
    loadSweets()
  }, [])

  useEffect(() => {
    filterSweets()
  }, [sweets, searchTerm, searchCategory, minPrice, maxPrice])

  const loadSweets = async () => {
    try {
      const response = await api.get('/sweets')
      setSweets(response.data)
      setFilteredSweets(response.data)
    } catch (error) {
      console.error('Failed to load sweets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSweets = async () => {
    if (searchTerm || searchCategory || minPrice || maxPrice) {
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append('name', searchTerm)
        if (searchCategory) params.append('category', searchCategory)
        if (minPrice) params.append('minPrice', minPrice)
        if (maxPrice) params.append('maxPrice', maxPrice)
        
        const response = await api.get(`/sweets/search?${params.toString()}`)
        setFilteredSweets(response.data)
      } catch (error) {
        console.error('Search failed:', error)
        setFilteredSweets([])
      }
    } else {
      setFilteredSweets(sweets)
    }
  }

  const handlePurchase = () => {
    loadSweets()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    filterSweets()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSearchCategory('')
    setMinPrice('')
    setMaxPrice('')
    setFilteredSweets(sweets)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading sweets...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sweet Shop</h1>
          <p className="text-white text-lg">Browse and purchase your favorite sweets</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Sweet name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  placeholder="Category..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min price..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max price..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Sweets Grid */}
        {filteredSweets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">No sweets found. Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchase}
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

