import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFileUpload from '../api/fileUploadService';
import './FilePage.css';

const FilePage = () => {
  const { projectId } = useParams();
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
    } catch (error) {
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
    } catch (error) {
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
      } catch (error) {
        setError('Failed to delete file');
      }
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'IMAGE': return '🖼️';
      case 'VIDEO': return '🎥';
      case 'AUDIO': return '🎵';
      default: return '📄';
    }
  };

  if (loading) return <div className="loading">Loading files for project {projectId}...</div>;

  console.log('FilePage loaded for project:', projectId);

  return (
    <div className="file-page" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <div className="file-header">
        <h1>Project Files</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          {showForm ? 'Cancel' : 'Upload File'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="file-form">
          <h3>Upload New File</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>File Name</label>
              <input
                type="text"
                value={formData.fileName}
                onChange={(e) => setFormData({...formData, fileName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>File</label>
              <input
                type="file"
                onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                required
              />
            </div>
            <div className="form-group">
              <label>File Type</label>
              <select
                value={formData.fileType}
                onChange={(e) => setFormData({...formData, fileType: e.target.value})}
              >
                <option value="DOCUMENT">Document</option>
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="AUDIO">Audio</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">Upload File</button>
          </form>
        </div>
      )}

      <div className="files-grid">
        {files.map(file => (
          <div key={file.id} className="file-card">
            <div className="file-icon">
              {getFileIcon(file.fileType)}
            </div>
            <div className="file-info">
              <h4>{file.fileName}</h4>
              <p className="file-type">{file.fileType}</p>
              <div className="file-actions">
                <a 
                  href={file.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-btn"
                >
                  View
                </a>
                <button 
                  onClick={() => deleteFile(file.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && !loading && (
        <div className="no-files">
          <p>No files uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default FilePage;
