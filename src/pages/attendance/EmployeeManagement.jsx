import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, useAuth } from '../../context/AuthContext';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  Building,
  Mail,
  Phone,
  X,
  Loader2,
  AlertCircle,
  Users,
  Eye,
  ShieldCheck,
  Calendar,
  Building2
} from 'lucide-react';

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [selectedProfileEmp, setSelectedProfileEmp] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    password: '',
    phone: '',
    role: 'Employee',
    department: '',
    designation: '',
    joiningDate: '',
    status: 'Active',
    address: ''
  });

  const fetchData = async (refreshDept = false) => {
    setLoading(true);
    setError('');
    try {
      if (departments.length === 0 || refreshDept) {
        const [deptRes, empRes] = await Promise.all([
          api.get('/departments'),
          api.get(`/employees?search=${search}&department=${deptFilter}`)
        ]);
        if (deptRes.data.success) {
          setDepartments(deptRes.data.data);
        }
        if (empRes.data.success) {
          setEmployees(
            empRes.data.data.filter(
              emp => emp.role !== 'Admin' && emp.email?.toLowerCase() !== 'shivamthakur12012@gmail.com' && emp.employeeId !== 'ADMIN001'
            )
          );
        }
      } else {
        const empRes = await api.get(`/employees?search=${search}&department=${deptFilter}`);
        if (empRes.data.success) {
          setEmployees(
            empRes.data.data.filter(
              emp => emp.role !== 'Admin' && emp.email?.toLowerCase() !== 'shivamthakur12012@gmail.com' && emp.employeeId !== 'ADMIN001'
            )
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, deptFilter]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/employees', formData);
      if (res.data.success) {
        setSuccessMsg(`Employee ${res.data.data.fullName} registered successfully!`);
        setShowAddModal(false);
        resetForm();
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (employee) => {
    if (
      employee.role === 'Admin' ||
      employee.email?.toLowerCase() === 'shivamthakur12012@gmail.com' ||
      employee.employeeId === 'ADMIN001'
    ) {
      setError('System Administrator profile (shivamthakur12012@gmail.com) is permanently protected and cannot be edited.');
      return;
    }
    setActiveEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      employeeId: employee.employeeId,
      email: employee.email,
      password: '',
      phone: employee.phone || '',
      role: employee.role,
      department: employee.department?._id || '',
      designation: employee.designation || '',
      joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : '',
      status: employee.status,
      address: employee.address || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.put(`/employees/${activeEmployee._id}`, formData);
      if (res.data.success) {
        setSuccessMsg(`Employee details updated successfully!`);
        setShowEditModal(false);
        resetForm();
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the profile of ${name}?`)) {
      setError('');
      setSuccessMsg('');
      try {
        const res = await api.delete(`/employees/${id}`);
        if (res.data.success) {
          setSuccessMsg(`Profile of ${name} deleted successfully.`);
          fetchData();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete employee.');
      }
    }
  };

  const handlePhotoUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('photo', file);

    setSubmitting(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.post(`/employees/${id}/photo`, fileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setSuccessMsg('Profile photo updated successfully!');
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      employeeId: '',
      email: '',
      password: '',
      phone: '',
      role: 'Employee',
      department: '',
      designation: '',
      joiningDate: '',
      status: 'Active',
      address: ''
    });
    setActiveEmployee(null);
  };

  return (
    <div className="space-y-6">

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="ml-auto p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>

          {user?.role === 'Admin' && (
            <button
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-primary-500/10 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400 space-y-3 animate-fadeIn">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              </div>
              <Loader2 className="w-14 h-14 animate-spin text-primary-500 absolute -inset-1 opacity-70" />
            </div>
            <div className="text-center space-y-0.5">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">Loading Employees Directory</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Synchronizing staff roster, biometrics status & departments...</span>
            </div>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users className="w-12 h-12 mx-auto stroke-[1.5] mb-2" />
            <p className="text-sm font-semibold">No employees found.</p>
            <p className="text-xs">Try adjusting your filters or add a new record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Biometrics</th>
                  {user?.role === 'Admin' && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {employees
                  .filter((emp) => emp.role !== 'Admin' && emp.email?.toLowerCase() !== 'shivamthakur12012@gmail.com' && emp.employeeId !== 'ADMIN001')
                  .map((emp) => (
                    <tr key={emp._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative group cursor-pointer w-10 h-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 font-bold border border-slate-200 dark:border-slate-700 overflow-hidden">
                            {emp.profilePhoto ? (
                              <img src={emp.profilePhoto} alt={emp.fullName} className="w-full h-full object-cover" />
                            ) : (
                              emp.fullName.charAt(0).toUpperCase()
                            )}
                            {user?.role === 'Admin' && (
                              <label className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Upload className="w-3.5 h-3.5 text-white" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePhotoUpload(e, emp._id)}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{emp.fullName}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-500 uppercase">{emp.employeeId}</span>
                              <span>•</span>
                              <span className="capitalize">{emp.role}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {emp.email}</div>
                          {emp.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {emp.phone}</div>}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {emp.department?.name || 'Unassigned'}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{emp.designation || 'Staff'}</div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                          {emp.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {emp.role === 'Admin' || emp.email?.toLowerCase() === 'shivamthakur12012@gmail.com' || emp.employeeId === 'ADMIN001' ? (
                          <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            Exempt (Admin)
                          </span>
                        ) : emp.hasBiometrics || emp.faceEmbeddingsCount > 0 || (emp.faceEmbeddings && emp.faceEmbeddings.length > 0) ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            Enrolled {emp.faceEmbeddingsCount > 0 ? `(${emp.faceEmbeddingsCount})` : ''}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                            <XCircle className="w-4 h-4 shrink-0" />
                            Not Enrolled
                          </span>
                        )}
                      </td>

                      {user?.role === 'Admin' && (
                        <td className="px-6 py-4 text-right">
                          {emp.role === 'Admin' || emp.email?.toLowerCase() === 'shivamthakur12012@gmail.com' || emp.employeeId === 'ADMIN001' ? (
                            <div className="flex items-center justify-end">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                Permanent Admin
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedProfileEmp(emp)}
                                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all"
                                title="View Full Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/admin/employees/enroll/${emp._id}`)}
                                className="p-2 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 border border-transparent hover:border-primary-100 dark:hover:border-primary-900/30 transition-all"
                                title="Enroll Webcam Face"
                              >
                                <Camera className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(emp)}
                                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                title="Edit Details"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(emp._id, emp.fullName)}
                                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                title="Delete Employee"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {showAddModal ? 'Register New Employee' : 'Edit Employee Profile'}
              </h3>
              <button
                onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                    disabled={showEditModal}
                    autoComplete="off"
                    placeholder="e.g. EMP045"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">
                    {showAddModal ? 'Initial Password' : 'Change Password (Leave blank to keep)'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={showAddModal}
                    autoComplete="new-password"
                    placeholder={showEditModal ? '••••••••' : 'Password (min 6 characters)'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">System Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    <option value="Employee" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Employee</option>
                    <option value="Manager" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    <option value="IT Department" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">IT Department</option>
                    <option value="Operation" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Operation</option>
                    <option value="Sale" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Sale</option>
                    <option value="Executive" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Executive</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="e.g. Senior Developer"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Date of Joining</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Profile Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Active</option>
                    <option value="Inactive" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Residential Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Address details..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-primary-500/10 hover:shadow-primary-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {showAddModal ? 'Submit Profile' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Dedicated Employee Profile View Modal */}
      {selectedProfileEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 animate-scaleUp">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center font-bold text-lg text-white">
                    {selectedProfileEmp.profilePhoto ? (
                      <img src={selectedProfileEmp.profilePhoto} alt={selectedProfileEmp.fullName} className="w-full h-full object-cover" />
                    ) : (
                      selectedProfileEmp.fullName?.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedProfileEmp.fullName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedProfileEmp.employeeId} • <span className="capitalize">{selectedProfileEmp.role}</span></p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfileEmp(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{selectedProfileEmp.email}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Contact Phone</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{selectedProfileEmp.phone || 'Not provided'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{selectedProfileEmp.department?.name || 'Unassigned'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Designation</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{selectedProfileEmp.designation || 'Staff'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Shift Timing</span>
                <p className="font-bold text-indigo-600 dark:text-indigo-400">10:00 AM – 06:00 PM (Mon-Sat)</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Biometric Status</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {selectedProfileEmp.hasBiometrics || selectedProfileEmp.faceEmbeddingsCount > 0 || selectedProfileEmp.faceEmbeddings?.length > 0 ? `Enrolled (${selectedProfileEmp.faceEmbeddingsCount || selectedProfileEmp.faceEmbeddings?.length || 1} frames)` : 'Not Enrolled'}
                </p>
              </div>
            </div>

            {selectedProfileEmp.address && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Residential Address</span>
                <p className="text-slate-700 dark:text-slate-300">{selectedProfileEmp.address}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedProfileEmp(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeManagement;
