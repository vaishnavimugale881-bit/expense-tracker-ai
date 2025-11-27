import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center min-h-screen bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Modal header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 p-2 rounded"
            onClick={onClose}
            aria-label="Close"
          >
            &#10005;
          </button>
        </div>
        {/* Modal body */}
        <div className="p-4 md:p-5 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
