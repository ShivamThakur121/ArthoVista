import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import { 
  Calendar, 
  Search, 
  Mail, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  Users,
  AlertCircle
} from 'lucide-react';

const Reports = () => {
  // Default date range: 1st of current month to today
  const getInitialDates = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    return {
      start: formatDate(firstDay),
      end: formatDate(today)
    };
  };

  const initialDates = getInitialDates();
  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [search, setSearch] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendingEmailId, setSendingEmailId] = useState(null);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.get(`/dashboard/attendance-report?startDate=${startDate}&endDate=${endDate}`);
      if (res.data.success) {
        setReportData(res.data.data);
      } else {
        setError('Failed to retrieve report data.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while generating report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleSendWarningEmail = async (employeeId, name) => {
    setSendingEmailId(employeeId);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/dashboard/send-warning-email', { employeeId });
      if (res.data.success) {
        setSuccess(`Short attendance email warning successfully sent to ${name}.`);
      } else {
        setError(res.data.message || 'Failed to send warning email.');
      }
    } catch (err) {
      console.error(err);
      setError('Error occurred while sending warning email.');
    } finally {
      setSendingEmailId(null);
    }
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) return;

    // Headers
    const headers = ['Employee Name', 'Employee ID', 'Email', 'Department', 'Designation', 'Days Present', 'Days Absent', 'Late Days', 'Half Days', 'Leaves', 'Attendance %'];
    
    // Rows
    const rows = filteredData.map(row => [
      row.employee.fullName,
      row.employee.employeeId,
      row.employee.email,
      row.employee.department,
      row.employee.designation,
      row.presentDays,
      row.absentDays,
      row.lateDays,
      row.halfDays,
      row.leaveDays,
      `${row.attendancePercentage}%`
    ]);

    // CSV construction
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = reportData.filter(row => {
    const term = search.toLowerCase();
    return (
      row.employee.fullName.toLowerCase().includes(term) ||
      row.employee.employeeId.toLowerCase().includes(term) ||
      row.employee.department.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Custom Date Range Attendance Report</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Generate and export employee attendance sheets for customized timelines.</p>
        </div>
        
        {reportData.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/10 active:scale-[0.98] transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export to CSV
          </button>
        )}
      </div>

      {/* Date Selectors & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Start Date</label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">End Date</label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>
        </div>

        <div className="relative flex-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Filter Employees</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>
        </div>

        <button
          onClick={fetchReport}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-primary-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              Generate Report
            </>
          )}
        </button>
      </div>

      {/* Alert Messages */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-2xl animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-2xl animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <span className="mt-2 text-xs font-medium">Computing attendance metrics...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Users className="w-12 h-12 mx-auto stroke-[1.5] mb-2 opacity-50" />
            <p className="text-sm font-semibold">No attendance report records generated.</p>
            <p className="text-xs">Adjust your date range or filters above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department & Role</th>
                  <th className="px-6 py-4 text-center">Present</th>
                  <th className="px-6 py-4 text-center">Absent</th>
                  <th className="px-6 py-4 text-center">Late</th>
                  <th className="px-6 py-4 text-center">Leaves</th>
                  <th className="px-6 py-4 text-center">Attendance %</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredData.map((row) => {
                  const isShort = row.attendancePercentage < 75;
                  return (
                    <tr key={row.employee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{row.employee.fullName}</p>
                          <p className="font-mono text-[9px] text-slate-400 uppercase mt-0.5">{row.employee.employeeId}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700 dark:text-slate-300">{row.employee.department}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{row.employee.designation}</p>
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {row.presentDays}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-rose-600 dark:text-rose-400">
                        {row.absentDays}
                      </td>

                      <td className="px-6 py-4 text-center text-amber-600 dark:text-amber-400">
                        {row.lateDays}
                      </td>

                      <td className="px-6 py-4 text-center text-purple-600 dark:text-purple-400">
                        {row.leaveDays}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`font-bold ${isShort ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {row.attendancePercentage}%
                          </span>
                          {isShort && (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" title="Short Attendance Warning" />
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isShort ? (
                          <button
                            onClick={() => handleSendWarningEmail(row.employee.id, row.employee.fullName)}
                            disabled={sendingEmailId === row.employee.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-[10px] border border-red-100 dark:border-red-900/30 transition-colors disabled:opacity-50"
                          >
                            <Mail className="w-3 h-3" />
                            {sendingEmailId === row.employee.id ? 'Sending...' : 'Send Alert'}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Satisfactory</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Reports;
