import React from 'react';

interface Recommendation {
  id: string;
  doctor_id: string;
  doctor_name: string;
  patient_id: string;
  patient_name: string;
  date: string;
  recommendation: string;
}

interface DoctorRecommendationsProps {
  doctorRecommendations: Recommendation[];
  loadingRecommendations: boolean;
  formatDate: (dateString: string) => string;
}

const DoctorRecommendations: React.FC<DoctorRecommendationsProps> = ({
  doctorRecommendations,
  loadingRecommendations,
  formatDate,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">

      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold">
          Doctor Recommendations
        </h2>
        <p className="text-sm opacity-90">
          Clinical advice and follow-up guidance
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">

        {loadingRecommendations ? (
          <div className="text-center text-gray-500 py-6 animate-pulse">
            Loading recommendations...
          </div>
        ) : doctorRecommendations.length === 0 ? (
          <div className="text-center text-gray-400 py-6 border border-dashed rounded-xl">
            No recommendations available yet
          </div>
        ) : (
          doctorRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-gray-50 border border-gray-200 hover:shadow-md transition-all duration-200 rounded-xl p-5"
            >
              {/* Doctor Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">

                  {/* Doctor Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {rec.doctor_name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Dr. {rec.doctor_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(rec.date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendation Text */}
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {rec.recommendation}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorRecommendations;