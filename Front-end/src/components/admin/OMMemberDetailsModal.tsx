import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

interface OMMemberDetailsModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OMMemberDetailsModal({ member, isOpen, onClose }: OMMemberDetailsModalProps) {
  if (!isOpen || !member) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Member Details
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              ID: #{member.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Organization Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Organization Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Name</label>
                <p className="text-gray-900 dark:text-white">{member['Organization Details']?.organizationName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Type</label>
                <p className="text-gray-900 dark:text-white">{member['Organization Details']?.registrationType || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Number</label>
                <p className="text-gray-900 dark:text-white">{member['Organization Details']?.registrationNo || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Date</label>
                <p className="text-gray-900 dark:text-white">{formatDate(member['Organization Details']?.registrationDate || '')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">PAN Number</label>
                <p className="text-gray-900 dark:text-white">{member['Organization Details']?.panNo || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="mt-1">{getStatusBadge(member['Organization Details']?.status || 'unknown')}</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">SPOC Name</label>
                <p className="text-gray-900 dark:text-white">{member['Organization Details']?.spocName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-900 dark:text-white">{member['Organization Details']?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile</label>
                <p className="text-gray-900 dark:text-white">{member['Organization Details']?.mobile || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created Date</label>
                <p className="text-gray-900 dark:text-white">{formatDate(member['Organization Details']?.createdAt || '')}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {member['Registered Office Address'] && Object.keys(member['Registered Office Address']).length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Registered Office Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address Line 1</label>
                  <p className="text-gray-900 dark:text-white">{member['Registered Office Address']?.address_line1 || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address Line 2</label>
                  <p className="text-gray-900 dark:text-white">{member['Registered Office Address']?.address_line2 || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">City</label>
                  <p className="text-gray-900 dark:text-white">{member['Registered Office Address']?.city || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">State</label>
                  <p className="text-gray-900 dark:text-white">{member['Registered Office Address']?.state || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">District</label>
                  <p className="text-gray-900 dark:text-white">{member['Registered Office Address']?.district || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Pincode</label>
                  <p className="text-gray-900 dark:text-white">{member['Registered Office Address']?.pincode || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Communication Details */}
          {member['Communication Details'] && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Communication Details
              </h3>
              
              {/* Phones */}
              {member['Communication Details']?.phones && member['Communication Details'].phones.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Numbers</h4>
                  <div className="space-y-1">
                    {member['Communication Details'].phones.map((phone: any, index: number) => (
                      <div key={index} className="text-gray-900 dark:text-white">
                        {phone.phone_number} ({phone.type})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emails */}
              {member['Communication Details']?.emails && member['Communication Details'].emails.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Email Addresses</h4>
                  <div className="space-y-1">
                    {member['Communication Details'].emails.map((email: any, index: number) => (
                      <div key={index} className="text-gray-900 dark:text-white">
                        {email.email_address} ({email.type})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {member['Communication Details']?.socialLinks && member['Communication Details'].socialLinks.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Social Media Links</h4>
                  <div className="space-y-1">
                    {member['Communication Details'].socialLinks.map((social: any, index: number) => (
                      <div key={index} className="text-gray-900 dark:text-white">
                        {social.platform}: {social.link}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certification Details */}
          {member['Certification Details'] && Object.keys(member['Certification Details']).length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Certification Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Certification Name</label>
                  <p className="text-gray-900 dark:text-white">{member['Certification Details']?.certification_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Issuing Authority</label>
                  <p className="text-gray-900 dark:text-white">{member['Certification Details']?.issuing_authority || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Issue Date</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(member['Certification Details']?.issue_date || '')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(member['Certification Details']?.expiry_date || '')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Key Contact Person */}
          {member['Key Contact Person'] && Object.keys(member['Key Contact Person']).length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key Contact Person
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                  <p className="text-gray-900 dark:text-white">{member['Key Contact Person']?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Designation</label>
                  <p className="text-gray-900 dark:text-white">{member['Key Contact Person']?.designation || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">{member['Key Contact Person']?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                  <p className="text-gray-900 dark:text-white">{member['Key Contact Person']?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 