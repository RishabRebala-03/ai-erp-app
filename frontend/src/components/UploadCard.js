import React, { useRef, useState } from 'react';

export default function UploadCard({ onSubmit, processing, progress, message }) {
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [mode, setMode] = useState('file'); // file or text

  function onPickFile() {
    fileRef.current && fileRef.current.click();
  }

  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setSelectedFile(f);
    // automatically send when selected
    onSubmit({ file: f, text: null });
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      setSelectedFile(f);
      onSubmit({ file: f, text: null });
    }
  }

  function onSendText() {
    if (!textInput.trim()) {
      alert('Please paste or type the text document content first.');
      return;
    }
    setSelectedFile(null);
    onSubmit({ file: null, text: textInput });
  }

  return (
    <div className="panel">
      <h2>Upload / Paste Document</h2>
      <div className="muted">Upload an interior design image, PDF, or paste the textual doc (e.g., "6 chairs and 1 table").</div>

      <div className="mode-switch">
        <button className={mode==='file' ? 'active' : ''} onClick={()=>setMode('file')}>File</button>
        <button className={mode==='text' ? 'active' : ''} onClick={()=>setMode('text')}>Text</button>
      </div>

      {mode === 'file' && (
        <div className="dropzone" onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} onClick={onPickFile}>
          <input ref={fileRef} type="file" accept="image/*,application/pdf,text/plain" style={{display:'none'}} onChange={onFileChange} />
          <div className="drop-inner">
            <div className="big">📤</div>
            <div className="txt">Click or drop image / PDF here</div>
            {selectedFile && <div className="filename">Selected: {selectedFile.name}</div>}
            <div className="hint">Files accepted: JPG, PNG, PDF, TXT</div>
          </div>
        </div>
      )}

      {mode === 'text' && (
        <div className="text-input">
          <textarea value={textInput} onChange={(e)=>setTextInput(e.target.value)} placeholder="Paste the document text here, e.g., &quot;6 work chairs, 1 work table&quot;" />
          <div style={{display:'flex',gap:8,marginTop:10}}>
            <button className="primary" onClick={onSendText} disabled={processing}>Send Text</button>
            <button className="ghost" onClick={()=>setTextInput('')}>Clear</button>
          </div>
        </div>
      )}

      <div className="progress-wrap">
        <div className="progress-label">Upload progress</div>
        <div className="progress-bar"><div className="progress" style={{width: (processing ? progress : 0) + '%'}}/></div>
        <div className="progress-percent">{processing ? progress + '%' : '0%'}</div>
      </div>

      <div className="status-row">
        <div className="status">{processing ? 'Processing...' : (message || 'No active process')}</div>
        <div>
          <button className="primary" onClick={()=>{ if(selectedFile) onSubmit({file:selectedFile}); else alert('Select a file or paste text.') }} disabled={processing}>Upload</button>
          <button className="ghost" onClick={() => { setSelectedFile(null); setTextInput(''); }}>Reset</button>
        </div>
      </div>
    </div>
  );
}
