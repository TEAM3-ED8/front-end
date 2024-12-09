import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import PropTypes from 'prop-types';

export const OrganizationChart = ({ organizations, selectedOrganization }) => {
  const data = [
    { name: 'Selected', value: 1 },
    { name: 'Others', value: organizations - 1 },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Organization Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-2">{organizations}</p>
        <p className="text-sm text-gray-500 mb-4">Total Organizations</p>
        <Badge variant="secondary" className="mb-2">Selected: {selectedOrganization}</Badge>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`var(--color-${entry.name.toLowerCase()})`} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

OrganizationChart.propTypes = {
  organizations: PropTypes.number.isRequired,
  selectedOrganization: PropTypes.string.isRequired,
};

