import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileAlt,
  FaGraduationCap,
  FaGlobe,
  FaComments
} from 'react-icons/fa';
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
  };
  'User Registration Details'?: any;
  'Certification Details'?: any;
  'Registered Office Address'?: any;
  'Communication Details'?: any;
  'Key Contact Person'?: any;
}

export default function MemberDetailsEdit() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    organizationName: '',
    organizationType: '',
    panNo: '',
    registrationDate: '',
    spocName: '',
    spocDesignation: '',
    email: '',
    mobile: '',
    regAddress: '',
    regCity: '',
    regState: '',
    regPincode: '',
    regWebsite: '',
    status: 'active'
  });

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
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/admin/om-members-full-details`;
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
        setEditFormData({
          organizationName: foundMember['User Registration Details']?.organization_name || '',
          organizationType: foundMember['User Registration Details']?.registration_type || '',
          panNo: foundMember['User Registration Details']?.pan_no || '',
          registrationDate: foundMember['User Registration Details']?.registration_date || '',
          spocName: foundMember['User Registration Details']?.spoc_name || '',
          spocDesignation: foundMember['User Registration Details']?.spoc_designation || '',
          email: foundMember['User Registration Details']?.email || '',
          mobile: foundMember['User Registration Details']?.mobile_no || '',
          regAddress: foundMember['User Registration Details']?.address1 || '',
          regCity: foundMember['User Registration Details']?.city || '',
          regState: foundMember['User Registration Details']?.state || '',
          regPincode: foundMember['User Registration Details']?.pincode || '',
          regWebsite: foundMember['User Registration Details']?.reg_website || '',
          status: 'active'
        });
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

  const handleUpdateMember = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/member/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) {
        throw new Error('Failed to update member');
      }

      showNotification('success', 'Member updated successfully');
      setShowEditModal(false);
      fetchMemberDetails(); // Refresh data
    } catch (error) {
      console.error('Error updating member:', error);
      showNotification('error', 'Failed to update member');
    }
  };

  const handleDeleteMember = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/member/${memberId}`, {
        method: 'DELETE',
        headers: {
          'user-id': userId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete member');
      }

      showNotification('success', 'Member deleted successfully');
      navigate('/basic-tables');
    } catch (error) {
      console.error('Error deleting member:', error);
      showNotification('error', 'Failed to delete member');
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showNotification('error', 'User not found. Please log in again.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/member/${memberId}/status`, {
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
        fetchMemberDetails();
      } else {
        showNotification('error', result.error || 'Failed to update status.');
      }
    } catch (err) {
      showNotification('error', 'Failed to update status.');
      console.error('Error updating status:', err);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not Available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Not Available';
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

  const renderFormSection = (title: string, icon: React.ReactNode, data: any, fields: Array<{key: string, label: string, type?: string}>) => {
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            {icon}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {fields.map((field) => (
                  <tr key={field.key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400 w-1/3">
                      {field.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {field.type === 'date' 
                        ? formatDate(data[field.key] || '')
                        : data[field.key] || 'Not Available'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
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
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
        title={`Edit Member - ${member['Organization Details']?.organizationName || 'Unknown'} | Admin Dashboard`}
        description="Edit member information in the admin dashboard."
      />
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && <FaCheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <FaExclamationTriangle className="w-5 h-5" />}
            {notification.type === 'info' && <FaInfoCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/basic-tables')}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Member Details
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    ID: #{member.id} • Edit Mode • {member['Organization Details']?.organizationName || 'Unknown Organization'}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Edit Details</span>
                </button>
                
                <button
                  onClick={() => navigate(`/member-details/${member.id}?mode=view`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                
                <select
                  value={member['Organization Details']?.status || 'active'}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            
            {/* members_registration_details */}
            {renderFormSection(
              "members_registration_details",
              <FaBuilding className="w-6 h-6 text-blue-600" />,
              member['User Registration Details'],
              [
                { key: 'organization_name', label: 'Organization Name' },
                { key: 'registration_type', label: 'Registration Type' },
                { key: 'registration_no', label: 'Registration Number' },
                { key: 'registration_date', label: 'Registration Date', type: 'date' },
                { key: 'other_registration_no', label: 'Other Registration Number' },
                { key: 'other_registration_date', label: 'Other Registration Date', type: 'date' },
                { key: 'pan_no', label: 'PAN Number' },
                { key: 'tan_no', label: 'TAN Number' },
                { key: 'gst_no', label: 'GST Number' },
                { key: 'niti_ayog_id', label: 'NITI Aayog ID' },
                { key: 'niti_ayog_reg_date', label: 'NITI Aayog Registration Date', type: 'date' },
                { key: 'other_details', label: 'Other Details' },
                { key: 'address1', label: 'Address Line 1' },
                { key: 'address2', label: 'Address Line 2' },
                { key: 'state', label: 'State' },
                { key: 'district', label: 'District' },
                { key: 'tahsil', label: 'Tahsil' },
                { key: 'city', label: 'City' },
                { key: 'pincode', label: 'Pincode' },
                { key: 'created_at', label: 'Created Date', type: 'date' }
              ]
            )}



            {/* Registered Office Address */}
            {renderFormSection(
              "Registered Office Address",
              <FaMapMarkerAlt className="w-6 h-6 text-green-600" />,
              member['Registered Office Address'],
              [
                { key: 'address1', label: 'Address Line 1' },
                { key: 'address2', label: 'Address Line 2' },
                { key: 'city', label: 'City' },
                { key: 'state', label: 'State' },
                { key: 'district', label: 'District' },
                { key: 'tahsil', label: 'Tahsil' },
                { key: 'pincode', label: 'Pincode' }
              ]
            )}

            {/* Communication Details */}
            {member['Communication Details'] && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <FaGlobe className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Communication Details
                    </h2>
                  </div>
                  
                  {/* Phones */}
                  {member['Communication Details'].phones && member['Communication Details'].phones.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Phone Numbers</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Number</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {member['Communication Details'].phones.map((phone: any, index: number) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {phone.type || 'Not Available'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {phone.number || 'Not Available'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Emails */}
                  {member['Communication Details'].emails && member['Communication Details'].emails.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Email Addresses</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {member['Communication Details'].emails.map((email: any, index: number) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {email.type || 'Not Available'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {email.email || 'Not Available'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {member['Communication Details'].socialLinks && member['Communication Details'].socialLinks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Social Links</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Platform</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">URL</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {member['Communication Details'].socialLinks.map((link: any, index: number) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {link.platform || 'Not Available'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                    {link.url || 'Not Available'}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certification Details */}
            {renderFormSection(
              "Certification Details",
              <FaGraduationCap className="w-6 h-6 text-yellow-600" />,
              member['Certification Details'],
              [
                { key: 'reg12A', label: '12A Registration' },
                { key: 'reg12ADate', label: '12A Registration Date', type: 'date' },
                { key: 'reg80G', label: '80G Registration' },
                { key: 'reg80GDate', label: '80G Registration Date', type: 'date' },
                { key: 'reg35AC', label: '35AC Registration' },
                { key: 'reg35ACDate', label: '35AC Registration Date', type: 'date' },
                { key: 'regFCRA', label: 'FCRA Registration' },
                { key: 'regFCRADate', label: 'FCRA Registration Date', type: 'date' },
                { key: 'regCSR1', label: 'CSR1 Registration' },
                { key: 'regCSR1Date', label: 'CSR1 Registration Date', type: 'date' },
                { key: 'regGCSR', label: 'GCSR Registration' },
                { key: 'regGCSRDate', label: 'GCSR Registration Date', type: 'date' },
                { key: 'other_detail', label: 'Other Details' },
                { key: 'other_date', label: 'Other Date', type: 'date' },
                { key: 'created_at', label: 'Created Date', type: 'date' }
              ]
            )}

            {/* Key Contact Person */}
            {renderFormSection(
              "Key Contact Person",
              <FaComments className="w-6 h-6 text-pink-600" />,
              member['Key Contact Person'],
              [
                { key: 'name', label: 'Contact Name' },
                { key: 'designation', label: 'Designation' },
                { key: 'email', label: 'Email Address' },
                { key: 'mobile', label: 'Mobile Number' },
                { key: 'created_at', label: 'Created Date', type: 'date' }
              ]
            )}

          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Member</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateMember(); }} className="p-6 space-y-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.organizationName}
                        onChange={(e) => setEditFormData({ ...editFormData, organizationName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Organization Type
                      </label>
                      <select
                        value={editFormData.organizationType || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, organizationType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="">Select Type</option>
                        <option value="NGO">NGO</option>
                        <option value="Trust">Trust</option>
                        <option value="Society">Society</option>
                        <option value="Foundation">Foundation</option>
                        <option value="Association">Association</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        PAN Number
                      </label>
                      <input
                        type="text"
                        value={editFormData.panNo || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, panNo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Registration Date
                      </label>
                      <input
                        type="date"
                        value={editFormData.registrationDate || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, registrationDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SPOC Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.spocName}
                        onChange={(e) => setEditFormData({ ...editFormData, spocName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SPOC Designation
                      </label>
                      <input
                        type="text"
                        value={editFormData.spocDesignation || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, spocDesignation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        value={editFormData.mobile}
                        onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Registered Address
                      </label>
                      <textarea
                        value={editFormData.regAddress || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, regAddress: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={editFormData.regCity || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, regCity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={editFormData.regState || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, regState: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={editFormData.regPincode || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, regPincode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={editFormData.regWebsite || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, regWebsite: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaExclamationTriangle className="w-8 h-8 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delete Member</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this member? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMember}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 