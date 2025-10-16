import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { Skeleton, Card } from "antd";

export default function RequireAuth() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen">
        {/* Sidebar outline */}
        <div className="w-64 bg-[#111827] border-r border-gray-700 flex flex-col justify-between">
          <div className="p-4">
            {/* <div className="text-white font-bold text-lg mb-6">MIS</div>*/}
            <div className="space-y-3">
              <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
              <div className="h-4 w-4/5 bg-gray-700 rounded"></div>
              <div className="h-4 w-3/5 bg-gray-700 rounded"></div>
              <div className="h-4 w-2/4 bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center bg-[#f9fafb] border-l border-gray-700">
          <Card className="w-[400px] shadow-md rounded-xl border border-gray-700">
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
        </div>
      </div>
    );
  }

  // redirect to login if not logged in
  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}
