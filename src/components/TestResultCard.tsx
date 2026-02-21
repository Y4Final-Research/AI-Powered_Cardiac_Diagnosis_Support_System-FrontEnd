import React from 'react';

interface TestResultCardProps {
  testResult: string;
}

const TestResultCard: React.FC<TestResultCardProps> = ({ testResult }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 flex items-center">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Test Result</h2>
      </div>

      {/* Content */}
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-gray-800 leading-relaxed text-sm md:text-base">
          {testResult}
        </p>
      </div>
      
    </div>
  );
};

export default TestResultCard;