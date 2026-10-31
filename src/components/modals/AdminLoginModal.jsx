import React from 'react';
import { Lock, X } from 'lucide-react';

/**
 * AdminLoginModal — กล่องล็อกอิน admin
 *
 * Props:
 *  - password:        string
 *  - onPasswordChange:(value)=>void
 *  - error:           string  ข้อความ error (ถ้ามี)
 *  - onSubmit:        (event)=>void
 *  - onClose:         ()=>void
 */
export default function AdminLoginModal({ password, onPasswordChange, error, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#131812]/95 backdrop-blur-lg p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-[#181d17] border border-[#cfa474]/30 rounded-3xl w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#859c7b] via-[#cfa474] to-[#859c7b]"></div>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#72826c] hover:text-[#cfa474] transition-colors"><X size={20} /></button>
        <div className="w-14 h-14 bg-gradient-to-br from-[#323d2f] to-[#20271e] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#455241] shadow-inner">
          <Lock className="text-[#cfa474]" size={28} />
        </div>
        <h2 className="text-2xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-[#d1dbcd] to-[#cfa474] mb-8">Admin Access</h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={onPasswordChange}
            className={`w-full bg-[#131812] border ${error ? 'border-red-500/50' : 'border-[#455241]'} rounded-xl px-4 py-3.5 text-center text-[#d1dbcd] focus:outline-none focus:border-[#cfa474] focus:ring-1 focus:ring-[#cfa474]/30 tracking-widest transition-all`}
            autoFocus
          />
          {error && <div className="text-red-400 text-xs text-center animate-pulse">{error}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-[#cfa474] to-[#a6825c] hover:from-[#b88c5a] hover:to-[#8f6a45] text-[#131812] font-black py-3.5 rounded-xl transition-all shadow-lg shadow-[#cfa474]/20">Login Securely</button>
        </form>
      </div>
    </div>
  );
}
