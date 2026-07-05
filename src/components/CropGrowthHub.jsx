/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Sprout, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Plus,
  Play,
  Square
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext.jsx';

export const CropGrowthHub = ({ userProfile }) => {
  const { t } = useLanguage();

  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  
  // Image Capture & Upload states
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState('');
  const [stage, setStage] = useState('Vegetative');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  // Live Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/crop/logs/${userProfile?.uid}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (userProfile?.uid) {
      fetchLogs();
    }
  }, [userProfile]);

  // Clean up camera stream if component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Gallery file handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Max size is 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & drop handler
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Max size is 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Camera Media capture APIs
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera media blocked or unsupported, utilizing local file mock.", err);
      alert("Iframe sandboxing or device permissions blocked camera feed. Please use file upload instead.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && cameraStream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImage(dataUri);
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const handleDiagnosticsSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    setSubmitting(true);
    setSuccess(null);

    try {
      const res = await fetch('/api/crop/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: userProfile?.uid || 'f-dummy',
          cropName: userProfile?.cropDetails?.cropName || 'Chili',
          stage,
          imageUrl: image,
          notes
        })
      });

      if (res.ok) {
        setSuccess("Diagnostics log written successfully!");
        setImage(null);
        setNotes('');
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-display">
          {t('cropHubTitle')}
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          {t('cropHubSub')}
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Column: Diagnostics Input upload (Span 5) */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-left space-y-4">
            <h3 className="text-md font-bold text-slate-900 font-display border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <span>Snap New Growth Log</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">AI Sown Logs</span>
            </h3>

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5 font-bold shadow-sm animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleDiagnosticsSubmit} className="space-y-4">
              
              {/* Media input stage */}
              {!image && !showCamera ? (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="h-[180px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-400 transition duration-200 flex flex-col items-center justify-center p-4 text-center cursor-pointer relative shadow-inner"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mb-3" />
                  <p className="text-xs font-bold text-slate-700 mb-1">Drag and Drop Field Photo Here</p>
                  <p className="text-[10px] text-slate-500 font-semibold font-mono">Max size 10MB • JPG, PNG</p>
                  
                  {/* Camera prompt */}
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-3.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer border border-emerald-500 transition shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Or Launch Live Camera</span>
                  </button>
                </div>
              ) : showCamera ? (
                /* Live Camera Video stream */
                <div className="h-[200px] bg-slate-900 rounded-2xl border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center shadow-lg">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating camera trigger overlays */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg border border-emerald-500 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Snap Frame</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Uploaded Image Preview */
                <div className="space-y-3">
                  <div className="h-[180px] rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 relative shadow-sm">
                    <img src={image} className="w-full h-full object-cover" alt="Sown snapshot" />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2.5 right-2.5 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 text-[10px] font-bold rounded-lg transition border border-red-500 shadow-sm"
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>
              )}

              {/* Form details inputs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Growth Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-2.5 text-xs text-slate-800 font-semibold shadow-sm"
                  >
                    <option value="Sowing">Sowing (First Seeds)</option>
                    <option value="Vegetative">Vegetative (Leaf Growth)</option>
                    <option value="Flowering">Flowering Budding</option>
                    <option value="Harvest-Ready">Harvest Ready Yield</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Logged Sown Crop</label>
                  <input
                    type="text"
                    disabled
                    value={userProfile?.cropDetails?.cropName || 'Chili'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Additional field observations</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Leaves showing slight yellow outlines near bases..."
                  className="w-full h-16 bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-2.5 text-xs text-slate-800 resize-none font-medium shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !image}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-500 shadow-sm disabled:opacity-55"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Running Multimodal AI Diagnosis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-100 animate-pulse" />
                    <span>Run AI Diagnostics & Record Log</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Growth Logs & AI Diagnostics Timeline (Span 7) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 font-display border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <span>{t('photoLogs')}</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">{logs.length} entries</span>
            </h3>

            {loadingLogs ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-500">Loading growth logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-semibold">
                {t('emptyPhotos')}
              </div>
            ) : (
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition duration-150 grid sm:grid-cols-12 gap-4 text-left shadow-sm">
                    
                    {/* Log Image */}
                    <div className="sm:col-span-4 h-[110px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                      <img src={log.imageUrl} className="w-full h-full object-cover" alt="Log snapshot" />
                    </div>

                    {/* Diagnostics Details */}
                    <div className="sm:col-span-8 flex flex-col justify-between space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{log.stage} Stage Log</h4>
                          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${log.pestRisk === 'High' ? 'bg-red-50 text-red-800 border-red-100 animate-pulse' : log.pestRisk === 'Medium' ? 'bg-yellow-50 text-yellow-800 border-yellow-100' : 'bg-emerald-50 text-emerald-800 border-emerald-100'}`}>
                          Risk: {log.pestRisk}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] text-slate-700 leading-relaxed font-semibold shadow-sm">
                        <span className="font-bold text-slate-900 block mb-1 flex items-center gap-1 border-b border-slate-100 pb-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>AI Diagnostics Advice (Health Quotient: {log.healthScore}/10)</span>
                        </span>
                        <ul className="space-y-1 pl-1 mt-1 font-sans text-slate-600 font-medium">
                          {log.aiDirectives.map((dir, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 shrink-0">•</span>
                              <span>{dir}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
