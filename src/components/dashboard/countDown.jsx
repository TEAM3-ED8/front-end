import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar } from 'lucide-react';

export const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setProgress(calculateProgress(newTimeLeft));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const christmas = new Date(new Date().getFullYear(), 11, 25);
    const now = new Date();
    const difference = christmas - now;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  function calculateProgress(timeLeft) {
    const totalSeconds = 365 * 24 * 60 * 60; 
    const secondsLeft = timeLeft.days * 24 * 60 * 60 + timeLeft.hours * 60 * 60 + timeLeft.minutes * 60 + timeLeft.seconds;
    return ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  }

  return (
    <Card className="w-full px-16 text-white" style={{ position: 'relative' }}>
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-lg blur-sm" style={{ backgroundImage: 'url(https://png.pngtree.com/thumb_back/fw800/background/20240928/pngtree-a-christmas-card-with-presents-on-the-floor-and-lantern-in-image_16273594.jpg)' }}></div>
      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Countdown to Christmas</CardTitle>
          <Calendar className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
          <Progress
            value={progress}
            className="w-full mt-2"
            aria-label="Progress towards Christmas"
          />
          <div className="flex justify-around mt-2">
            <Badge variant="outline" className="flex items-center gap-1 text-white">
              <Gift className="h-3 w-3 text-white" />
              {365 - timeLeft.days} days passed
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 text-white">
              {Math.round(progress)}% complete
            </Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
