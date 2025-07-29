import React from 'react';

interface AllFormsGridModalProps {
  userFormsData: Record<string, Record<string, any>>;
  onClose: () => void;
}

const FormSectionGrid: React.FC<{ title: string; data: Record<string, any> }> = ({ title, data }) => (
  <div className="border rounded-lg p-4 mb-6 shadow bg-white">
    <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-800">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
      {Object.entries(data).map(([field, value]) => (
        <div className="flex" key={field}>
          <span className="font-medium text-gray-600 w-40 truncate">{field}:</span>
          <span className="ml-2 text-gray-900 break-all">{String(value) || 'N/A'}</span>
        </div>
      ))}
    </div>
  </div>
);

const AllFormsGridModal: React.FC<AllFormsGridModalProps> = ({ userFormsData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-8 text-gray-900">User Full Details</h2>
        <div className="space-y-8">
          {Object.entries(userFormsData).map(([formName, formData]) => (
            <FormSectionGrid key={formName} title={formName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} data={formData} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFormsGridModal; 