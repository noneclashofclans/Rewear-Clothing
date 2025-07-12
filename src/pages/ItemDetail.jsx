import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch item details from API
    // For now, using mock data
    const mockItem = {
      id: parseInt(id),
      name: 'Blue Jeans',
      category: 'Pants',
      condition: 'Good',
      price: 25,
      description: 'A comfortable pair of blue jeans in good condition. Perfect for casual wear.',
      image: 'https://via.placeholder.com/400x500',
      seller: 'John Doe',
      location: 'New York, NY',
      listedDate: '2024-01-15'
    };

    setTimeout(() => {
      setItem(mockItem);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Browse Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                className="w-full h-96 object-cover"
                src={item.image}
                alt={item.name}
              />
            </div>
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
                <p className="text-2xl font-semibold text-indigo-600">${item.price}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <span className="ml-2 text-gray-900">{item.category}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Condition:</span>
                  <span className="ml-2 text-gray-900">{item.condition}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Seller:</span>
                  <span className="ml-2 text-gray-900">{item.seller}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <span className="ml-2 text-gray-900">{item.location}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Listed:</span>
                  <span className="ml-2 text-gray-900">{item.listedDate}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Contact Seller
                </button>
                <button className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate('/browse')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Browse
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail; 