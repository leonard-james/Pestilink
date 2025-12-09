"use client";

import { useState } from 'react';
import { FiPackage, FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import DashboardSidebar from "../../components/DashboardSidebar";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
  image?: string;
}

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  const [filters, setFilters] = useState({
    category: '' as string,
    status: '' as '' | 'in_stock' | 'low_stock' | 'out_of_stock',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock data - replace with actual API call
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Organic Tomato Seeds', category: 'Seeds', price: 4.99, stock: 150, status: 'in_stock', lastUpdated: '2023-12-01' },
    { id: 2, name: 'Garden Trowel', category: 'Tools', price: 12.99, stock: 45, status: 'in_stock', lastUpdated: '2023-12-03' },
    { id: 3, name: 'Plant Food', category: 'Fertilizers', price: 8.99, stock: 3, status: 'low_stock', lastUpdated: '2023-11-28' },
    { id: 4, name: 'Watering Can', category: 'Tools', price: 15.99, stock: 0, status: 'out_of_stock', lastUpdated: '2023-11-30' },
    { id: 5, name: 'Potting Mix', category: 'Soil', price: 7.99, stock: 25, status: 'in_stock', lastUpdated: '2023-12-02' },
  ]);

  const productsPerPage = 5;

  // Apply filters
  let filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = !filters.category || product.category === filters.category;
    
    // Status filter
    const matchesStatus = !filters.status || product.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleAddProduct = () => {
    setEditingProduct({
      id: 0,
      name: '',
      category: '',
      price: 0,
      stock: 0,
      status: 'in_stock',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleStatusChange = (productId: number, newStatus: Product['status']) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: newStatus } : p
    ));  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Basic validation
    if (!editingProduct.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    if (editingProduct.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    if (editingProduct.stock < 0) {
      alert('Stock cannot be negative');
      return;
    }

    if (editingProduct.id === 0) {
      // Add new product
      const newProduct = {
        ...editingProduct,
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
      alert('Product added successfully!');
    } else {
      // Update existing product
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { 
          ...editingProduct,
          lastUpdated: new Date().toISOString().split('T')[0]
        } : p
      ));
      alert('Product updated successfully!');
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingProduct) return;
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle different input types
    const newValue = type === 'number' ? Number(value) : value;
    // Get numeric value for stock comparison
    const numericValue = type === 'number' ? Number(value) : 0;
    
    setEditingProduct({
      ...editingProduct,
      [name]: newValue,
      // Auto-update status based on stock
      ...(name === 'stock' ? { 
        status: numericValue === 0 ? 'out_of_stock' : 
                numericValue <= 5 ? 'low_stock' : 'in_stock' 
      } : {})
    });
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value || ''
    }));
    setCurrentPage(1);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
    setCurrentPage(1);
  };

  // Get unique categories for filter
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <DashboardSidebar role="admin" />
      <div 
        className="flex-1 relative ml-20 peer-hover:ml-64 transition-all duration-300"
        style={{
          backgroundImage: "url('/farm pic.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <main className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Product Management</h1>
              <p className="text-gray-400">Manage your product inventory</p>
            </div>
            <button 
              onClick={handleAddProduct}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FiPlus className="mr-2" />
              Add New Product
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700/50">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  Object.values(filters).some(f => f) 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-300 bg-gray-700/50 border border-gray-600/50 hover:bg-gray-600/50'
                }`}
              >
                <FiFilter className="mr-2" />
                {Object.values(filters).some(f => f) ? 'Filters Active' : 'Filter'}
              </button>
            </div>
            
            {/* Filter Options - Shown when filter button is clicked */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                  
                  {/* Sort By */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={handleSortChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Product</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Stock</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Last Updated</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product.id} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 font-medium whitespace-nowrap">
                          <div className="flex items-center">
                            {product.image ? (
                              <Image 
                                src={product.image} 
                                alt={product.name} 
                                width={40} 
                                height={40} 
                                className="w-10 h-10 rounded-md object-cover mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-gray-700 flex items-center justify-center mr-3">
                                <FiPackage className="text-gray-400" />
                              </div>
                            )}
                            {product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4">₱{product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">{product.stock}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === 'in_stock' ? 'bg-green-900/50 text-green-300' :
                            product.status === 'low_stock' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-red-900/50 text-red-300'
                          }`}>
                            {product.status === 'in_stock' ? 'In Stock' :
                             product.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{product.lastUpdated}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-900/30"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-900/30"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        No products found. Try adjusting your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastProduct, filteredProducts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredProducts.length}</span> products
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show page numbers with ellipsis
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingProduct?.id === 0 ? 'Add New Product' : 'Edit Product'}
              </h2>
              
              <form onSubmit={handleSaveProduct}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editingProduct.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={editingProduct.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                      list="categories"
                    />
                    <datalist id="categories">
                      {categories.map(category => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400">₱</span>
                        </div>
                        <input
                          type="number"
                          name="price"
                          step="0.01"
                          min="0"
                          value={editingProduct.price || ''}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg pl-8 p-2.5 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        value={editingProduct.stock}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editingProduct.status}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {editingProduct?.id === 0 ? 'Add Product' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
        </main>
      </div>
    </div>
  );
}
