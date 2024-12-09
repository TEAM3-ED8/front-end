import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StatCard = ({ icon, title, value, subtitle }) => (
  <Card className="bg-gradient-to-r from-red-100 to-green-100">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
    <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
    </CardContent>
  </Card>
);

StatCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.node]).isRequired,
};

