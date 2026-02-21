import React from 'react';
import { Line } from 'react-chartjs-2';

interface PatientHistorySectionProps {
  patientHistoryData: any[];
  loadingPatientHistory: boolean;
  selectedPatientHistory: any;
  loadPatientHistory: (historyItem: any) => void;
  labTrendData: any;
  numericData: any;
  showCharts: boolean;
  setShowCharts: (show: boolean) => void;
  formatDate: (dateString: string) => string;
}

const PatientHistorySection: React.FC<PatientHistorySectionProps> = ({
  patientHistoryData,
  loadingPatientHistory,
  selectedPatientHistory,
  loadPatientHistory,
  labTrendData,
  numericData,
  showCharts,
  setShowCharts,
  formatDate,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 flex items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Patient History
          </h2>
          <p className="text-sm text-white/90">
            Review previous reports and lab trends
          </p>
        </div>

        <button
          onClick={() => setShowCharts(!showCharts)}
          className="ml-auto px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm transition"
        >
          {showCharts ? 'List View' : 'Chart View'}
        </button>
      </div>

      <div className="p-6">

        {showCharts ? (
          <div className="space-y-6">

            {/* Lab Trend Chart */}
            {labTrendData && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-gray-800 font-semibold mb-4">
                  Lab Values Trend
                </h3>
                <div className="h-64">
                  <Line
                    data={labTrendData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: { color: '#374151' }
                        }
                      },
                      scales: {
                        y: {
                          ticks: { color: '#6b7280' },
                          grid: { color: '#e5e7eb' }
                        },
                        x: {
                          ticks: { color: '#6b7280' },
                          grid: { color: '#e5e7eb' }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Numeric Data Chart */}
            {numericData && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-gray-800 font-semibold mb-4">
                  Patient Metrics Trend
                </h3>
                <div className="h-64">
                  <Line
                    data={numericData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: { color: '#374151' }
                        }
                      },
                      scales: {
                        y: {
                          ticks: { color: '#6b7280' },
                          grid: { color: '#e5e7eb' }
                        },
                        x: {
                          ticks: { color: '#6b7280' },
                          grid: { color: '#e5e7eb' }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                onClick={() => setShowCharts(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
              >
                Back to List View
              </button>
            </div>

          </div>
        ) : (

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">

            {loadingPatientHistory ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                Loading patient history...
              </div>
            ) : patientHistoryData.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400">
                No patient history available
              </div>
            ) : (
              patientHistoryData.map((record, index) => {

                const isNormal =
                  record.result === "Normal" ||
                  (record.labComparison &&
                    record.labComparison.every((item: any) => item.status === "Normal"));

                return (
                  <div
                    key={index}
                    onClick={() => loadPatientHistory(record)}
                    className={`rounded-xl p-5 cursor-pointer transition-all duration-200 border shadow-sm
                      ${
                        selectedPatientHistory === record
                          ? 'bg-blue-50 border-blue-500 shadow-md'
                          : 'bg-gray-50 border-gray-200 hover:shadow-md'
                      }`}
                  >

                    <div className="flex justify-between items-start mb-3">

                      <div>
                        <p className="font-semibold text-gray-800">
                          {record.test || record.summary || 'Medical Report'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(
                            record.date ||
                            record.created_at ||
                            record.timestamp ||
                            new Date().toISOString()
                          )}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isNormal
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {isNormal ? "Normal" : "Abnormal"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      {record.doctor || record.doctor_name || 'Auto-generated Report'}
                    </p>

                    {record.summary && (
                      <p className="text-gray-700 text-sm mt-3 line-clamp-2">
                        {record.summary}
                      </p>
                    )}

                    {selectedPatientHistory === record && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-blue-600 text-xs font-medium">
                          ✔ Selected - Click to reload
                        </p>
                      </div>
                    )}

                  </div>
                );
              })
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistorySection;