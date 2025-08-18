import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Location {
  id: number;
  name: string;
}

const steps = [
  'Organization Details',
  'Certification Details',
  'Registered Office Address',
  'Communication Details',
  'Key Contact Person',
];

const initialFormData = {
  organizationName: '',
  registrationType: '',
  registrationNo: '',
  registrationDate: '',
  otherRegistrationNo: '',
  otherRegistrationDate: '',
  panNo: '',
  tanNo: '',
  gstNo: '',
  nitiAyogId: '',
  nitiAyogRegDate: '',
  otherDetails: '',
};

const OrganizationWizard: React.FC = () => {
  const navigate = useNavigate();
  
  // Load saved data from localStorage on component mount
  const loadSavedData = () => {
    const savedData = localStorage.getItem('organizationWizardData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
    return null;
  };

  const savedData = loadSavedData();
  
  const [currentStep, setCurrentStep] = useState(savedData?.currentStep || 0);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);
  const [formData, setFormData] = useState(savedData?.formData || initialFormData);
  const [otherDetailsList, setOtherDetailsList] = useState(savedData?.otherDetailsList || [{ detail: '', date: '' }]);
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [stepSaved, setStepSaved] = useState<boolean[]>([false, false, false, false, false]);
  const [loading, setLoading] = useState(false);
  const [isSubmissionComplete, setIsSubmissionComplete] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  // Add state for Certification Details
  const [certification, setCertification] = useState(savedData?.certification || {
    reg12A: '', reg12ADate: '',
    reg80G: '', reg80GDate: '',
    reg35AC: '', reg35ACDate: '',
    regFCRA: '', regFCRADate: '',
    regCSR1: '', regCSR1Date: '',
    regGCSR: '', regGCSRDate: '',
  });
  const [certOtherList, setCertOtherList] = useState(savedData?.certOtherList || [{ detail: '', date: '' }]);

  // Add state for Address of the registered office
  const [address, setAddress] = useState(savedData?.address || {
    address1: '',
    address2: '',
    state: '',
    district: '',
    tahsil: '',
    city: '',
    pincode: '',
  });
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  // Add state for Communication Details
  const [phones, setPhones] = useState(savedData?.phones || ['']);
  const [emails, setEmails] = useState(savedData?.emails || ['']);
  const [website, setWebsite] = useState(savedData?.website || '');
  const [socialLinks, setSocialLinks] = useState(savedData?.socialLinks || ['']);
  const handlePhoneChange = (idx: number, value: string) => {
    setPhones(list => {
      const updated = [...list];
      updated[idx] = value;
      return updated;
    });
  };
  const handleAddPhone = () => setPhones(list => [...list, '']);
  const handleRemovePhone = (idx: number) => setPhones(list => list.filter((_, i) => i !== idx));

  const handleEmailChange = (idx: number, value: string) => {
    setEmails(list => {
      const updated = [...list];
      updated[idx] = value;
      return updated;
    });
  };
  const handleAddEmail = () => setEmails(list => [...list, '']);
  const handleRemoveEmail = (idx: number) => setEmails(list => list.filter((_, i) => i !== idx));

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value);
  const handleSocialLinkChange = (idx: number, value: string) => {
    setSocialLinks(list => {
      const updated = [...list];
      updated[idx] = value;
      return updated;
    });
  };
  const handleAddSocialLink = () => setSocialLinks(list => [...list, '']);
  const handleRemoveSocialLink = (idx: number) => setSocialLinks(list => list.filter((_, i) => i !== idx));

  // Add state for Key Contact Person
  const [contactPerson, setContactPerson] = useState(savedData?.contactPerson || {
    spoc: '',
    mobile: '',
    email: '',
  });
  const handleContactPersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactPerson(prev => ({ ...prev, [name]: value }));
  };

  // Add state for communication address and checkbox
  const [commAddress, setCommAddress] = useState(savedData?.commAddress || {
    address1: '',
    address2: '',
    state: '',
    district: '',
    tahsil: '',
    city: '',
    pincode: '',
  });
  const [sameAsPermanent, setSameAsPermanent] = useState(savedData?.sameAsPermanent !== undefined ? savedData.sameAsPermanent : true);
  const [showAddressPreview, setShowAddressPreview] = useState(false);

  // Function to save form data to localStorage
  const saveToLocalStorage = () => {
    const dataToSave = {
      formData,
      otherDetailsList,
      certification,
      certOtherList,
      address,
      phones,
      emails,
      website,
      socialLinks,
      contactPerson,
      commAddress,
      sameAsPermanent,
      currentStep
    };
    localStorage.setItem('organizationWizardData', JSON.stringify(dataToSave));
  };

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    const saved = localStorage.getItem('organizationWizardData');
    console.log('Current localStorage data:', saved ? JSON.parse(saved) : 'No data');
  };

  // Save to localStorage whenever form data changes
  useEffect(() => {
    saveToLocalStorage();
    // Debug: log localStorage on every save
    debugLocalStorage();
  }, [formData, otherDetailsList, certification, certOtherList, address, phones, emails, website, socialLinks, contactPerson, commAddress, sameAsPermanent, currentStep]);

  // Sync commAddress with address if checkbox is checked
  useEffect(() => {
    if (sameAsPermanent) {
      setCommAddress({ ...address });
    }
  }, [sameAsPermanent, address]);

  const handleCommAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCommAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    if (currentStep === 0) {
      setFormData(initialFormData);
      setOtherDetailsList([{ detail: '', date: '' }]);
      // Clear localStorage when user manually clears the form
      localStorage.removeItem('organizationWizardData');
    }
  };

  // Animation classes
  const transition = 'transition-all duration-500 ease-in-out';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtherDetailChange = (idx: number, field: 'detail' | 'date', value: string) => {
    setOtherDetailsList(list => {
      const updated = [...list];
      updated[idx][field] = value;
      return updated;
    });
  };

  const handleAddOtherDetail = () => {
    setOtherDetailsList(list => [...list, { detail: '', date: '' }]);
  };

  const handleRemoveOtherDetail = (idx: number) => {
    setOtherDetailsList(list => list.filter((_, i) => i !== idx));
  };

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCertification(prev => ({ ...prev, [name]: value }));
  };
  const handleCertOtherChange = (idx: number, field: 'detail' | 'date', value: string) => {
    setCertOtherList(list => {
      const updated = [...list];
      updated[idx][field] = value;
      return updated;
    });
  };
  const handleAddCertOther = () => setCertOtherList(list => [...list, { detail: '', date: '' }]);
  const handleRemoveCertOther = (idx: number) => setCertOtherList(list => list.filter((_, i) => i !== idx));

  // Validation for each step - DISABLED FOR TESTING
  const validateStep = () => {
    // Validation disabled for testing: always allow next step
    // Do not set errorMsg at all
    return true;
  };

  // Fetch and pre-fill data on mount
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/member/registration-details`, {
          headers: { 'user-id': userId }
        });
        const data = await res.json();
        if (res.ok && data.data) {
          // Pre-fill all steps from backend data
          setFormData({
            organizationName: data.data.organization_name || '',
            registrationType: data.data.registration_type || '',
            registrationNo: data.data.registration_no || '',
            registrationDate: data.data.registration_date || '',
            otherRegistrationNo: data.data.other_registration_no || '',
            otherRegistrationDate: data.data.other_registration_date || '',
            panNo: data.data.pan_no || '',
            tanNo: data.data.tan_no || '',
            gstNo: data.data.gst_no || '',
            nitiAyogId: data.data.niti_ayog_id || '',
            nitiAyogRegDate: data.data.niti_ayog_reg_date || '',
            otherDetails: '',
          });
          setOtherDetailsList(Array.isArray(data.data.other_details) ? data.data.other_details : []);
          // TODO: Pre-fill other steps if backend supports them
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add state for master data
  const [states, setStates] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [talukas, setTalukas] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);

  // Fetch all states on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/states`)
      .then(res => res.json())
      .then(data => setStates(data.data || []));
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (address.state) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/districts?stateId=${address.state}`)
        .then(res => res.json())
        .then(data => setDistricts(data.data || []));
    } else {
      setDistricts([]);
    }
    setAddress(prev => ({ ...prev, district: '', tahsil: '', city: '' }));
    setTalukas([]);
    setCities([]);
  }, [address.state]);

  // Fetch talukas when district changes
  useEffect(() => {
    if (address.state && address.district) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/talukas?stateId=${address.state}&districtId=${address.district}`)
        .then(res => res.json())
        .then(data => setTalukas(data.data || []));
    } else {
      setTalukas([]);
    }
    setAddress(prev => ({ ...prev, tahsil: '', city: '' }));
    setCities([]);
  }, [address.state, address.district]);

  // Fetch cities when district changes (removed taluka dependency since cities table doesn't have taluka_id)
  useEffect(() => {
    if (address.state && address.district) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cities?stateId=${address.state}&districtId=${address.district}`)
        .then(res => res.json())
        .then(data => setCities(data.data || []));
    } else {
      setCities([]);
    }
    setAddress(prev => ({ ...prev, city: '' }));
  }, [address.state, address.district]);

  // Save data to backend after every step
  const saveStepData = async (): Promise<boolean> => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setErrorMsg('User not found. Please log in again.');
      return false;
    }
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    // Prepare normalized payload
    const payload = {
      registrationDetails: {
        organizationName: formData.organizationName,
        registrationType: formData.registrationType && formData.registrationType.trim() !== '' ? formData.registrationType : null,
        registrationNo: formData.registrationNo,
        registrationDate: formData.registrationDate,
        otherRegistrationNo: formData.otherRegistrationNo,
        otherRegistrationDate: formData.otherRegistrationDate,
        panNo: formData.panNo,
        tanNo: formData.tanNo,
        gstNo: formData.gstNo,
        nitiAyogId: formData.nitiAyogId,
        nitiAyogRegDate: formData.nitiAyogRegDate,
        otherDetails: otherDetailsList,
      },
      addresses: [
        { type: 'permanent', ...address },
        { type: 'communication', ...commAddress }
      ],
      phones: phones.filter(p => p).map(number => ({ number, type: 'primary' })),
      emails: emails.filter(e => e).map(email => ({ email, type: 'primary' })),
      socialLinks: socialLinks.filter(s => s).map(url => ({ platform: '', url })),
      keyContacts: [
        { name: contactPerson.spoc, mobile: contactPerson.mobile, email: contactPerson.email }
      ],
      certificationDetails: [
        { reg12A: certification.reg12A, reg12ADate: certification.reg12ADate },
        { reg80G: certification.reg80G, reg80GDate: certification.reg80GDate },
        { reg35AC: certification.reg35AC, reg35ACDate: certification.reg35ACDate },
        { regFCRA: certification.regFCRA, regFCRADate: certification.regFCRADate },
        { regCSR1: certification.regCSR1, regCSR1Date: certification.regCSR1Date },
        { regGCSR: certification.regGCSR, regGCSRDate: certification.regGCSRDate },
        ...certOtherList.filter(c => c.detail || c.date)
      ]
    };
    try {
      console.log('Sending payload to backend:', JSON.stringify(payload, null, 2));
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/member/registration-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Response status:', res.status);
      const result = await res.json();
      console.log('Response data:', result);
      
      if (res.ok && result.success) {
        setSuccessMsg('Data saved successfully!');
        setStepSaved((prev) => {
          const updated = [...prev];
          updated[currentStep] = true;
          return updated;
        });
        // Clear localStorage after successful submission
        localStorage.removeItem('organizationWizardData');
        setTimeout(() => setSuccessMsg(''), 3000);
        return true;
      } else {
        const errorMessage = result.error || `Failed to save data. Status: ${res.status}`;
        setErrorMsg(errorMessage);
        console.error('Save failed:', errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = 'Network or server error. Please try again.';
      setErrorMsg(errorMessage);
      console.error('Network error:', err);
      return false;
    } finally {
      setLoading(false);
    }  
  };

  const handleNext = async () => {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;
    
    if (loading) {
      console.log('Form submission already in progress, ignoring duplicate click');
      return;
    }
    
    // Prevent rapid successive submissions (debounce)
    if (timeSinceLastSubmission < 2000) {
      console.log('Submission too soon after last one, ignoring');
      return;
    }
    
    console.log('Attempting to save step:', currentStep, 'Data:', {
      formData,
      address,
      certification,
      contactPerson,
      phones,
      emails
    });
    
    if (validateStep()) {
      setLoading(true); // Ensure loading state is set
      setLastSubmissionTime(now);
      const success = await saveStepData();
      if (success) {
        const newCompleted = [...completed];
        newCompleted[currentStep] = true;
        setCompleted(newCompleted);

        if (currentStep === steps.length - 1) {
          setIsSubmissionComplete(true);
        } else {
          setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
        
        if (currentStep === 2) {
          setShowAddressPreview(true);
        }
      } else {
        console.error('Failed to save step data');
      }
    } else {
      setErrorMsg('Please fill in all required fields before proceeding.');
    }
  };

  const handleBack = () => {
    const newCompleted = [...completed];
    newCompleted[currentStep] = false;
    setCompleted(newCompleted);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Integrate with backend if needed
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      const success = await saveStepData();
      if (success) {
        // Clear localStorage after successful submission
        localStorage.removeItem('organizationWizardData');
      }
    }
  };

  // Progress bar with checkmarks
  const renderProgress = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((label, idx) => (
        <div key={label} className="flex-1 flex flex-col items-center relative">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              completed[idx] || currentStep > idx
                ? 'bg-green-500 border-green-500 text-white'
                : currentStep === idx
                ? 'border-brand-500 text-brand-500 bg-white'
                : 'border-gray-300 text-gray-400 bg-white'
            } ${transition}`}
          >
            {stepSaved[idx] || completed[idx] || currentStep > idx ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              idx + 1
            )}
          </div>
          <span className="mt-2 text-xs text-center w-24 text-gray-700 dark:text-gray-200">{label}</span>
          {idx < steps.length - 1 && (
            <div className={`absolute top-4 left-full w-full h-1 ${stepSaved[idx] || completed[idx] ? 'bg-green-500' : 'bg-gray-300'} ${transition}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  // Step content - only show Organization Details form
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <h2 className="text-lg font-semibold mb-4 text-brand-500">Organization Details</h2>
            {submitted ? (
              <div className="text-green-600 dark:text-green-400 font-medium text-center mb-4">
                Details submitted successfully!
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name of the Organization</label>
                  <input
                    className="input input-bordered w-full"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type of registration</label>
                  <select
                    className="input input-bordered w-full"
                    name="registrationType"
                    value={formData.registrationType}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option value="Society">Society</option>
                    <option value="Trust">Trust</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registration No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="registrationNo"
                    value={formData.registrationNo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Other Registration No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="otherRegistrationNo"
                    value={formData.otherRegistrationNo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Other Registration Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="otherRegistrationDate"
                    value={formData.otherRegistrationDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PAN No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="panNo"
                    value={formData.panNo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">TAN No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="tanNo"
                    value={formData.tanNo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GST No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="gstNo"
                    value={formData.gstNo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Niti Ayog (NGO Darpan) ID</label>
                  <input
                    className="input input-bordered w-full"
                    name="nitiAyogId"
                    value={formData.nitiAyogId}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Niti Ayog Registration Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="nitiAyogRegDate"
                    value={formData.nitiAyogRegDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Add Other Details With Date</label>
                  <div className="space-y-2">
                    {otherDetailsList.map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2">
                        <input
                          className="input input-bordered flex-1"
                          placeholder="Detail/Description"
                          value={item.detail}
                          onChange={e => handleOtherDetailChange(idx, 'detail', e.target.value)}
                        />
                        <input
                          type="date"
                          className="input input-bordered w-40"
                          value={item.date}
                          onChange={e => handleOtherDetailChange(idx, 'date', e.target.value)}
                        />
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 px-2"
                          onClick={() => handleRemoveOtherDetail(idx)}
                          disabled={otherDetailsList.length === 1}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 px-4 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded"
                      onClick={handleAddOtherDetail}
                    >
                      + Add More
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      case 1:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <h2 className="text-lg font-semibold mb-4 text-brand-500">Certification Details</h2>
            <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">12A Registration No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="reg12A"
                    value={certification.reg12A}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">12A Registration Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="reg12ADate"
                    value={certification.reg12ADate}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">80G Registration No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="reg80G"
                    value={certification.reg80G}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">80G Registration Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="reg80GDate"
                    value={certification.reg80GDate}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">35AC Registration No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="reg35AC"
                    value={certification.reg35AC}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">35AC Registration Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="reg35ACDate"
                    value={certification.reg35ACDate}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">FCRA Registration No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="regFCRA"
                    value={certification.regFCRA}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">FCRA Registration Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="regFCRADate"
                    value={certification.regFCRADate}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CSR 1 Registration No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="regCSR1"
                    value={certification.regCSR1}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CSR 1 Registration Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="regCSR1Date"
                    value={certification.regCSR1Date}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GCSR/Other Registration No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="regGCSR"
                    value={certification.regGCSR}
                    onChange={handleCertChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GCSR/Other Registration Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="regGCSRDate"
                    value={certification.regGCSRDate}
                    onChange={handleCertChange}
                  />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Add Other Details With Date</label>
                  <div className="space-y-2">
                    {certOtherList.map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2">
                        <input
                          className="input input-bordered flex-1"
                          placeholder="Detail/Description"
                          value={item.detail}
                          onChange={e => handleCertOtherChange(idx, 'detail', e.target.value)}
                        />
                        <input
                          type="date"
                          className="input input-bordered w-40"
                          value={item.date}
                          onChange={e => handleCertOtherChange(idx, 'date', e.target.value)}
                        />
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 px-2"
                          onClick={() => handleRemoveCertOther(idx)}
                          disabled={certOtherList.length === 1}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 px-4 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded"
                      onClick={handleAddCertOther}
                    >
                      + Add More
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <h2 className="text-lg font-semibold mb-4 text-brand-500">Address of the Registered Office</h2>
            <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address 1</label>
                  <input
                    className="input input-bordered w-full"
                    name="address1"
                    value={address.address1}
                    onChange={handleAddressChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address 2</label>
                  <input
                    className="input input-bordered w-full"
                    name="address2"
                    value={address.address2}
                    onChange={handleAddressChange}
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <select
                  className="input input-bordered w-full"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">District</label>
                <select
                  className="input input-bordered w-full"
                  name="district"
                  value={address.district}
                  onChange={handleAddressChange}
                  disabled={!address.state}
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tahsil/Taluka</label>
                <select
                  className="input input-bordered w-full"
                  name="tahsil"
                  value={address.tahsil}
                  onChange={handleAddressChange}
                  disabled={!address.district}
                >
                  <option value="">Select Tahsil/Taluka</option>
                  {talukas.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City/Village</label>
                <select
                  className="input input-bordered w-full"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  disabled={!address.tahsil}
                >
                  <option value="">Select City/Village</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PinCode</label>
                  <input
                    className="input input-bordered w-full"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
              <div className="col-span-2 flex items-center mb-2">
                <input
                  type="checkbox"
                  id="sameAsPermanent"
                  checked={sameAsPermanent}
                  onChange={e => setSameAsPermanent(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="sameAsPermanent" className="text-sm font-medium">Same as Permanent Address</label>
              </div>
              <div className="col-span-2">
                <h3 className="text-md font-semibold mb-2">Communication Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Address 1</label>
                    <input
                      className="input input-bordered w-full"
                      name="address1"
                      value={commAddress.address1}
                      onChange={handleCommAddressChange}
                      disabled={sameAsPermanent}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address 2</label>
                    <input
                      className="input input-bordered w-full"
                      name="address2"
                      value={commAddress.address2}
                      onChange={handleCommAddressChange}
                      disabled={sameAsPermanent}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <select
                      className="input input-bordered w-full"
                      name="state"
                      value={commAddress.state}
                      onChange={handleCommAddressChange}
                      disabled={sameAsPermanent}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">District</label>
                    <select
                      className="input input-bordered w-full"
                      name="district"
                      value={commAddress.district}
                      onChange={handleCommAddressChange}
                      disabled={sameAsPermanent || !commAddress.state}
                    >
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tahsil/Taluka</label>
                    <select
                      className="input input-bordered w-full"
                      name="tahsil"
                      value={commAddress.tahsil}
                      onChange={handleCommAddressChange}
                      disabled={sameAsPermanent || !commAddress.district}
                    >
                      <option value="">Select Tahsil/Taluka</option>
                      {talukas.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City/Village</label>
                    <select
                      className="input input-bordered w-full"
                      name="city"
                      value={commAddress.city}
                      onChange={handleCommAddressChange}
                      disabled={sameAsPermanent || !commAddress.tahsil}
                    >
                      <option value="">Select City/Village</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PinCode</label>
                    <input
                      className="input input-bordered w-full"
                      name="pincode"
                      value={commAddress.pincode}
                      onChange={handleCommAddressChange}
                      disabled={sameAsPermanent}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      case 3:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <h2 className="text-lg font-semibold mb-4 text-brand-500">Communication Details</h2>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleNext(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone No. */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium mb-1">Phone No.</label>
                  <div className="space-y-2">
                    {phones.map((phone, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          className="input input-bordered flex-1"
                          placeholder="Phone Number"
                          value={phone}
                          onChange={e => handlePhoneChange(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 px-2"
                          onClick={() => handleRemovePhone(idx)}
                          disabled={phones.length === 1}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 px-4 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded"
                      onClick={handleAddPhone}
                    >
                      + Add More
                    </button>
                  </div>
                </div>
                {/* Email IDs */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium mb-1">Email ID's</label>
                  <div className="space-y-2">
                    {emails.map((email, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          className="input input-bordered flex-1"
                          placeholder="Email Address"
                          value={email}
                          onChange={e => handleEmailChange(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 px-2"
                          onClick={() => handleRemoveEmail(idx)}
                          disabled={emails.length === 1}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 px-4 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded"
                      onClick={handleAddEmail}
                    >
                      + Add More
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Website Address</label>
                <input
                  className="input input-bordered w-[768px]"
                  placeholder="Website URL"
                  value={website}
                  onChange={handleWebsiteChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Social Media</label>
                <div className="space-y-2">
                  {socialLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        className="input input-bordered flex-1"
                        placeholder="e.g. Facebook, Instagram, LinkedIn, Twitter, Other..."
                        value={link}
                        onChange={e => handleSocialLinkChange(idx, e.target.value)}
                      />
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 px-2"
                        onClick={() => handleRemoveSocialLink(idx)}
                        disabled={socialLinks.length === 1}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 px-4 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded"
                    onClick={handleAddSocialLink}
                  >
                    + Add More
                  </button>
                </div>
              </div>
             
            </form>
          </div>
        );
      case 4:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <h2 className="text-lg font-semibold mb-4 text-brand-500">Key Contact Person of the Organization</h2>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleNext(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SPOC (Name)</label>
                  <input
                    className="input input-bordered w-full"
                    name="spoc"
                    value={contactPerson.spoc}
                    onChange={handleContactPersonChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person's Mobile No.</label>
                  <input
                    className="input input-bordered w-full"
                    name="mobile"
                    value={contactPerson.mobile}
                    onChange={handleContactPersonChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email ID</label>
                  <input
                    className="input input-bordered w-full"
                    name="email"
                    value={contactPerson.email}
                    onChange={handleContactPersonChange}
                  />
                </div>
              </div>
             
            </form>
          </div>
        );
      default:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <h2 className="text-lg font-semibold mb-4 text-brand-500">{steps[currentStep]}</h2>
            <div className="text-gray-600 dark:text-gray-300 text-center py-8">
              This step is coming soon...
            </div>
          </div>
        );
    }
  };

  if (isSubmissionComplete) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        <div className="p-10 bg-green-50 border border-green-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Thank you for completing your profile!</h2>
          <p className="text-brand-600 mb-6">Your information has been successfully submitted to NGO Linkup. We appreciate your commitment to transparency and collaboration.</p>
          <button 
              onClick={() => navigate('/member-dashboard')}
              className="px-8 py-3 rounded-lg bg-brand-500 text-white font-semibold transition-colors duration-150 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
              Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {renderProgress()}
      {successMsg && (
        <div className="mb-4 text-green-600 font-semibold text-center">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="mb-4 text-red-600 font-semibold text-center">{errorMsg}</div>
      )}
      <form onSubmit={handleFinalSubmit}>
        <div className={`mb-8 ${transition}`}>{renderStep()}</div>
      
        <div className="flex justify-between mt-8">
          {currentStep > 0 ? (
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold transition-colors duration-150 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-50"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold transition-colors duration-150 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-brand-500 text-white font-semibold transition-colors duration-150 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-50"
              onClick={handleNext}
              disabled={loading}
            >
              Next
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold transition-colors duration-150 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
              disabled={loading}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrganizationWizard; 