import React from 'react';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';

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
  <Card className="rounded-2xl shadow-md">
    <CardContent className="p-6 space-y-4">

      {loadingRecommendations ? (

        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>

      ) : doctorRecommendations.length === 0 ? (

        <div className="text-center text-muted-foreground py-6 border border-dashed rounded-xl">
          No recommendations available yet
        </div>

      ) : (

        doctorRecommendations.map((rec) => (
          <Card
            key={rec.id}
            className="rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <CardContent className="p-5 space-y-3">

              {/* Doctor Info */}
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                      {rec.doctor_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">
                      Dr. {rec.doctor_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(rec.date)}
                    </p>
                  </div>

                </div>

              </div>

              {/* Recommendation Text */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {rec.recommendation}
              </p>

            </CardContent>
          </Card>
        ))

      )}

    </CardContent>
  </Card>
  );
};

export default DoctorRecommendations;