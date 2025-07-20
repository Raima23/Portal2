import React, { useState, useEffect, useContext, useMemo } from 'react';
import Header from './components/Header';
import EnquiryForm from './components/EnquiryForm';
import EnquiriesTable from './components/EnquiriesTable';
import AdmissionsTable from './components/AdmissionsTable';
import FollowUpModal from './components/FollowUpModal';
import CentreSelection from './components/CentreSelection';
import AdmissionModal from './components/AdmissionModal';
import CertificateModal from './components/CertificateModal';
import RescheduleModal from './components/RescheduleModal';
import Login from './components/Login';
import { EnquiryContext } from './context/EnquiryContext';
import { AuthContext } from './context/AuthContext';
import { Enquiry, Centre, EnquiryStatus, FollowUp } from './types';
import { isToday } from './utils/dateUtils';

type ModalType = 'admission' | 'certificate' | 'reschedule';

function App() {
  const { enquiries, updateEnquiry, loading } = useContext(EnquiryContext);
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);

  const [selectedCentre, setSelectedCentre] = useState<Centre | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  
  const [modalState, setModalState] = useState<{
    type: ModalType | null;
    enquiry: Enquiry | null;
  }>({ type: null, enquiry: null });
  
  const { activeEnquiries, admittedEnquiries, todaysFollowUps } = useMemo(() => {
    if (!isAuthenticated) return { activeEnquiries: [], admittedEnquiries: [], todaysFollowUps: [] };
    const active: Enquiry[] = [];
    const admitted: Enquiry[] = [];
    enquiries.forEach(e => {
        if (e.status === EnquiryStatus.ADMISSION_DONE) {
            admitted.push(e);
        } else {
            active.push(e);
        }
    });
    const followUps = active.filter(e => {
        if (e.status !== EnquiryStatus.FOLLOW_UP || !e.followUpHistory || e.followUpHistory.length === 0) {
            return false;
        }
        const lastFollowUpDate = e.followUpHistory[e.followUpHistory.length - 1].date;
        return lastFollowUpDate && isToday(new Date(lastFollowUpDate));
    });
    return { activeEnquiries: active, admittedEnquiries: admitted, todaysFollowUps: followUps };
  }, [enquiries, isAuthenticated]);


  useEffect(() => {
    if (isAuthenticated && !loading && todaysFollowUps.length > 0) {
      setShowFollowUpModal(true);
    }
  }, [todaysFollowUps, isAuthenticated, loading]);

  const handleOpenModal = (type: ModalType, enquiry: Enquiry) => {
    setModalState({ type, enquiry });
    setShowFollowUpModal(false); // Close follow-up modal if another action is taken
  };

  const handleCloseModal = () => {
    setModalState({ type: null, enquiry: null });
  };
  
  const handleSaveAdmission = async (enquiry: Enquiry, details: { admissionDate: string, fees: number, receiptNo: string }) => {
    await updateEnquiry({ ...enquiry, status: EnquiryStatus.ADMISSION_DONE, admissionDetails: details, followUpHistory: undefined });
    handleCloseModal();
  };

  const handleSaveCertificate = async (enquiry: Enquiry, details: { issueDate: string, certificateNo: string }) => {
    await updateEnquiry({ ...enquiry, certificateDetails: details });
    handleCloseModal();
  };
  
  const handleSaveReschedule = async (enquiry: Enquiry, details: { followUpDate: string, remarks: string }) => {
     const newFollowUp: FollowUp = { date: details.followUpDate, remarks: details.remarks };
     const updatedHistory = [...(enquiry.followUpHistory || []), newFollowUp];
     await updateEnquiry({ 
         ...enquiry, 
         status: EnquiryStatus.FOLLOW_UP, 
         followUpHistory: updatedHistory 
     });
     handleCloseModal();
  };

  const handleSelectCentre = (centre: Centre) => {
    setSelectedCentre(centre);
  }

  const handleLogout = () => {
    setSelectedCentre(null);
    logout();
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!selectedCentre) {
    return <CentreSelection onSelectCentre={handleSelectCentre} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <svg className="w-20 h-20 text-osi-blue animate-spin mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h1 className="text-2xl font-bold text-osi-blue mt-4">Loading Data...</h1>
        <p className="text-gray-600 mt-2">Please wait while we fetch the latest enquiries.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header centre={selectedCentre} userRole={userRole} onLogout={handleLogout} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <EnquiryForm centre={selectedCentre} />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <EnquiriesTable enquiries={activeEnquiries} onOpenModal={handleOpenModal} />
              <AdmissionsTable enquiries={admittedEnquiries} onOpenModal={handleOpenModal} />
            </div>
          </div>
        </div>
      </main>
      
      {showFollowUpModal && (
        <FollowUpModal
          enquiries={todaysFollowUps}
          onClose={() => setShowFollowUpModal(false)}
          onOpenModal={handleOpenModal}
        />
      )}

      {modalState.type === 'admission' && modalState.enquiry && (
        <AdmissionModal
            enquiry={modalState.enquiry}
            onClose={handleCloseModal}
            onSave={handleSaveAdmission}
        />
      )}

      {modalState.type === 'certificate' && modalState.enquiry && (
        <CertificateModal
            enquiry={modalState.enquiry}
            onClose={handleCloseModal}
            onSave={handleSaveCertificate}
        />
      )}
      
      {modalState.type === 'reschedule' && modalState.enquiry && (
        <RescheduleModal
            enquiry={modalState.enquiry}
            onClose={handleCloseModal}
            onSave={handleSaveReschedule}
        />
      )}
    </div>
  );
}

export default App;