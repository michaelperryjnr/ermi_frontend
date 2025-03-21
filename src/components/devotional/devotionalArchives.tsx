import { Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock archive data - would come from your API/database
const archiveMonths = [
  { month: "March 2025", count: 31 },
  { month: "February 2025", count: 28 },
  { month: "January 2025", count: 31 },
  { month: "December 2024", count: 31 },
  { month: "November 2024", count: 30 },
  { month: "October 2024", count: 31 },
];

export function DevotionalArchives() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Archives
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-2">
          {archiveMonths.map((item) => (
            <li key={item.month}>
              <Link
                href={`/devotionals/archive/${item.month
                  .toLowerCase()
                  .replace(" ", "-")}`}
                className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted transition-colors"
              >
                <span className="flex items-center text-sm">
                  <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                  {item.month}
                </span>
                <Badge variant="secondary">{item.count}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
