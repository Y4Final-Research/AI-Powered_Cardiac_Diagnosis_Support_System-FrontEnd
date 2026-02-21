import React from 'react';

interface RecommendedTestsCardProps {
  recommendedTests: string[];
}

const RecommendedTestsCard: React.FC<RecommendedTestsCardProps> = ({ recommendedTests }) => {
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">
          Recommended Next Tests
        </h2>
      </div>

      {/* Content */}
      <div className="p-6">

        {recommendedTests.length === 0 ? (
          <div className="text-center py-6 bg-green-50 border border-green-100 rounded-xl">
            <div className="flex items-center justify-center mb-3">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <p className="text-green-600 font-semibold text-lg mb-2">
              No Additional Tests Required
            </p>

            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Based on the lab report analysis, all values are within normal range.
              No follow-up tests are needed at this time.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Based on the lab report analysis, the following tests are recommended:
            </p>

            <ul className="space-y-3">
              {recommendedTests.map((test, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-400 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>

                  <p className="text-gray-800 font-medium">
                    {test}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}

      </div>
    </div>
  );
};

export default RecommendedTestsCard;