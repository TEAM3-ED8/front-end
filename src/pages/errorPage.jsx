import { FaExclamationTriangle } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-8 rounded-lg shadow-lg text-center">
        <CardHeader>
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">
            Oops! Something went wrong.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-600 mb-4">
            We can&apos;t seem to find the page you&apos;re looking for.
          </CardDescription>
          <Link to={"/"}>
            <Button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200">
              Go back home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
