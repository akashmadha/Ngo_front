import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MemberDetailsView from './MemberDetailsView';
import MemberDetailsEdit from './MemberDetailsEdit';

export default function MemberDetailsPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'view'; // Default to view mode

  // Render the appropriate component based on mode
  if (mode === 'edit') {
    return <MemberDetailsEdit />;
  }

  // Default to view mode
  return <MemberDetailsView />;
} 