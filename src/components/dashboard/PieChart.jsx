import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import propTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export const PieChart = ({ data }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Children&apos;s Behavior</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '12px',
                '@media (max-width: 480px)': {
                  fontSize: '10px'
                }
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

PieChart.propTypes = {
  data: propTypes.arrayOf(
    propTypes.shape({
      name: propTypes.string,
      value: propTypes.number,
      color: propTypes.string,
    })
  ).isRequired,
};

