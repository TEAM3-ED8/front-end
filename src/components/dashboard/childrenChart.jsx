import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import PropTypes from "prop-types";

const behaviors = ["Kind", "Respectful", "Lazy", "Helpful", "Curious"];
const colors = ["#4299E1", "#48BB78", "#ED8936", "#ECC94B", "#ED64A6"];

export const ChildrenChart = ({ data }) => (
  <Card className="col-span-1">
    <CardHeader>
      <CardTitle>Children&apos;s Behavior Over Time</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          {behaviors.map((behavior, index) => (
            <Line 
              key={behavior}
              type="monotone" 
              dataKey={behavior} 
              stroke={colors[index]} 
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

ChildrenChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      Kind: PropTypes.number.isRequired,
      Respectful: PropTypes.number.isRequired,
      Lazy: PropTypes.number.isRequired,
      Helpful: PropTypes.number.isRequired,
      Curious: PropTypes.number.isRequired,
    })
  ).isRequired,
};
