import React, { useState, useEffect } from 'react';
import { api, useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  AlertCircle,
  Loader2,
  X,
  MessageSquare,
  Upload
} from 'lucide-react';

const LeaveRequests = () => {
  const { user } = useAuth();
  const isPrivileged = user?.role === 'Admin' || user?.role === 'Manager';
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [formData, setFormData] = useState({
    type: 'Sick',
    duration: 'Full Day', // 'Full Day' | 'Half Day'
    halfDaySession: 'First Half', // 'First Half' | 'Second Half'
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaves');
      if (res.data.success) {
        setLeaves(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch leave request registers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate' && formData.duration === 'Half Day') {
      setFormData(prev => ({ ...prev, startDate: value, endDate: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDurationChange = (durationMode) => {
    setFormData(prev => ({
      ...prev,
      duration: durationMode,
      endDate: durationMode === 'Half Day' ? prev.startDate : prev.endDate
    }));
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const finalType = formData.duration === 'Half Day'
      ? `Half Day (${formData.halfDaySession})`
      : formData.type;

    const leaveData = new FormData();
    leaveData.append('type', finalType);
    leaveData.append('startDate', formData.startDate);
    leaveData.append('endDate', formData.duration === 'Half Day' ? formData.startDate : formData.endDate);
    leaveData.append('reason', formData.reason);
    if (attachment) {
      leaveData.append('attachment', attachment);
    }

    try {
      const res = await api.post('/leaves', leaveData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setSuccess('Leave request applied successfully! Pending HR approval.');
        setShowApplyModal(false);
        setFormData({ type: 'Sick', duration: 'Full Day', halfDaySession: 'First Half', startDate: '', endDate: '', reason: '' });
        setAttachment(null);
        fetchLeaves();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (status) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put(`/leaves/${selectedLeave._id}/status`, {
        status,
        adminRemarks
      });
      if (res.data.success) {
        setSuccess(`Leave request successfully ${status.toLowerCase()}ed.`);
        setShowReviewModal(false);
        setSelectedLeave(null);
        setAdminRemarks('');
        fetchLeaves();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update leave request status.');
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewModal = (leave) => {
    setSelectedLeave(leave);
    setAdminRemarks(leave.adminRemarks || '');
    setShowReviewModal(true);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-2xl animate-fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wide">
            {isPrivileged ? 'Leave Approval Dashboard' : 'My Leave Registry'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isPrivileged ? 'Manage and review pending employee leave requests' : 'Apply for paid/unpaid leaves and track status'}
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Apply Leave
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
            <span>Fetching requests...</span>
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mx-auto stroke-[1.5] opacity-40 mb-2" />
            <p className="text-sm font-semibold">No leave requests found.</p>
            <p className="text-xs">Any leave applications submitted will register here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isPrivileged && <th className="px-6 py-4">Employee</th>}
                  <th className="px-6 py-4">Leave Type</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4 text-center">Attachment</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  {isPrivileged && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    
                    {isPrivileged && (
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{leave.employee?.fullName}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{leave.employee?.employeeId} • {leave.employee?.designation}</div>
                      </td>
                    )}

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{leave.type}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(leave.startDate)}</span>
                        {leave.startDate !== leave.endDate && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span>{formatDate(leave.endDate)}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-xs truncate" title={leave.reason}>
                      <span className="text-slate-600 dark:text-slate-400 text-xs">{leave.reason}</span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {leave.attachmentUrl ? (
                        <a 
                          href={leave.attachmentUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-primary-50 dark:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(leave.status)}`}>
                        {leave.status === 'Approved' ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : leave.status === 'Rejected' ? <XCircle className="w-3.5 h-3.5 shrink-0" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
                        {leave.status}
                      </span>
                    </td>

                    {isPrivileged && (
                      <td className="px-6 py-4 text-right">
                        {leave.status === 'Pending' ? (
                          <button
                            onClick={() => openReviewModal(leave)}
                            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
                          >
                            Review
                          </button>
                        ) : (
                          <button
                            onClick={() => openReviewModal(leave)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-850"
                            title="View remarks"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200">Submit Leave Application</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Leave Mode</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleDurationChange('Full Day')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      formData.duration === 'Full Day'
                        ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Full Day Leave
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDurationChange('Half Day')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      formData.duration === 'Half Day'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Half Day Leave
                  </button>
                </div>
              </div>

              {formData.duration === 'Half Day' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Half Day Shift Session</label>
                  <select
                    name="halfDaySession"
                    value={formData.halfDaySession}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    <option value="First Half" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">First Half (Morning Shift)</option>
                    <option value="Second Half" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Second Half (Afternoon Shift)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Category</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                >
                  <option value="Sick" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Sick Leave</option>
                  <option value="Casual" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Casual Leave</option>
                  <option value="Annual" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Annual Leave</option>
                  <option value="Maternity" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Maternity Leave</option>
                  <option value="Paternity" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Paternity Leave</option>
                  <option value="Unpaid" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Unpaid Leave</option>
                </select>
              </div>

              {formData.duration === 'Half Day' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Leave Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Reason for Leave</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Detail the reason for your leave request..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Supporting Document (Optional)</label>
                <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                  <span className="text-xs text-slate-500">{attachment ? attachment.name : 'Upload PDF or image (Max 5MB)'}</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-primary-500/10"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200">Review Leave Request</h3>
              <button onClick={() => { setShowReviewModal(false); setSelectedLeave(null); }} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-400">Employee:</span>
                  <span className="font-bold text-slate-850 dark:text-slate-200">{selectedLeave.employee?.fullName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-400">Leave Type:</span>
                  <span className="font-bold text-slate-850 dark:text-slate-200">{selectedLeave.type}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-400">Duration:</span>
                  <span className="font-bold text-slate-850 dark:text-slate-200">
                    {formatDate(selectedLeave.startDate)} {selectedLeave.startDate !== selectedLeave.endDate ? `- ${formatDate(selectedLeave.endDate)}` : ''}
                  </span>
                </div>
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-2 text-xs">
                  <span className="font-semibold text-slate-400 block mb-1">Reason:</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">{selectedLeave.reason}</p>
                </div>
                {selectedLeave.attachmentUrl && (
                  <div className="pt-2">
                    <a 
                      href={selectedLeave.attachmentUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-bold text-xs hover:bg-primary-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download attachment document
                    </a>
                  </div>
                )}
              </div>

              {selectedLeave.status === 'Pending' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Admin Remarks</label>
                    <textarea
                      value={adminRemarks}
                      onChange={(e) => setAdminRemarks(e.target.value)}
                      rows="2"
                      placeholder="Add any remarks or instructions..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleReviewSubmit('Rejected')}
                      disabled={submitting}
                      className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 dark:border-red-900/30 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleReviewSubmit('Approved')}
                      disabled={submitting}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/10 transition-colors"
                    >
                      Approve Leave
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Reviewed By:</span>
                    <span className="font-bold text-slate-850 dark:text-slate-200">{selectedLeave.approvedBy?.fullName || 'System'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Remarks:</span>
                    <span className="font-bold text-slate-850 dark:text-slate-200">{selectedLeave.adminRemarks || 'No remarks added'}</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeaveRequests;
