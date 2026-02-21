import React from 'react';

interface LabComparisonTableProps {
  labComparison: Array<{
    test: string;
    actualValue: number | string;
    normalRange: string;
    status: 'Normal' | 'High' | 'Low';
  }>;
}

const LabComparisonTable: React.FC<LabComparisonTableProps> = ({ labComparison }) => {
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
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">
          Lab Comparison
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-6">
        <table className="w-full text-sm text-left">

          <thead className="text-xs uppercase bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Test</th>
              <th className="px-4 py-3 font-semibold">Actual Value</th>
              <th className="px-4 py-3 font-semibold">Normal Range</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {labComparison.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 font-medium text-gray-800">
                  {item.test}
                </td>

                <td className="px-4 py-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-800 font-medium">
                    {item.actualValue}
                  </span>
                </td>

                <td className="px-4 py-4 text-gray-600">
                  {item.normalRange}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Normal'
                        ? 'bg-green-100 text-green-600'
                        : item.status === 'High'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default LabComparisonTable;