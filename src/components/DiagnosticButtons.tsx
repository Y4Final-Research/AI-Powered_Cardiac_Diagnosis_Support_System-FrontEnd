import React from 'react';

const DiagnosticButtons: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Diagnostic Tests</h2>
      </div>

      {/* Buttons */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Cardiac Test */}
        <button
          onClick={() => window.location.href = '/cardiac'}
          className="bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl p-6 transition-colors flex flex-col items-center justify-center shadow-md"
        >
          <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-cyan-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-gray-800 font-medium text-lg">Cardiac Test</span>
        </button>

        {/* Heart Test */}
        <button
          onClick={() => window.location.href = '/heart'}
          className="bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl p-6 transition-colors flex flex-col items-center justify-center shadow-md"
        >
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-pink-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-gray-800 font-medium text-lg">Heart Test</span>
        </button>

        {/* Diabetic Test */}
        <button
          onClick={() => window.location.href = '/diabetic'}
          className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-xl p-6 transition-colors flex flex-col items-center justify-center shadow-md"
        >
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <span className="text-gray-800 font-medium text-lg">Diabetic Test</span>
        </button>
      </div>
    </div>
  );
};

export default DiagnosticButtons;