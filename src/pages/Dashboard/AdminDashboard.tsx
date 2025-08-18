import React from 'react';
import OrganizationList from '../../components/admin/OrganizationList';

const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
    <p className="mb-8">Welcome, Admin! Here you can manage the NGO platform.</p>
    
    <OrganizationList />
  </div>
);

export default AdminDashboard; 