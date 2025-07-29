import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  DocumentIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  FolderIcon,
  FlagIcon,
  StarIcon,
  EyeIcon,
  ChevronLeftIcon,
  PencilIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  GlobeAltIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import PageMeta from "../../components/common/PageMeta";

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
    membershipExpiryDate?: string;
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

export default function MemberDetailsView() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Define orgDetails early to avoid initialization errors
  const orgDetails = member?.['Organization Details'] || {};
  const userDetails = member?.['User Registration Details'] || {};
  const certDetails = member?.['Certification Details'] || {};
  const addressDetails = member?.['Registered Office Address'] || {};
  const commDetails = member?.['Communication Details'] || {};
  const contactDetails = member?.['Key Contact Person'] || {};

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

      console.log('Fetching member details for ID:', memberId);
      const url = `http://localhost:3001/api/admin/om-members-full-details`;
      console.log('Using URL:', url);

      const response = await fetch(url, {
        headers: {
          'user-id': userId
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch member details: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('All members data:', data);
      
      const foundMember = data.find((m: Member) => m.id === parseInt(memberId!));
      console.log('Found member:', foundMember);
      
      if (foundMember) {
        setMember(foundMember);
      } else {
        setError('Member not found');
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || 'unknown';
    const statusClasses = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      suspended: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[statusLower] || statusClasses.inactive}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!orgDetails?.membershipExpiryDate) return;

    const calculateTimeLeft = () => {
      const expiryDate = new Date(orgDetails.membershipExpiryDate);
      const now = new Date();
      const difference = expiryDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setIsExpired(false);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [orgDetails?.membershipExpiryDate]);

  const getMembershipStatus = () => {
    if (!orgDetails?.membershipExpiryDate) return { status: 'unknown', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300', text: 'No Expiry Date' };
    
    if (isExpired) {
      return { status: 'expired', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', text: 'Expired' };
    }
    
    if (timeLeft && timeLeft.days <= 30) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', text: 'Expiring Soon' };
    }
    
    return { status: 'active', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', text: 'Active' };
  };

  // Quick Actions Functions
  const handleViewDocuments = () => {
    showNotification('info', 'View Documents functionality will be implemented soon.');
  };

  const handleExportData = () => {
    if (!member) return;
    
    const data = {
      memberId: member.id,
      organizationName: member['Organization Details']?.organizationName,
      spocName: member['Organization Details']?.spocName,
      email: member['Organization Details']?.email,
      mobile: member['Organization Details']?.mobile,
      status: member['Organization Details']?.status,
      createdAt: member['Organization Details']?.createdAt,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `member-${member.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('success', 'Member data exported successfully!');
  };

  const handleShareDetails = () => {
    if (!member) return;
    
    const shareData = {
      title: `Member Details - ${member['Organization Details']?.organizationName}`,
      text: `Organization: ${member['Organization Details']?.organizationName}\nSPOC: ${member['Organization Details']?.spocName}\nEmail: ${member['Organization Details']?.email}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text);
      showNotification('success', 'Member details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'Member not found'}</p>
          <button
            onClick={() => navigate('/basic-tables')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Member Details - ${orgDetails?.organizationName || 'N/A'} | Admin Dashboard`}
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
                onClick={() => navigate('/basic-tables')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Member Details
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Member ID: #{member?.id || 'N/A'} - {orgDetails?.organizationName || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Signed up: {formatDate(orgDetails?.createdAt || '')}
                </p>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                {getStatusBadge(orgDetails?.status || 'unknown')}
                <button
                  onClick={() => navigate(`/member-details/${member?.id || ''}?mode=edit`)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Member
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
                <div className="space-y-8">
                  {/* Signup Details Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Signup Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">Signup Date</h4>
                        <p className="text-blue-700 dark:text-blue-400 font-semibold">{formatDate(orgDetails?.createdAt || '')}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-medium text-green-900 dark:text-green-300 mb-1">Member ID</h4>
                        <p className="text-green-700 dark:text-green-400 font-semibold">#{member?.id || 'N/A'}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-1">Status</h4>
                        <div className="mt-1">
                          {getStatusBadge(orgDetails?.status || 'unknown')}
                        </div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                        <h4 className="font-medium text-orange-900 dark:text-orange-300 mb-1">Registration Type</h4>
                        <p className="text-orange-700 dark:text-orange-400 font-semibold">{orgDetails?.registrationType || 'NGO'}</p>
                      </div>
                    </div>
                    
                    {/* Membership Status Section */}
                    {orgDetails?.membershipExpiryDate && (
                      <div className="mt-6">
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-red-900 dark:text-red-300 flex items-center">
                              <ClockIcon className="w-5 h-5 mr-2" />
                              Membership Status
                            </h4>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMembershipStatus().color}`}>
                              {getMembershipStatus().text}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <strong>Expiry Date:</strong> {formatDate(orgDetails.membershipExpiryDate)}
                              </p>
                              {isExpired ? (
                                <p className="text-red-600 dark:text-red-400 font-medium">
                                  ⚠️ Membership has expired
                                </p>
                              ) : timeLeft ? (
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>Time Remaining:</strong>
                                  </p>
                                  <div className="flex space-x-4">
                                    <div className="text-center">
                                      <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
                                        <div className="text-xl font-bold text-red-700 dark:text-red-300">{timeLeft.days}</div>
                                        <div className="text-xs text-red-600 dark:text-red-400">Days</div>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
                                        <div className="text-xl font-bold text-orange-700 dark:text-orange-300">{timeLeft.hours}</div>
                                        <div className="text-xs text-orange-600 dark:text-orange-400">Hours</div>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2">
                                        <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{timeLeft.minutes}</div>
                                        <div className="text-xs text-yellow-600 dark:text-yellow-400">Minutes</div>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
                                        <div className="text-xl font-bold text-green-700 dark:text-green-300">{timeLeft.seconds}</div>
                                        <div className="text-xs text-green-600 dark:text-green-400">Seconds</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-500">Loading countdown...</p>
                              )}
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Membership Info</h5>
                              <div className="space-y-2 text-sm">
                                <p><strong>Signup Date:</strong> {formatDate(orgDetails?.createdAt || '')}</p>
                                <p><strong>Duration:</strong> 365 days</p>
                                <p><strong>Auto-renewal:</strong> Manual</p>
                                {timeLeft && timeLeft.days <= 30 && !isExpired && (
                                  <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                                    ⚠️ Renewal due soon
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Organization Overview */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <BuildingOfficeIcon className="w-5 h-5 mr-2 text-green-600" />
                      Organization Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Organization Name</h4>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.organizationName || 'N/A'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{orgDetails?.registrationType || 'NGO'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">SPOC Contact</h4>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.spocName || 'N/A'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{orgDetails?.email || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Details</h4>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.email || 'N/A'}</p>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.mobile || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">PAN Number</h4>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.panNo || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Registration Number</h4>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.registrationNo || 'N/A'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(orgDetails?.registrationDate || '')}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Other Registration</h4>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.otherRegistrationNo || 'N/A'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(orgDetails?.otherRegistrationDate || '')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <DocumentIcon className="w-5 h-5 mr-2 text-purple-600" />
                      Additional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">TAN Number</h4>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.tanNo || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">GST Number</h4>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.gstNo || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Niti Ayog ID</h4>
                        <p className="text-gray-600 dark:text-gray-400">{orgDetails?.nitiAyogId || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Niti Ayog Reg Date</h4>
                        <p className="text-gray-600 dark:text-gray-400">{formatDate(orgDetails?.nitiAyogRegDate || '')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'organization' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Name</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails?.organizationName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Type</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails?.registrationType || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails?.registrationNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(orgDetails?.registrationDate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Other Registration Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails?.otherRegistrationNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Other Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(orgDetails?.otherRegistrationDate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PAN Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails?.panNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TAN Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails?.tanNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST Number</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails?.gstNo || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Niti Ayog ID</label>
                      <p className="text-gray-900 dark:text-white">{orgDetails?.nitiAyogId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Niti Ayog Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(orgDetails?.nitiAyogRegDate || '')}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'certification' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">12A Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails?.reg12A || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">12A Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(certDetails?.reg12ADate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">80G Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails?.reg80G || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">80G Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(certDetails?.reg80GDate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">35AC Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails?.reg35AC || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">35AC Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(certDetails?.reg35ACDate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">FCRA Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails?.regFCRA || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">FCRA Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(certDetails?.regFCRADate || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CSR1 Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails?.regCSR1 || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CSR1 Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(certDetails?.regCSR1Date || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GCSR Registration</label>
                      <p className="text-gray-900 dark:text-white">{certDetails?.regGCSR || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GCSR Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(certDetails?.regGCSRDate || '')}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Other Details</label>
                      <p className="text-gray-900 dark:text-white">{certDetails?.other_detail || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Other Details Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(certDetails?.other_date || '')}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Line 1</label>
                      <p className="text-gray-900 dark:text-white">{addressDetails.address1 || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Line 2</label>
                      <p className="text-gray-900 dark:text-white">{addressDetails.address2 || 'N/A'}</p>
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                      <p className="text-gray-900 dark:text-white">{addressDetails.city || 'N/A'}</p>
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
                  {/* Phones */}
                  {commDetails.phones && commDetails.phones.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Phone Numbers</h3>
                      <div className="space-y-2">
                        {commDetails.phones.map((phone: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <PhoneIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900 dark:text-white">{phone.number || phone.phone_number}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">({phone.type})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emails */}
                  {commDetails.emails && commDetails.emails.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Email Addresses</h3>
                      <div className="space-y-2">
                        {commDetails.emails.map((email: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900 dark:text-white">{email.email || email.email_address}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">({email.type})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {commDetails.socialLinks && commDetails.socialLinks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Social Media Links</h3>
                      <div className="space-y-2">
                        {commDetails.socialLinks.map((social: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900 dark:text-white font-medium">{social.platform}:</span>
                            <span className="text-gray-900 dark:text-white">{social.url || social.link}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!commDetails.phones || commDetails.phones.length === 0) && 
                   (!commDetails.emails || commDetails.emails.length === 0) && 
                   (!commDetails.socialLinks || commDetails.socialLinks.length === 0) && (
                    <div className="text-center py-8">
                      <PhoneIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No communication details available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'contact-person' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                      <p className="text-gray-900 dark:text-white">{contactDetails.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Designation</label>
                      <p className="text-gray-900 dark:text-white">{contactDetails.designation || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <p className="text-gray-900 dark:text-white">{contactDetails.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile</label>
                      <p className="text-gray-900 dark:text-white">{contactDetails.mobile || 'N/A'}</p>
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