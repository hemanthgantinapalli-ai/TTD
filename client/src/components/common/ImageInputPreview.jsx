import React, { useState, useRef } from 'react';

const ImageInputPreview = ({
  label = 'Cover Image / Thumbnail URL',
  value = '',
  onChange,
  required = false,
  helperText = 'Paste any image web link or upload a picture from your device.'
}) => {
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  const handleUrlChange = (e) => {
    setImageError(false);
    onChange(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageError(false);
      onChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setImageError(false);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
      <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label} {required && <span style={{ color: '#B3261E' }}>*</span>}</span>
        {value && !imageError && (
          <span style={{ fontSize: '11px', color: '#2E7D46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>✓</span> Live Preview Active
          </span>
        )}
      </label>

      {/* Input Group: Text URL + Upload Button */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="https://images.unsplash.com/... or paste image URL"
          value={value}
          onChange={handleUrlChange}
          required={required}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '13px',
            border: '1px solid #D8CBB8',
            borderRadius: '6px',
            background: '#FEFCF7',
            color: '#2B2320',
          }}
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '8px 14px',
            fontSize: '12.5px',
            fontWeight: 600,
            borderRadius: '6px',
            border: '1px solid #D8CBB8',
            background: '#FFF8E6',
            color: '#8C6B10',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <span>📁</span> Upload
        </button>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear Image"
            style={{
              padding: '8px 10px',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRadius: '6px',
              border: '1px solid #FDECEA',
              background: '#FDECEA',
              color: '#B3261E',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {helperText && !value && (
        <span style={{ fontSize: '11px', color: '#8C7E78' }}>{helperText}</span>
      )}

      {/* Live Image Preview Card */}
      {value && (
        <div
          style={{
            marginTop: '6px',
            background: '#FAF5EA',
            border: '1px solid #E0D4C0',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '80px',
              borderRadius: '6px',
              overflow: 'hidden',
              background: '#EDE6D9',
              border: '1px solid #D8CBB8',
              flexShrink: 0,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {imageError ? (
              <span style={{ fontSize: '11px', color: '#B3261E', textAlign: 'center', padding: '6px' }}>
                Broken Link
              </span>
            ) : (
              <img
                src={value}
                alt="Live Preview"
                onError={() => setImageError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: imageError ? '#B3261E' : '#4A0E1C', marginBottom: '2px' }}>
              {imageError ? '⚠️ Image Preview Failed' : '🖼️ Image Ready to Store in MongoDB'}
            </div>
            <div style={{ fontSize: '11px', color: '#6B615C', wordBreak: 'break-all', maxHeight: '36px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {imageError
                ? 'The provided link could not be loaded. Please ensure it is a direct image URL (jpg, png, webp) or use the Upload button.'
                : value.startsWith('data:')
                ? 'Local Image File loaded (Data URL ready for saving)'
                : value}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInputPreview;
