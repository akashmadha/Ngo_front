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
  ChevronLeftIcon,
  EyeIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    otherRegistrationNo?: string;
    otherRegistrationDate?: string;
    tanNo?: string;
    gstNo?: string;
    nitiAyogId?: string;
    nitiAyogRegDate?: string;
  };
  'User Registration Details'?: any;
  'Certification Details'?: any;
  'Registered Office Address'?: any;
  'Communication Details'?: any;
  'Key Contact Person'?: any;
}

interface TabItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const tabItems: TabItem[] = [
  {
    id: 'overview',
    name: 'Overview',
    icon: <UserIcon className="w-5 h-5" />,
    description: 'Basic member information and summary'
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
    name: 'Address Information',
    icon: <MapPinIcon className="w-5 h-5" />,
    description: 'Registered office and communication addresses'
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

export default function MemberDetails() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (memberId) {
      fetchMemberDetails();
    }
  }, [memberId]);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not found. Please log in again.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/member-details/${memberId}`, {
        headers: {
          'user-id': userId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch member details');
      }

      const data = await response.json();
      if (data.success) {
        setMember(data.data);
      } else {
        setError(data.error || 'Failed to load member details');
      }
    } catch (err) {
      setError('Failed to load member details. Please try again.');
      console.error('Error fetching member details:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactive</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Suspended</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleBack = () => {
    navigate('/basic-tables');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Member not found</div>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  const orgDetails = member['Organization Details'] || {};
  const userDetails = member['User Registration Details'] || {};
  const certDetails = member['Certification Details'] || {};
  const addressDetails = member['Registered Office Address'] || {};
  const commDetails = member['Communication Details'] || {};
  const contactDetails = member['Key Contact Person'] || {};

  return (
    <>
      <PageMeta
        title={`Member Details - ${orgDetails.organizationName || 'N/A'} | Admin Dashboard`}
        description="Detailed member information and form data"
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
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Member Details
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Member ID: #{member.id} - {orgDetails.organizationName || 'N/A'}
                </p>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                {getStatusBadge(orgDetails.status || 'unknown')}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel Edit' : 'Edit Member'}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabItems.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Organization</h3>
                      <p className="text-gray-600 dark:text-gray-400">{orgDetails.organizationName || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{orgDetails.registrationType || 'NGO'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">SPOC</h3>
                      <p className="text-gray-600 dark:text-gray-400">{orgDetails.spocName || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Contact</h3>
                      <p className="text-gray-600 dark:text-gray-400">{orgDetails.email || 'N/A'}</p>
                      <p className="text-gray-600 dark:text-gray-400">{orgDetails.mobile || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">PAN Number</h3>
                      <p className="text-gray-600 dark:text-gray-400">{orgDetails.panNo || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Registration</h3>
                      <p className="text-gray-600 dark:text-gray-400">{orgDetails.registrationNo || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(orgDetails.registrationDate || '')}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Created</h3>
                      <p className="text-gray-600 dark:text-gray-400">{formatDate(orgDetails.createdAt || '')}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'organization' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Name</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.organizationName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Type</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.registrationType || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.registrationNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(orgDetails.registrationDate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Other Registration Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.otherRegistrationNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Other Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(orgDetails.otherRegistrationDate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PAN Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.panNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TAN Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.tanNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.gstNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NITI Aayog ID</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.nitiAyogId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NITI Aayog Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(orgDetails.nitiAyogRegDate || '')}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'certification' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">12A Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails.reg12A || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(certDetails.reg12ADate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">80G Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails.reg80G || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(certDetails.reg80GDate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">35AC Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails.reg35AC || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(certDetails.reg35ACDate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">FCRA Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails.regFCRA || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(certDetails.regFCRADate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CSR Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails.regCSR1 || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(certDetails.regCSR1Date || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GCSR Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails.regGCSR || 'N/A'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(certDetails.regGCSRDate || '')}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Line 1</label>
                      <p className="text-gray-900 dark:text-white">{addressDetails.address1 || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Line 2</label>
                      <p className="text-gray-900 dark:text-white">{addressDetails.address2 || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                      <p className="text-gray-900 dark:text-white">{addressDetails.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                      <p className="text-gray-900 dark:text-white">{addressDetails.state || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">District</label>
                      <p className="text-gray-900 dark:text-white">{addressDetails.district || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pincode</label>
                      <p className="text-gray-900 dark:text-white">{addressDetails.pincode || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'communication' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Email</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Phone</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails.mobile || 'N/A'}</p>
                    </div>
                    {commDetails.emails && commDetails.emails.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Emails</label>
                        <div className="space-y-1">
                          {commDetails.emails.map((email: any, index: number) => (
                            <p key={index} className="text-gray-900 dark:text-white">{email.email} ({email.type})</p>
                          ))}
                        </div>
                      </div>
                    )}
                    {commDetails.phones && commDetails.phones.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Phones</label>
                        <div className="space-y-1">
                          {commDetails.phones.map((phone: any, index: number) => (
                            <p key={index} className="text-gray-900 dark:text-white">{phone.number} ({phone.type})</p>
                          ))}
                        </div>
                      </div>
                    )}
                    {commDetails.socialLinks && commDetails.socialLinks.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Social Links</label>
                        <div className="space-y-1">
                          {commDetails.socialLinks.map((link: any, index: number) => (
                            <p key={index} className="text-gray-900 dark:text-white">{link.platform}: {link.url}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'contact-person' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Person Name</label>
                      <p className="text-gray-900 dark:text-white">{contactDetails.name || orgDetails.spocName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                      <p className="text-gray-900 dark:text-white">{contactDetails.mobile || orgDetails.mobile || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <p className="text-gray-900 dark:text-white">{contactDetails.email || orgDetails.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Designation</label>
                      <p className="text-gray-900 dark:text-white">{contactDetails.designation || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 