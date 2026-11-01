import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFileUpload from '../api/fileUploadService';
import './FilePage.css';

const FilePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fileName: '',
    file: null,
    fileType: 'DOCUMENT'
  });
  const { uploadFile } = useFileUpload();

  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}/files`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [projectId, getAuthHeaders]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      setError('Please select a file to upload');
      return;
    }
    try {
      await uploadFile(projectId, formData.file);
      fetchFiles();
      setFormData({ fileName: '', file: null, fileType: 'DOCUMENT' });
      setShowForm(false);
    } catch (err) {
      setError('Failed to upload file');
    }
  };

  const deleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/projects/${projectId}/files/${fileId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          fetchFiles();
        }
      } catch (err) {
        setError('Failed to delete file');
      }
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'IMAGE':
        return (
          <div className="file-type-icon-wrap icon-image">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        );
      case 'VIDEO':
        return (
          <div className="file-type-icon-wrap icon-video">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          </div>
        );
      case 'AUDIO':
        return (
          <div className="file-type-icon-wrap icon-audio">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
        );
      default:
        return (
          <div className="file-type-icon-wrap icon-doc">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="file-page">
        <div className="file-state-wrap">
          <div className="file-spinner"></div>
          <p className="loading">Loading files for project {projectId}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="file-page animate-fade-in">
      <button className="file-back-btn" onClick={() => navigate(`/projects/${projectId}`)}>
        ← Back to Project #{projectId}
      </button>

      <div className="file-header">
        <div>
          <span className="file-category-badge">DOCUMENT VAULT</span>
          <h1>Project Files & Assets</h1>
          <p className="file-header-sub">Secure repository for requirements, assets, and project deliverables</p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary add-btn">
          {showForm ? '✕ Close Form' : '+ Upload File'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <div className="file-form animate-fade-in">
          <div className="file-form-hdr">
            <h3>Upload Project Asset</h3>
            <p>Attach documents, previews, or archives relevant to Project #{projectId}.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>File Label / Title</label>
              <input
                type="text"
                placeholder="e.g. Design Specifications v2"
                value={formData.fileName}
                onChange={(e) => setFormData({...formData, fileName: e.target.value})}
                required
              />
            </div>

            <div className="file-upload-row">
              <div className="form-group">
                <label>Select Local File</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                  required
                  className="file-picker-input"
                />
              </div>

              <div className="form-group">
                <label>File Category</label>
                <select
                  value={formData.fileType}
                  onChange={(e) => setFormData({...formData, fileType: e.target.value})}
                >
                  <option value="DOCUMENT">Document (PDF/DOC)</option>
                  <option value="IMAGE">Image Asset (PNG/JPG)</option>
                  <option value="VIDEO">Video Walkthrough (MP4)</option>
                  <option value="AUDIO">Audio Recording</option>
                </select>
              </div>
            </div>

            <div className="file-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary submit-btn">
                Upload Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {files.length === 0 && !showForm ? (
        <div className="no-files">
          <div className="no-files-icon">📁</div>
          <h3>No files uploaded yet</h3>
          <p>Keep your project deliverables and specifications organized in one secure place.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
            Upload First File
          </button>
        </div>
      ) : (
        <div className="files-grid">
          {files.map((file) => (
            <div key={file.id} className="file-card">
              <div className="file-card-top">
                {getFileIcon(file.fileType)}
                <span className="file-type">{file.fileType}</span>
              </div>

              <div className="file-info">
                <h4>{file.fileName}</h4>
                <div className="file-actions">
                  <a 
                    href={file.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm view-btn"
                  >
                    View File
                  </a>
                  <button 
                    onClick={() => deleteFile(file.id)}
                    className="btn btn-danger btn-sm delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilePage;
