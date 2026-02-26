"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"

interface LabComparisonTableProps {
  labComparison: Array<{
    test: string
    actualValue: number | string
    normalRange: string
    status: "Normal" | "High" | "Low"
  }>
}

const LabComparisonTable: React.FC<LabComparisonTableProps> = ({
  labComparison,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Normal":
        return "default"
      case "High":
        return "destructive"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card className="shadow-md border border-slate-200">
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Actual Value</TableHead>
              <TableHead>Normal Range</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {labComparison.map((item, index) => (
              <TableRow key={index} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-800">
                  {item.test}
                </TableCell>

                <TableCell>
                  <span className="px-3 py-1 bg-slate-100 rounded-md text-slate-800 font-medium text-sm">
                    {item.actualValue}
                  </span>
                </TableCell>

                <TableCell className="text-slate-600">
                  {item.normalRange}
                </TableCell>

                <TableCell>
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default LabComparisonTable