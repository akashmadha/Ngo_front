import PageMeta from "../../components/common/PageMeta";
import { 
  UserGroupIcon, 
  BuildingOfficeIcon,
  DocumentCheckIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  FunnelIcon,
  ChevronLeftIcon,
  EyeIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import React, { useState, useEffect } from "react";


interface Member {
  id: number;
  'Organization Details'?: {
    organizationName?: string;
    registrationType?: string;
    registrationNo?: string;
    registrationDate?: string;
    panNo?: string;
    email?: string;
    mobile?: string;
    spocName?: string;
    status?: string;
    createdAt?: string;
  };
  'User Registration Details'?: any;
  'Certification Details'?: any;
  'Registered Office Address'?: any;
  'Communication Details'?: any;
  'Key Contact Person'?: any;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export default function BasicTables() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'desc' });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [registrationTypeFilter, setRegistrationTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not found. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:3001/api/admin/om-members-full-details', {
        headers: {
          'user-id': userId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      setMembers(data || []);
    } catch (err) {
      setError('Failed to load members. Please try again.');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusUpdate = async (memberId: number, newStatus: string) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showNotification('error', 'User not found. Please log in again.');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/admin/member/${memberId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        showNotification('success', `Member status updated to ${newStatus}!`);
        fetchMembers();
      } else {
        showNotification('error', result.error || 'Failed to update status.');
      }
    } catch (err) {
      showNotification('error', 'Failed to update status.');
      console.error('Error updating status:', err);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedData = () => {
    const sorted = [...members].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'organizationName':
          aValue = a['Organization Details']?.organizationName || a['User Registration Details']?.organizationName || '';
          bValue = b['Organization Details']?.organizationName || b['User Registration Details']?.organizationName || '';
          break;
        case 'spocName':
          aValue = a['Organization Details']?.spocName || a['User Registration Details']?.spocName || '';
          bValue = b['Organization Details']?.spocName || b['User Registration Details']?.spocName || '';
          break;
        case 'email':
          aValue = a['Organization Details']?.email || a['User Registration Details']?.email || '';
          bValue = b['Organization Details']?.email || b['User Registration Details']?.email || '';
          break;
        case 'status':
          aValue = a['Organization Details']?.status || a['User Registration Details']?.status || '';
          bValue = b['Organization Details']?.status || b['User Registration Details']?.status || '';
          break;
        case 'createdAt':
          aValue = a['Organization Details']?.createdAt || a['User Registration Details']?.createdAt || '';
          bValue = b['Organization Details']?.createdAt || b['User Registration Details']?.createdAt || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const getFilteredData = () => {
    const sortedData = getSortedData();
    
    return sortedData.filter(member => {
      const orgDetails = member['Organization Details'] || {};
      const userDetails = member['User Registration Details'] || {};
      
      const matchesSearch = !searchTerm || 
        (orgDetails.organizationName || userDetails.organizationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (orgDetails.panNo || userDetails.panNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (orgDetails.email || userDetails.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (orgDetails.spocName || userDetails.spocName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || 
        (orgDetails.status || userDetails.status || 'active').toLowerCase() === statusFilter.toLowerCase();
      
      const matchesRegistrationType = registrationTypeFilter === 'all' || 
        (orgDetails.registrationType || userDetails.registrationType || '').toLowerCase() === registrationTypeFilter.toLowerCase();
      
      const matchesDateRange = (() => {
        const createdAt = orgDetails.createdAt || userDetails.createdAt;
        if (!createdAt) return true;
        
        // If no date filters are set, return true
        if (!fromDate && !toDate) return true;
        
        const createdDate = new Date(createdAt);
        createdDate.setHours(0, 0, 0, 0); // Set to start of day
        
        // If only from date is set
        if (fromDate && !toDate) {
          const fromDateObj = new Date(fromDate);
          fromDateObj.setHours(0, 0, 0, 0);
          return createdDate >= fromDateObj;
        }
        
        // If only to date is set
        if (!fromDate && toDate) {
          const toDateObj = new Date(toDate);
          toDateObj.setHours(23, 59, 59, 999); // Set to end of day
          return createdDate <= toDateObj;
        }
        
        // If both dates are set
        if (fromDate && toDate) {
          const fromDateObj = new Date(fromDate);
          const toDateObj = new Date(toDate);
          fromDateObj.setHours(0, 0, 0, 0);
          toDateObj.setHours(23, 59, 59, 999);
          return createdDate >= fromDateObj && createdDate <= toDateObj;
        }
        
        return true;
      })();
      
      return matchesSearch && matchesStatus && matchesRegistrationType && matchesDateRange;
    });
  };

  const filteredMembers = getFilteredData();
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active':
        return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-200 shadow-sm">Active</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200 shadow-sm">Pending</span>;
      case 'inactive':
        return <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full border border-red-200 shadow-sm">Inactive</span>;
      case 'suspended':
        return <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full border border-gray-200 shadow-sm">Suspended</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full border border-gray-200 shadow-sm">Unknown</span>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleRowSelect = (memberId: number) => {
    setSelectedRows(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedMembers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedMembers.map(m => m.id));
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedRows.length === 0) {
      showNotification('info', 'Please select members to update.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showNotification('error', 'User not found. Please log in again.');
        return;
      }

      // Update each selected member
      for (const memberId of selectedRows) {
        await fetch(`http://localhost:3001/api/admin/member/${memberId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'user-id': userId
          },
          body: JSON.stringify({ status: newStatus })
        });
      }

      showNotification('success', `Updated status for ${selectedRows.length} members to ${newStatus}!`);
      setSelectedRows([]);
      fetchMembers();
    } catch (err) {
      showNotification('error', 'Failed to update member statuses.');
      console.error('Error updating member statuses:', err);
    }
  };

  const handleViewMember = (member: Member) => {
    window.location.href = `/member-details/${member.id}?mode=view`;
  };

  const handleEditMember = (member: Member) => {
    window.location.href = `/member-details/${member.id}?mode=edit`;
  };

  const handleUpdateMember = async (memberId: number, updatedData: any) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not found');
      }

      const response = await fetch(`http://localhost:3001/api/admin/member/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update member');
      }

      // Refresh the members list
      await fetchMembers();
      showNotification('success', 'Member updated successfully');
    } catch (error) {
      console.error('Error updating member:', error);
      showNotification('error', 'Failed to update member');
      throw error;
    }
  };

  return (
    <>
      <PageMeta
        title="OM Members Management | Admin Dashboard"
        description="Professional member management interface for administrators."
      />
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
            {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5" />}
            {notification.type === 'info' && <InformationCircleIcon className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  OM Members Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Professional member management and administration
                </p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{members.length}</p>
                  </div>
                  <UserGroupIcon className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
                    <p className="text-2xl font-bold text-green-600">
                      {members.filter(m => (m['Organization Details']?.status || m['User Registration Details']?.status || 'unknown').toLowerCase() === 'active').length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Members</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {members.filter(m => (m['Organization Details']?.status || m['User Registration Details']?.status || 'unknown').toLowerCase() === 'pending').length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Inactive Members</p>
                    <p className="text-2xl font-bold text-red-600">
                      {members.filter(m => (m['Organization Details']?.status || m['User Registration Details']?.status || 'unknown').toLowerCase() === 'inactive').length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                      placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                  <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                  </select>
                    
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-3 py-2 border rounded-lg transition-colors ${
                        statusFilter !== 'all' || registrationTypeFilter !== 'all' || fromDate || toDate
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      title="Advanced Filters"
                    >
                      <FunnelIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
              
                {/* Bulk Actions */}
                {selectedRows.length > 0 && (
              <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedRows.length} selected
                    </span>
                <select
                      onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Bulk Actions</option>
                      <option value="active">Set Active</option>
                      <option value="pending">Set Pending</option>
                      <option value="inactive">Set Inactive</option>
                      <option value="suspended">Set Suspended</option>
                </select>
                  </div>
                )}
              </div>
            </div>
            
            {/* Filter Panel */}
            {showFilters && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Registration Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Registration Type
                    </label>
                    <select
                      value={registrationTypeFilter}
                      onChange={(e) => setRegistrationTypeFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    >
                      <option value="all">All Registration Types</option>
                      <option value="NGO">NGO</option>
                      <option value="Trust">Trust</option>
                      <option value="Society">Society</option>
                      <option value="Foundation">Foundation</option>
                    </select>
                  </div>
                  
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          From Date
                        </label>
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          To Date
                        </label>
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setRegistrationTypeFilter('all');
                      setFromDate('');
                      setToDate('');
                      setSortConfig({ key: 'id', direction: 'asc' });
                    }}
                    className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Table */}
            <div className="w-full">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading members...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-2">{error}</div>
                  <button 
                    onClick={fetchMembers}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900">
                      <tr>
                        <th className="px-3 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedRows.length === paginatedMembers.length && paginatedMembers.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-white text-white focus:ring-blue-300"
                          />
                        </th>
                        <th 
                          className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors"
                          onClick={() => handleSort('id')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>ID</span>
                            {sortConfig.key === 'id' && (
                              sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors"
                          onClick={() => handleSort('organizationName')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Organization</span>
                            {sortConfig.key === 'organizationName' && (
                              sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors"
                          onClick={() => handleSort('spocName')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>SPOC</span>
                            {sortConfig.key === 'spocName' && (
                              sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors"
                          onClick={() => handleSort('email')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Email</span>
                            {sortConfig.key === 'email' && (
                              sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            {sortConfig.key === 'status' && (
                              sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          <td className="px-3 py-3 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(member.id)}
                              onChange={() => handleRowSelect(member.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            #{member.id}
                          </td>
                          <td className="px-3 py-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                {member['Organization Details']?.organizationName || member['User Registration Details']?.organizationName || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {member['Organization Details']?.registrationType || member['User Registration Details']?.registrationType || 'NGO'}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            <div className="truncate max-w-32">
                              {member['Organization Details']?.spocName || member['User Registration Details']?.spocName || 'N/A'}
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            <div className="truncate max-w-40">
                              {member['Organization Details']?.email || member['User Registration Details']?.email || 'N/A'}
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {getStatusBadge(member['Organization Details']?.status || member['User Registration Details']?.status || 'unknown')}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewMember(member)}
                                className="inline-flex items-center justify-center w-6 h-6 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors duration-200 group"
                                title="View Details"
                              >
                                <EyeIcon className="w-3 h-3" />
                                <span className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8 ml-2 transition-opacity duration-200 whitespace-nowrap">
                                  View
                                </span>
                              </button>
                              <button 
                                onClick={() => handleEditMember(member)}
                                className="inline-flex items-center justify-center w-6 h-6 text-green-600 bg-green-100 rounded-full hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors duration-200 group"
                                title="Edit Member"
                              >
                                <PencilIcon className="w-3 h-3" />
                                <span className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8 ml-2 transition-opacity duration-200 whitespace-nowrap">
                                  Edit
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!loading && !error && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} results
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                          </span>
                    
                    <button 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>


    </>
  );
}
