import React, { useState, useEffect } from 'react';

interface OrganizationDetailsProps {
  organizationId: number;
  onClose: () => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">{children}</div>
  </div>
);

const DetailItem: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div>
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="ml-2 text-gray-800">{value || 'N/A'}</span>
  </div>
);

const OrganizationDetailsModal: React.FC<OrganizationDetailsProps> = ({ organizationId, onClose }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/member-details/${organizationId}`, {
          headers: { 'user-id': localStorage.getItem('userId') || '' },
        });
        const data = await response.json();
        if (data.success) {
          // Parse JSON fields
          if (data.data.registrationDetails?.other_details) {
            data.data.registrationDetails.other_details = JSON.parse(data.data.registrationDetails.other_details);
          }
          setDetails(data.data);
        }
      } catch (error) {
        console.error('Error fetching organization details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [organizationId]);
  
  const { registrationDetails, addresses, phones, emails, socialLinks, keyContacts, certificationDetails } = details || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Organization Full Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        {loading ? (
          <div className="text-center py-10">Loading details...</div>
        ) : details ? (
          <div className="space-y-6">
            <DetailSection title="1. Organization Details">
              <DetailItem label="Name" value={registrationDetails?.organization_name} />
              <DetailItem label="Registration Type" value={registrationDetails?.registration_type} />
              <DetailItem label="Registration No" value={registrationDetails?.registration_no} />
              <DetailItem label="Registration Date" value={registrationDetails?.registration_date} />
              <DetailItem label="Other Reg No" value={registrationDetails?.other_registration_no} />
              <DetailItem label="Other Reg Date" value={registrationDetails?.other_registration_date} />
              <DetailItem label="PAN No" value={registrationDetails?.pan_no} />
              <DetailItem label="TAN No" value={registrationDetails?.tan_no} />
              <DetailItem label="GST No" value={registrationDetails?.gst_no} />
              <DetailItem label="Niti Ayog ID" value={registrationDetails?.niti_ayog_id} />
              <DetailItem label="Niti Ayog Reg Date" value={registrationDetails?.niti_ayog_reg_date} />
            </DetailSection>

            {registrationDetails?.other_details?.length > 0 && (
              <DetailSection title="Other Organization Details">
                {registrationDetails.other_details.map((item: any, index: number) => (
                  <DetailItem key={index} label={item.detail} value={item.date} />
                ))}
              </DetailSection>
            )}

            <DetailSection title="2. Certification Details">
              {certificationDetails?.map((cert: any, index: number) => (
                <React.Fragment key={index}>
                  {cert.reg12A && <DetailItem label="12A No" value={cert.reg12A} />}
                  {cert.reg12ADate && <DetailItem label="12A Date" value={cert.reg12ADate} />}
                  {cert.reg80G && <DetailItem label="80G No" value={cert.reg80G} />}
                  {cert.reg80GDate && <DetailItem label="80G Date" value={cert.reg80GDate} />}
                  {cert.reg35AC && <DetailItem label="35AC No" value={cert.reg35AC} />}
                  {cert.reg35ACDate && <DetailItem label="35AC Date" value={cert.reg35ACDate} />}
                  {cert.regFCRA && <DetailItem label="FCRA No" value={cert.regFCRA} />}
                  {cert.regFCRADate && <DetailItem label="FCRA Date" value={cert.regFCRADate} />}
                  {cert.regCSR1 && <DetailItem label="CSR-1 No" value={cert.regCSR1} />}
                  {cert.regCSR1Date && <DetailItem label="CSR-1 Date" value={cert.regCSR1Date} />}
                  {cert.regGCSR && <DetailItem label="GCSR No" value={cert.regGCSR} />}
                  {cert.regGCSRDate && <DetailItem label="GCSR Date" value={cert.regGCSRDate} />}
                  {cert.other_detail && <DetailItem label={cert.other_detail} value={cert.other_date} />}
                </React.Fragment>
              ))}
            </DetailSection>

            <DetailSection title="3. Registered Office Address">
                {addresses?.filter((a: any) => a.type === 'permanent').map((addr: any, i: number) => (
                    <React.Fragment key={i}>
                        <DetailItem label="Address 1" value={addr.address1} />
                        <DetailItem label="Address 2" value={addr.address2} />
                        <DetailItem label="State" value={addr.state} />
                        <DetailItem label="District" value={addr.district} />
                        <DetailItem label="Tahsil" value={addr.tahsil} />
                        <DetailItem label="City" value={addr.city} />
                        <DetailItem label="Pincode" value={addr.pincode} />
                    </React.Fragment>
                ))}
            </DetailSection>

            <DetailSection title="Communication Address">
                {addresses?.filter((a: any) => a.type === 'communication').map((addr: any, i: number) => (
                    <React.Fragment key={i}>
                        <DetailItem label="Address 1" value={addr.address1} />
                        <DetailItem label="Address 2" value={addr.address2} />
                        <DetailItem label="State" value={addr.state} />
                        <DetailItem label="District" value={addr.district} />
                        <DetailItem label="Tahsil" value={addr.tahsil} />
                        <DetailItem label="City" value={addr.city} />
                        <DetailItem label="Pincode" value={addr.pincode} />
                    </React.Fragment>
                ))}
            </DetailSection>
            
            <DetailSection title="4. Communication Details">
              <div className="md:col-span-2">
                <DetailItem label="Phones" value={phones?.map((p: any) => p.number).join(', ')} />
                <DetailItem label="Emails" value={emails?.map((e: any) => e.email).join(', ')} />
                <DetailItem label="Social Links" value={socialLinks?.map((s: any) => s.url).join(', ')} />
              </div>
            </DetailSection>

            <DetailSection title="5. Key Contact Person">
                {keyContacts?.map((contact: any, i: number) => (
                    <React.Fragment key={i}>
                        <DetailItem label="SPOC Name" value={contact.name} />
                        <DetailItem label="Mobile" value={contact.mobile} />
                        <DetailItem label="Email" value={contact.email} />
                    </React.Fragment>
                ))}
            </DetailSection>

          </div>
        ) : (
          <div className="text-center py-10">No details found for this organization.</div>
        )}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailsModal; 