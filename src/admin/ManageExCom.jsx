import React, { useEffect, useRef, useState } from 'react';
import { getExComMembers, deleteExComMember, addExComMember, updateExComMember } from '../services/excomService';
import { compressImage } from '../services/galleryService';
import Loader from '../components/Loader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotification } from '../context/NotificationContext';
import { Icon } from '@iconify/react';
import { excomData as mockData } from '../utils/excomData';

export default function ManageExCom() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { showToast } = useNotification();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    year: '',
    image: '',
    isTop: false,
    isCurrent: false,
    type: 'card', // card or table
    postType: 'member' // 'member' or 'group' (group = poster for whole committee/year)
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const revokePreviewUrls = (urls) => {
    urls.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  };

  const applyFiles = (files) => {
    const imageFiles = Array.from(files || []).filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    revokePreviewUrls(previewUrls);
    setSelectedFiles(imageFiles);
    setPreviewUrls(imageFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleFileChange = (e) => applyFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyFiles(e.dataTransfer.files);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    revokePreviewUrls(previewUrls);
    setPreviewUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      revokePreviewUrls(previewUrls);
    };
  }, [previewUrls]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getExComMembers();
      if (data.length === 0) {
        // Fallback to mock data if Firestore is empty
        // In a real scenario, you might want to seed Firestore with mock data once
        setMembers([]); 
      } else {
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      showToast('Failed to fetch members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        position: member.position || '',
        year: member.year || '',
        image: member.image || '',
        isTop: member.isTop || false,
        isCurrent: member.isCurrent || false,
        type: member.type || 'card',
        postType: member.postType || 'member'
      });
      setPreviewUrls(member.image ? [member.image] : []);
      setSelectedFiles([]);
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        position: '',
        year: '',
        image: '',
        isTop: false,
        isCurrent: false,
        type: 'card',
        postType: 'member'
      });
      clearFiles();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation: different rules for member vs group poster
    if (formData.postType === 'member') {
      if (!formData.name.trim()) {
        showToast('Name is required', 'error');
        return;
      }
      if (!formData.position.trim()) {
        showToast('Position is required', 'error');
        return;
      }
    }
    if (!formData.year.trim()) {
      showToast('Year is required', 'error');
      return;
    }
    if (formData.postType === 'group' && selectedFiles.length === 0 && !formData.image) {
      showToast('Please upload at least one image for the group poster', 'error');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const filesToUpload = formData.postType === 'group' && !editingMember && selectedFiles.length > 1
        ? selectedFiles
        : selectedFiles.slice(0, 1);

      const uploadSingleRecord = async (file, index = 0, total = 1) => {
        let imageData = formData.image;

        if (file) {
          imageData = await compressImage(file, (fileProgress) => {
            const weightedProgress = Math.min(98, Math.round(((index + (fileProgress / 100)) / total) * 100));
            setProgress(weightedProgress);
          });
        }

        const submitData = {
          ...formData,
          image: imageData,
          postType: formData.postType === 'group' ? 'group' : 'member',
          type: formData.postType === 'group' ? 'poster' : formData.type,
          name: formData.postType === 'group'
            ? (formData.name.trim() || 'Committee Poster') + (total > 1 ? ` ${index + 1}` : '')
            : formData.name,
          position: formData.postType === 'group'
            ? (formData.position.trim() || 'Group Poster')
            : formData.position,
        };

        if (editingMember && index === 0) {
          await updateExComMember(editingMember.id, submitData);
        } else {
          await addExComMember(submitData);
        }
      };

      if (editingMember || filesToUpload.length <= 1) {
        await uploadSingleRecord(filesToUpload[0], 0, 1);
        showToast(editingMember ? 'Member updated successfully' : 'Member added successfully', 'success');
      } else {
        for (let index = 0; index < filesToUpload.length; index += 1) {
          await uploadSingleRecord(filesToUpload[index], index, filesToUpload.length);
        }
        showToast(`${filesToUpload.length} posters added successfully`, 'success');
      }
      
      setProgress(100);
      setShowModal(false);
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      showToast('Failed to save member', 'error');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExComMember(confirmDeleteId);
      showToast('Member deleted successfully', 'success');
      setConfirmDeleteId(null);
      fetchMembers();
    } catch (error) {
      showToast('Failed to delete member', 'error');
    }
  };

  if (loading) return <Loader />;

  // Group members by year for display
  const years = [...new Set(members.map(m => m.year))].sort().reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">Manage Executive Committee</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {members.length} member{members.length !== 1 ? 's' : ''} across {years.length} year{years.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95"
        >
          <Icon icon="mdi:plus" className="h-5 w-5" />
          Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
           <Icon icon="mdi:account-group-outline" className="mx-auto h-14 w-14 text-purple-400" />
           <p className="mt-4 text-sm font-semibold text-gray-700">No members found in Firestore</p>
           <p className="mt-1 text-xs text-gray-400">Add members to populate the Executive Committee page</p>
        </div>
      ) : (
        <div className="space-y-12">
          {years.map(year => {
            const groupPosts = members.filter(m => m.year === year && m.postType === 'group');
            const regularMembers = members.filter(m => m.year === year && m.postType !== 'group');
            return (
              <div key={year} className="space-y-4">
                <h2 className="text-lg font-bold text-gray-700 border-l-4 border-purple-500 pl-3">{year}</h2>

                {groupPosts.length > 0 && (
                  <div className="space-y-3">
                    {groupPosts.map(post => (
                      <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img src={post.image || 'https://via.placeholder.com/600x200'} alt={post.name || 'Committee Poster'} className="h-28 object-contain" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{post.name || 'Committee Poster'}</h3>
                            <p className="text-xs text-gray-500">Group poster for {year}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenModal(post)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                            <Icon icon="mdi:pencil-outline" width={18} />
                          </button>
                          <button onClick={() => setConfirmDeleteId(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Icon icon="mdi:delete-outline" width={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {regularMembers.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regularMembers.map(member => (
                      <div key={member.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex items-center gap-4 group">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 border-2 border-purple-50">
                          <img 
                            src={member.image || 'https://via.placeholder.com/150'} 
                            alt={member.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                          <p className="text-xs text-purple-600 font-medium">{member.position}</p>
                          <div className="mt-1 flex gap-1 flex-wrap">
                            {member.isTop && <span className="text-[10px] bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full inline-block uppercase font-bold">Top Position</span>}
                            {member.isCurrent && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full inline-block uppercase font-bold">Current</span>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(member)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Icon icon="mdi:pencil-outline" width={18} />
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(member.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Icon icon="mdi:delete-outline" width={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{editingMember ? (formData.postType === 'group' ? 'Edit Group Poster' : 'Edit Member') : (formData.postType === 'group' ? 'Add Group Poster' : 'Add New Member')}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <Icon icon="mdi:close" width={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Post Type</label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="postType"
                        value="member"
                        checked={formData.postType === 'member'}
                        onChange={() => setFormData({...formData, postType: 'member'})}
                        className="h-4 w-4"
                      />
                      Individual Member
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="postType"
                        value="group"
                        checked={formData.postType === 'group'}
                        onChange={() => setFormData({...formData, postType: 'group'})}
                        className="h-4 w-4"
                      />
                      Group Poster (whole committee)
                    </label>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                  <input
                    required={formData.postType === 'member'}
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm focus:border-purple-500 focus:bg-white outline-none transition-all"
                    placeholder={formData.postType === 'group' ? 'Optional title for poster (e.g. Committee 2024/25)' : 'e.g. Dr. Janaki Jereena'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Position</label>
                  <input
                    required={formData.postType === 'member'}
                    type="text"
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm focus:border-purple-500 focus:bg-white outline-none transition-all"
                    placeholder={formData.postType === 'group' ? 'Optional (ignored for group posters)' : 'e.g. Chairperson'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Year</label>
                  <input
                    required
                    type="text"
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: e.target.value})}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm focus:border-purple-500 focus:bg-white outline-none transition-all"
                    placeholder="e.g. 2025/2026"
                  />
                </div>
                
                {/* Image Upload */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Profile Image</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {previewUrls.length > 0 ? (
                      <div className="space-y-3">
                        <div className={previewUrls.length > 1 ? 'grid grid-cols-2 gap-3' : ''}>
                          {previewUrls.map((previewUrl, index) => (
                            <img
                              key={previewUrl}
                              src={previewUrl}
                              alt={`Preview ${index + 1}`}
                              className="w-24 h-24 rounded-lg object-cover mx-auto border border-gray-200"
                            />
                          ))}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-semibold text-purple-600 hover:text-purple-700 underline"
                          >
                            {formData.postType === 'group' && !editingMember ? 'Change Posters' : 'Change Image'}
                          </button>
                          <span className="text-xs text-gray-400 mx-2">or</span>
                          <button
                            type="button"
                            onClick={clearFiles}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer"
                      >
                        <Icon icon="mdi:cloud-upload-outline" className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">
                          {formData.postType === 'group' && !editingMember ? 'Drop posters here or click to browse' : 'Drop image here or click to browse'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple={formData.postType === 'group' && !editingMember}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  {progress > 0 && progress < 100 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isTop"
                    checked={formData.isTop}
                    onChange={e => setFormData({...formData, isTop: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isTop" className="text-sm font-medium text-gray-700">Top Position (Chairperson)</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onChange={e => setFormData({...formData, isCurrent: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700">Current Committee</label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    clearImage();
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                  {uploading ? `Uploading... ${progress}%` : (editingMember ? (formData.postType === 'group' ? 'Update Poster' : 'Update Member') : (formData.postType === 'group' ? 'Add Poster' : 'Add Member'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmDeleteId)}
        title="Delete Member"
        message="Are you sure you want to remove this member from the Executive Committee?"
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
