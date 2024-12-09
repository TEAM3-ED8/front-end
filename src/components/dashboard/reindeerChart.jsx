import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import PropTypes from "prop-types";

export const ReindeerChart = ({ data }) => (
  <Card className="col-span-1">
    <CardHeader>
      <CardTitle>Reindeer Distribution</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300} minWidth={200}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"/>
          <YAxis />
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

ReindeerChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

