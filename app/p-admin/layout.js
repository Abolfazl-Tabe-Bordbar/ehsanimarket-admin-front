import React from "react";
import Navbar from "@/components/modules/Navbar";
import Sidebar from "@/components/modules/Sidebar";
import SidebarDropdown from "@/components/modules/SidebarDropdown";

function PAdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#eef1f8] font-IRANSans">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <SidebarDropdown />
        <main className="flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}

export default PAdminLayout;
