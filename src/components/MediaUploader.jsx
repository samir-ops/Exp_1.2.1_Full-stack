import React, { useState, useRef } from 'react';
import { UploadCloud, X, Film, Image as ImageIcon } from 'lucide-react';

function MediaUploader({ mediaFiles, setMediaFiles }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Read files and update parent state list
  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      // Limit file sizes (Images 10MB, Videos 50MB)
      const limit = isImage ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      
      if (!isImage && !isVideo) {
        alert(`${file.name} is not a supported file format.`);
        return false;
      }
      
      if (file.size > limit) {
        alert(`${file.name} exceeds the file size limit (${isImage ? '10MB' : '50MB'}).`);
        return false;
      }
      
      return true;
    });

    const newMediaItems = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      name: file.name
    }));

    setMediaFiles(prev => [...prev, ...newMediaItems]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeMedia = (id) => {
    // Revoke the object URL to release browser memory
    const target = mediaFiles.find(item => item.id === id);
    if (target) {
      URL.revokeObjectURL(target.url);
    }
    setMediaFiles(prev => prev.filter(item => item.id !== id));
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="uploader-container fade-in">
      <input
        type="file"
        id="hidden-file-input"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*,video/*"
        style={{ display: 'none' }}
      />

      <div
        className={`media-uploader-box ${isDragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBoxClick}
      >
        <UploadCloud size={32} className="upload-icon" />
        <div className="upload-text">Drag & drop your files here, or browse</div>
        <div className="upload-subtext">Supports PNG, JPG, WebP, GIF or MP4 (Max Images 10MB, Videos 50MB)</div>
      </div>

      {mediaFiles.length > 0 && (
        <div className="thumbnail-grid-wrapper">
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Attached Media ({mediaFiles.length})
          </div>
          <div className="thumbnail-grid">
            {mediaFiles.map((item) => (
              <div key={item.id} className="thumb-container">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="thumb-image" />
                ) : (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <video src={item.url} className="thumb-image" muted />
                    <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.6)', padding: '2px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                      <Film size={12} color="#fff" />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMedia(item.id);
                  }}
                  className="thumb-remove-btn"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaUploader;
