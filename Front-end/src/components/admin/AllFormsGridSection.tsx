import React from 'react';

interface AllFormsGridSectionProps {
  userFormsData: Record<string, Record<string, any>>;
}

const SECTION_ORDER = [
  'Organization Details',
  'Certification Details',
  'Registered Office Address',
  'Communication Details',
  'Key Contact Person',
  'User Registration Details',
];

const FormSectionGrid: React.FC<{ title: string; data: Record<string, any> }> = ({ title, data }) => {
  // Filter out empty fields
  const entries = Object.entries(data).filter(([_, value]) => value !== undefined && value !== null && value !== '');
  if (entries.length === 0) return null;
  return (
    <div className="border rounded-lg p-3 mb-4 shadow bg-white">
      <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-blue-700 uppercase tracking-wide">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs">
        {entries.map(([field, value]) => (
          <div className="flex" key={field}>
            <span className="font-medium text-gray-600 w-36 truncate">{field}:</span>
            <span className="ml-2 text-gray-900 break-all">{String(value) || 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AllFormsGridSection: React.FC<AllFormsGridSectionProps> = ({ userFormsData }) => {
  return (
    <div className="space-y-4">
      {SECTION_ORDER.map((section) =>
        userFormsData[section] ? (
          <FormSectionGrid
            key={section}
            title={section}
            data={userFormsData[section]}
          />
        ) : null
      )}
    </div>
  );
};

export default AllFormsGridSection; 