import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to login page as the entry point
  return <Navigate to="/auth/login" replace />;
};

export default Index;
