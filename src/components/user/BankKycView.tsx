import React from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import {
  Landmark,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { DocumentStatus } from '../../types';

export const BankKycView: React.FC = () => {
  const { currentUser, refreshAllData, showToast, setIsAuthModalOpen, setAuthMode } = useApp();

  if (!currentUser) {
    return (
      <div className="space-y-4 pb-20 pt-1">
        <div className="px-1">
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-display">
            Bank Account & KYC
          </h2>
          <p className="text-xs text-blue-200/70 mt-0.5">
            Regional banking verification and identity compliance
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#0B3B7A] via-[#071833] to-[#050E1D] border-2 border-[#1E40AF] p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#050E1D] border border-[#38BDF8]/40 mx-auto flex items-center justify-center text-[#38BDF8]">
            <Landmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Login Required for Bank & KYC</h3>
            <p className="text-xs text-blue-200/70 max-w-xs mx-auto mt-1">
              Please log in or register to link your bank account and submit identity documents.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 max-w-xs mx-auto pt-2">
            <button
              onClick={() => {
                setAuthMode('LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer hover:brightness-110"
            >
              Login
            </button>
            <button
              onClick={() => {
                setAuthMode('REGISTER');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#071833] border border-[#1E40AF] text-[#38BDF8] font-bold text-xs uppercase tracking-wider hover:bg-[#0A224E] cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSimulateUpload = (
    docType: 'identityProof' | 'bankPassbook' | 'addressProof',
    defaultName: string
  ) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      const fileName = file ? file.name : defaultName;

      dbService.uploadKYCMetadata({
        userId: currentUser.id,
        docType,
        fileName,
      });
      refreshAllData();
      showToast(`Uploaded ${fileName}! Status: PENDING REVIEW`, 'success');
    };
    input.click();
  };

  const getStatusBadge = (status?: DocumentStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>VERIFIED</span>
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#1D4ED8]/30 text-[#38BDF8] border border-[#38BDF8]/60 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>PENDING REVIEW</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-950/80 text-red-300 border border-red-700 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>REJECTED</span>
          </span>
        );
      case 'NOT_UPDATED':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#071833] text-blue-200/60 border border-[#1E40AF]">
            NOT UPDATED
          </span>
        );
    }
  };

  const kycDocs = [
    {
      type: 'identityProof' as const,
      label: 'Identity Proof',
      desc: 'National ID, Civil ID, Passport or Driving License',
      doc: currentUser.kycDocuments?.identityProof,
      defaultName: 'identity_doc.pdf',
    },
    {
      type: 'bankPassbook' as const,
      label: 'Bank Passbook / Statement',
      desc: 'Account statement or cancelled cheque showing IBAN',
      doc: currentUser.kycDocuments?.bankPassbook,
      defaultName: 'bank_statement.pdf',
    },
    {
      type: 'addressProof' as const,
      label: 'Address Proof',
      desc: 'Utility bill, residency permit or tenancy contract',
      doc: currentUser.kycDocuments?.addressProof,
      defaultName: 'residence_proof.pdf',
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8] font-display">
          Bank Account & KYC
        </h2>
        <p className="text-xs text-blue-200/70 mt-0.5">
          Registered payout credentials and compliance verification documents
        </p>
      </div>

      {/* Locked Bank Account Card (User Unable to Change) */}
      <div className="rounded-3xl bg-[#071833]/90 border border-[#1E40AF]/60 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E40AF]/40">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-bold text-white">Registered Payout Bank Account</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>PERMANENTLY LOCKED</span>
          </span>
        </div>

        {/* Security / Immutability Notice */}
        <div className="p-3 rounded-2xl bg-[#050E1D] border border-[#1E40AF]/50 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
          <div className="text-xs text-blue-200/80 leading-relaxed">
            <strong className="text-white block mb-0.5">Immutable Bank Credentials</strong>
            Bank account and personal details registered during account creation are locked and cannot be changed by the user. This ensures all lottery payouts are strictly dispatched to the verified account holder.
          </div>
        </div>

        {/* Read-only Bank Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-[#050E1D] border border-[#1E40AF]/60 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-blue-200/60 font-semibold block">
              Account Holder Name
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                {currentUser.bankDetails.accountHolder || currentUser.fullName}
              </span>
              <Lock className="w-3 h-3 text-blue-400/70" />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#050E1D] border border-[#1E40AF]/60 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-blue-200/60 font-semibold block">
              Bank Name
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                {currentUser.bankDetails.bankName || 'Registered Bank'}
              </span>
              <Lock className="w-3 h-3 text-blue-400/70" />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#050E1D] border border-[#1E40AF]/60 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-blue-200/60 font-semibold block">
              Account Number / IBAN
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">
                {currentUser.bankDetails.accountNumberOrIban || '•••• •••• ••••'}
              </span>
              <Lock className="w-3 h-3 text-blue-400/70" />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#050E1D] border border-[#1E40AF]/60 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-blue-200/60 font-semibold block">
              IFSC / SWIFT Code
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-200">
                {currentUser.bankDetails.ifscOrSwift || 'REGISTERED'}
              </span>
              <Lock className="w-3 h-3 text-blue-400/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="rounded-3xl bg-[#071833]/90 border border-[#1E40AF]/60 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E40AF]/40">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-bold text-white">KYC Documents Verification</h3>
          </div>
          <span className="text-[10px] text-[#38BDF8] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Vault</span>
          </span>
        </div>

        <div className="space-y-3">
          {kycDocs.map((item) => {
            const status = item.doc?.status || 'NOT_UPDATED';
            return (
              <div
                key={item.type}
                className="p-3.5 rounded-2xl bg-[#050E1D] border border-[#1E40AF]/60 flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.label}</h4>
                    <p className="text-[11px] text-blue-200/60 mt-0.5">{item.desc}</p>
                  </div>
                  {getStatusBadge(status)}
                </div>

                {item.doc && (
                  <div className="p-2 rounded-xl bg-[#071833]/60 border border-[#1E40AF]/40 text-[11px] text-blue-200/80 flex justify-between items-center">
                    <span className="font-mono truncate">{item.doc.fileName}</span>
                    <span className="text-[10px] text-[#38BDF8] font-semibold uppercase tracking-wider ml-2">
                      SUBMITTED
                    </span>
                  </div>
                )}

                {item.doc?.notes && (
                  <div className="text-[11px] text-sky-200/90 italic">
                    Note: {item.doc.notes}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleSimulateUpload(item.type, item.defaultName)}
                  className="py-2 px-3 rounded-xl bg-[#0B3B7A] hover:bg-[#1D4ED8] border border-[#38BDF8]/40 text-blue-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{item.doc ? 'Replace Document' : 'Upload Document'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
