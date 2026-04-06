import React from "react";

const SidebarSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-gray-100 p-4 h-[400px]">
      <div className="space-y-4">
        {/* Just some faint lines to indicate it's a sidebar section */}
        <div className="h-4 bg-gray-50 rounded w-2/3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-50 rounded"></div>
          <div className="h-3 bg-gray-50 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;


