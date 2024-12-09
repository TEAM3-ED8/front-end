import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import PropTypes from "prop-types";

export const ElvesChart = ({ data }) => (
  <Card className="col-span-1 lg:col-span-2">
    <CardHeader>
      <CardTitle>Elves Workforce</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data} 
          margin={{ 
            top: 20, 
            right: 10, 
            left: 0, 
            bottom: 5 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={0}
            textAnchor="center"
            height={40}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

ElvesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

