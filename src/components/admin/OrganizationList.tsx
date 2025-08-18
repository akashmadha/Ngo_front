import React, { useState, useEffect } from 'react';
import OrganizationDetailsModal from './OrganizationDetailsModal';

interface Organization {
  id: number;
  name: string; // Changed from organization_name to match backend response
  email: string;
  mobile_no: string;
  status: string;
}

const OrganizationList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/trust-members`, {
          headers: {
            'user-id': localStorage.getItem('userId') || '',
          },
        });
        const data = await response.json();
        if (data.success) {
          setOrganizations(data.data);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleViewDetails = (id: number) => {
    setSelectedOrgId(id);
  };

  const handleCloseModal = () => {
    setSelectedOrgId(null);
  };

  if (loading) {
    return <div>Loading organizations...</div>;
  }

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Registered Organizations
        </h4>

        <div className="flex flex-col">
          <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Organization Name</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Mobile No.</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
            </div>
          </div>

          {organizations.map((org) => (
            <div className="grid grid-cols-5 border-b border-stroke dark:border-strokedark" key={org.id}>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">{org.name}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">{org.email}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{org.mobile_no}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-5">{org.status}</p>
              </div>
              
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <button
                  onClick={() => handleViewDetails(org.id)}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrgId && (
        <OrganizationDetailsModal
          organizationId={selectedOrgId}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default OrganizationList; 