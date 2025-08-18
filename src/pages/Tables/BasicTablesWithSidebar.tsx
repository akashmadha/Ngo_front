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
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import React, { useState, useEffect } from "react";

interface Member {
  id: number;
  registration?: {
    organizationName?: string;
    registrationType?: string;
    panNo?: string;
    email?: string;
    mobile?: string;
    spocName?: string;
    status?: string;
    createdAt?: string;
  };
  certification?: any;
  address?: any;
  form4?: any;
  form5?: any;
  form6?: any;
}

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'user-registration',
    name: 'User Registration Details',
    icon: <UserIcon className="w-5 h-5" />,
    description: 'Manage user account and registration information'
  },
  {
    id: 'organization',
    name: 'Organization Details',
    icon: <BuildingOfficeIcon className="w-5 h-5" />,
    description: 'Organization registration and business information'
  },
  {
    id: 'certification',
    name: 'Certification Details',
    icon: <DocumentCheckIcon className="w-5 h-5" />,
    description: 'Certificates, licenses and compliance documents'
  },
  {
    id: 'address',
    name: 'Registered Office Address',
    icon: <MapPinIcon className="w-5 h-5" />,
    description: 'Official registered office location details'
  },
  {
    id: 'communication',
    name: 'Communication Details',
    icon: <PhoneIcon className="w-5 h-5" />,
    description: 'Contact information and communication preferences'
  },
  {
    id: 'contact-person',
    name: 'Key Contact Person',
    icon: <UserGroupIcon className="w-5 h-5" />,
    description: 'Primary contact person and representative details'
  }
];

export default function BasicTablesWithSidebar() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeSection, setActiveSection] = useState('user-registration');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      setFormData({
        name: selectedMember.registration?.spocName || '',
        username: selectedMember.registration?.email?.split('@')[0] || '',
        email: selectedMember.registration?.email || '',
        phone: selectedMember.registration?.mobile || '',
        status: selectedMember.registration?.status || 'active',
        organizationName: selectedMember.registration?.organizationName || '',
        registrationNumber: selectedMember.registration?.registrationType || '',
        registrationType: selectedMember.registration?.registrationType || '',
        establishmentDate: selectedMember.registration?.createdAt || '',
        panNo: selectedMember.registration?.panNo || '',
      });
    }
  }, [selectedMember]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not found. Please log in again.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/om-members-full-details`, {
        headers: {
          'user-id': userId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      console.log('API Response:', data);
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

  const handleSave = async () => {
    try {
      showNotification('success', 'Changes saved successfully!');
      setIsEditing(false);
    } catch (err) {
      showNotification('error', 'Failed to save changes. Please try again.');
    }
  };

  const handleDelete = async (memberId: number) => {
    try {
      showNotification('success', 'Member deleted successfully!');
      fetchMembers();
    } catch (err) {
      showNotification('error', 'Failed to delete member. Please try again.');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchTerm || 
      member.registration?.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.registration?.panNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.registration?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toString().includes(searchTerm);
    
    return matchesSearch;
  });

  const getActiveNavItem = () => {
    return navigationItems.find(item => item.id === activeSection) || navigationItems[0];
  };

  const renderFormSection = () => {
    const activeItem = getActiveNavItem();
    
    switch (activeSection) {
      case 'user-registration':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 'organization':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                <input
                  type="text"
                  value={formData.organizationName || ''}
                  onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNumber || ''}
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Type</label>
                <select
                  value={formData.registrationType || ''}
                  onChange={(e) => setFormData({...formData, registrationType: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="">Select Type</option>
                  <option value="trust">Trust</option>
                  <option value="society">Society</option>
                  <option value="company">Company</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                <input
                  type="text"
                  value={formData.panNo || ''}
                  onChange={(e) => setFormData({...formData, panNo: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4 flex justify-center">
              {activeItem.icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{activeItem.name}</h3>
            <p className="text-gray-500">{activeItem.description}</p>
            <p className="text-sm text-gray-400 mt-4">Form fields will be implemented here</p>
          </div>
        );
    }
  };

  return (
    <>
      <PageMeta title="Admin Dashboard - Member Management" />
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5 mr-2" />}
            {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5 mr-2" />}
            {notification.type === 'info' && <InformationCircleIcon className="w-5 h-5 mr-2" />}
            {notification.message}
          </div>
        </div>
      )}

      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <HomeIcon className="w-4 h-4" />
                <ChevronRightIcon className="w-4 h-4" />
                <span>Dashboard</span>
                <ChevronRightIcon className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{getActiveNavItem().name}</span>
              </div>

              {/* Search */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto">
              {/* Member Selection */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Select Member</h3>
                </div>
                <div className="p-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading members...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <p className="text-red-600">{error}</p>
                      <button
                        onClick={fetchMembers}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedMember(member)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedMember?.id === member.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <h4 className="font-medium text-gray-900">
                            {member.registration?.organizationName || 'Unknown Organization'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {member.registration?.email || 'No email'}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              member.registration?.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : member.registration?.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {member.registration?.status || 'Unknown'}
                            </span>
                            <span className="text-xs text-gray-400">ID: {member.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Section */}
              {selectedMember && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{getActiveNavItem().name}</h3>
                      <p className="text-sm text-gray-500">{getActiveNavItem().description}</p>
                    </div>
                    <div className="flex space-x-2">
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <PencilIcon className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Save
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(selectedMember.id)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {renderFormSection()}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
