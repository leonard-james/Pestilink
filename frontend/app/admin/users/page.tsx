"use client";

import { useState, useEffect } from 'react';
import { FiUsers, FiUserPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import DashboardSidebar from "../../components/DashboardSidebar";

interface User {
  id: number;
  name: string;
  email: string;
  role: 'farmer' | 'company' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt?: string;
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'date-asc' | 'date-desc'>('name-asc');
  const [filters, setFilters] = useState({
    status: '' as '' | 'active' | 'inactive' | 'suspended',
    role: '' as '' | 'farmer' | 'company' | 'admin',
    lastLogin: '' as '' | 'today' | 'week' | 'month'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getApiBase = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return base.replace(/\/?$/, '');
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${getApiBase()}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle different response formats
        const usersData = Array.isArray(data) ? data : 
                         (data?.data && Array.isArray(data.data) ? data.data : []);
        
        // Transform backend data to match our interface
        const transformedUsers = usersData.map((user: any) => ({
          id: user.id,
          name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
          email: user.email,
          role: (user.role || 'farmer').toLowerCase() as 'farmer' | 'company' | 'admin',
          status: (user.status || 'active').toLowerCase() as 'active' | 'inactive' | 'suspended',
          lastLogin: user.last_login || user.lastLogin || user.updated_at || user.created_at || new Date().toISOString(),
          createdAt: user.created_at || user.createdAt
        }));
        
        setUsers(transformedUsers);
      } else {
        console.error('Failed to fetch users:', response.status, response.statusText);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };


  // Apply filters
  let filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = !filters.status || user.status === filters.status;
    
    // Role filter
    const matchesRole = !filters.role || user.role === filters.role;
    
    // Alphabetical filter (removed)
    
    // Last login filter
    const matchesLastLogin = (() => {
      if (!filters.lastLogin) return true;
      
      const now = new Date();
      const lastLogin = new Date(user.lastLogin);
      const diffTime = now.getTime() - lastLogin.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (filters.lastLogin) {
        case 'today': return diffDays === 0;
        case 'week': return diffDays <= 7;
        case 'month': return diffDays <= 30;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesRole && matchesLastLogin;
  });

  // Apply sorting
  filteredUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'date-asc':
        return new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime();
      case 'date-desc':
        return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      default:
        return 0;
    }
  });

  // Use all filtered users for the scrollable list
  const currentUsers = filteredUsers;

  const handleAddUser = () => {
    setEditingUser({
      id: 0, // 0 indicates a new user
      name: '',
      email: '',
      role: 'farmer',
      status: 'active',
      lastLogin: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleEdit = (userId: number) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setEditingUser({ ...userToEdit });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${getApiBase()}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        alert('User deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.message || 'Failed to delete user. Please try again.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete user. Please try again.'}`);
    }
  };

  const handleStatusChange = async (userId: number, newStatus: User['status']) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${getApiBase()}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
      } else {
        alert('Failed to update user status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('An error occurred while updating the user status.');
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Validate form
    if (!editingUser.name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (!editingUser.email.trim() || !validateEmail(editingUser.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Check for duplicate email (except for the current user being edited)
    const emailExists = users.some(
      user => user.email.toLowerCase() === editingUser.email.toLowerCase() && 
             user.id !== editingUser.id
    );

    if (emailExists) {
      alert('A user with this email already exists');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      if (editingUser.id === 0) {
        // Add new user
        const response = await fetch(`${getApiBase()}/api/admin/users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
            status: editingUser.status,
          }),
        });
        
        if (response.ok) {
          const newUser = await response.json();
          setUsers(prevUsers => [...prevUsers, {
            ...newUser,
            lastLogin: newUser.last_login || newUser.lastLogin || new Date().toISOString(),
            createdAt: newUser.created_at || newUser.createdAt || new Date().toISOString()
          }]);
          alert('User added successfully!');
        } else {
          alert('Failed to add user. Please try again.');
          return;
        }
      } else {
        // Update existing user
        const response = await fetch(`${getApiBase()}/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
            status: editingUser.status,
          }),
        });
        
        if (response.ok) {
          setUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === editingUser.id ? { 
                ...user, 
                ...editingUser,
                // Preserve the original creation date
                createdAt: user.createdAt || new Date().toISOString()
              } : user
            )
          );
          alert('User updated successfully!');
        } else {
          alert('Failed to update user. Please try again.');
          return;
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('An error occurred while saving the user.');
      return;
    }
    
    // Close modal and reset form
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingUser) return;
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle different input types
    const newValue = type === 'number' ? Number(value) : value;
    
    setEditingUser({
      ...editingUser,
      [name]: newValue
    });
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <DashboardSidebar role="admin" />
      
      <main className="relative z-10 flex-1 ml-20 peer-hover:ml-64 transition-all duration-300">
        <div className="relative min-h-screen">
          {/* Background image */}
          <Image
            src="/farm pic.jpg"
            alt="Admin Dashboard Background"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* Content */}
          <div className="absolute inset-0 w-full px-4 py-8 overflow-auto">
            <div className="w-full max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold flex items-center">
                    <FiUsers className="mr-3" />
                    User Management
                  </h1>
                  <p className="text-gray-400 mt-1">Manage farmers, companies, and admin users</p>
                </div>
                <button 
                  onClick={handleAddUser}
                  className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <FiUserPlus className="mr-2" />
                  Add New User
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
                      placeholder="Search users..."
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
                
                {/* Filter Options - Shown in one line when filter button is clicked */}
                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                      {/* Role Filter */}
                      <div className="w-full sm:w-auto">
                        <label className="block text-xs font-medium text-gray-400 mb-1">User Type</label>
                        <select
                          name="role"
                          value={filters.role}
                          onChange={handleFilterChange}
                          className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All Types</option>
                          <option value="farmer">Farmers</option>
                          <option value="company">Companies</option>
                          <option value="admin">Admins</option>
                        </select>
                      </div>
                      
                      {/* Status Filter */}
                      <div className="w-full sm:w-auto">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                        <select
                          name="status"
                          value={filters.status}
                          onChange={handleFilterChange}
                          className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      
                      {/* Last Login Filter */}
                      <div className="w-full sm:w-auto">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Last Login</label>
                        <select
                          name="lastLogin"
                          value={filters.lastLogin}
                          onChange={handleFilterChange}
                          className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Any Time</option>
                          <option value="today">Today</option>
                          <option value="week">Last 7 Days</option>
                          <option value="month">Last 30 Days</option>
                        </select>
                      </div>
                      
                      {/* Sort By */}
                      <div className="w-full sm:w-auto">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={handleSortChange}
                          className="w-full bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="name-asc">Name (A-Z)</option>
                          <option value="name-desc">Name (Z-A)</option>
                          <option value="date-desc">Newest First</option>
                        </select>
                      </div>
                      
                    </div>
                  </div>
                )}
              </div>

              {/* User List */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center h-64 p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : currentUsers.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-300">No users found</h3>
                    <p className="mt-1 text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div className="max-h-[70vh] overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-700/50">
                        <thead className="bg-gray-800/70 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700/50">
                          <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Last Login</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                          {currentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-700/20 transition-colors">
                              <td className="px-6 py-4 font-medium whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold mr-3">
                                    {user.name.charAt(0)}
                                  </div>
                                  {user.name}
                                </div>
                              </td>
                              <td className="px-6 py-4">{user.email}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                  user.role === 'farmer' ? 'bg-green-900/50 text-green-300' :
                                  user.role === 'company' ? 'bg-blue-900/50 text-blue-300' :
                                  'bg-purple-900/50 text-purple-300'
                                }`}>
                                  {user.role === 'farmer' ? 'Farmer' : 
                                   user.role === 'company' ? 'Company' : 'Admin'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                  user.status === 'active' ? 'bg-green-900/50 text-green-300' :
                                  user.status === 'inactive' ? 'bg-yellow-900/50 text-yellow-300' :
                                  'bg-red-900/50 text-red-300'
                                }`}>
                                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4">{user.lastLogin}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleEdit(user.id)}
                                    className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                                    title="Edit user"
                                  >
                                    <FiEdit2 />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                    title="Delete user"
                                  >
                                    <FiTrash2 />
                                  </button>
                                  <select
                                    value={user.status}
                                    onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                                    className="bg-gray-700/50 border border-gray-600/50 text-white text-xs rounded-lg px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className="px-6 py-3 text-sm text-gray-400 bg-gray-800/30 border-t border-gray-700/50">
                  Total: <span className="font-medium text-white">{filteredUsers.length}</span> users
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Modal */}
        {isModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingUser.id === 0 ? 'Add New User' : 'Edit User'}
                </h2>
                <form onSubmit={handleSaveUser}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editingUser.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editingUser.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                      <select
                        name="role"
                        value={editingUser.role}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        required
                      >
                        <option value="farmer">Farmer</option>
                        <option value="company">Company</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                      <select
                        name="status"
                        value={editingUser.status}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingUser(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      {editingUser.id === 0 ? 'Add User' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
