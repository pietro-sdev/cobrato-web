import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  percentageChange: string;
}

export function MetricCard({ title, value, percentageChange }: MetricCardProps) {
  return (
    <Card className="w-full border border-[#E4E4E4] px-4 py-3 bg-[#F9F9F9]">
      <CardHeader className="p-0">
        <CardTitle className="text-[15px] font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 mt-1">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-gray-600 font-medium">
          +{percentageChange} desde o último mês
        </p>
      </CardContent>
    </Card>
  );
}
