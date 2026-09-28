import React from 'react';
import { Certificate, Course } from '../../types';
import { Award, CheckCircle, X, Download } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  course: Course;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  course,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-8 border-amber-100 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 pt-4">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-full mx-auto flex items-center justify-center shadow-lg shadow-amber-200">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">Certificate of Completion</span>
          <h2 className="text-2xl font-extrabold text-slate-900">EduSphere Academy</h2>
          <p className="text-xs text-slate-500">This is proudly presented to</p>
          <h3 className="text-3xl font-serif font-bold text-indigo-900 italic py-1">{certificate.userName}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            for successfully mastering the comprehensive curriculum and rigorous requirements of
          </p>
          <h4 className="text-lg font-bold text-slate-800">{certificate.courseTitle}</h4>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-slate-100 text-xs text-slate-600">
          <div>
            <p className="font-bold text-slate-800">{certificate.instructorName}</p>
            <p className="text-[10px] text-slate-400">Course Instructor</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-800">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
            <p className="text-[10px] text-slate-400">Issue Date</p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all inline-flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download / Print Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
