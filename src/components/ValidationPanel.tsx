"use client";

import { updateItemStatus } from "@/services/clinical.service";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface TrackedItem {
  value: string;
  status: "pending" | "accepted" | "rejected";
}

interface ValidationPanelProps {
  sessionId: string;
  category: string;
  items: TrackedItem[];
  onUpdate: (category: string, updatedItems: TrackedItem[]) => void;
}

export default function ValidationPanel({ sessionId, category, items, onUpdate }: ValidationPanelProps) {
  const [localItems, setLocalItems] = useState(items);

  const handleStatusChange = async (itemValue: string, newStatus: "accepted" | "rejected") => {
    const updated = localItems.map((i) =>
      i.value === itemValue ? { ...i, status: newStatus } : i
    );
    setLocalItems(updated);
    onUpdate(category, updated);

    try {
      await updateItemStatus(sessionId, category, itemValue, newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/30">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-700 border-amber-200">Pending</Badge>;
    }
  };

  return (
    <Card className="border-sidebar-border bg-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          {category.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <Separator className="bg-sidebar-border" />
      <CardContent className="pt-4">
        {localItems.length === 0 ? (
          <div className="py-8 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No items detected</p>
          </div>
        ) : (
          <div className="space-y-2">
            {localItems.map((item, index) => (
              <div key={item.value}>
                <div className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {getStatusIcon(item.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground break-words">{item.value}</p>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  {item.status === "pending" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        onClick={() => handleStatusChange(item.value, "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => handleStatusChange(item.value, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
                {index < localItems.length - 1 && <Separator className="bg-sidebar-border" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
