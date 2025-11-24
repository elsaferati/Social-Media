import React from "react";
import { X } from "lucide-react"; 

const ModalSystem = ({ children, onClose }) => {
  return (
    // Backdrop with Blur
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button (Absolute Top Right) */}
        <button 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 z-10"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default ModalSystem;