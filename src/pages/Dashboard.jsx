import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [userItems] = useState([
    {
      id: 1,
      name: 'Blue Jeans',
      category: 'Pants',
      condition: 'Good',
      price: 25,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'White T-Shirt',
      category: 'Shirts',
      condition: 'Excellent',
      price: 15,
      image: 'https://via.placeholder.com/150'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your clothing items</p>
        </div>

        <div className="mb-6">
          <Link
            to="/add-item"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Item
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {userItems.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4">
                <img
                  className="w-full h-48 object-cover rounded-md"
                  src={item.image}
                  alt={item.name}
                />
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-sm text-gray-500">Condition: {item.condition}</p>
                  <p className="text-lg font-semibold text-indigo-600">${item.price}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Link
                    to={`/item/${item.id}`}
                    className="flex-1 text-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View
                  </Link>
                  <button className="flex-1 px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {userItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first clothing item</p>
            <Link
              to="/add-item"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Your First Item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 