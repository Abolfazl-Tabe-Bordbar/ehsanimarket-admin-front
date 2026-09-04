import React from "react";
import UserDetailMain from "@/components/templates/P-Admin/Users/UserDetailMain";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `احسانی مارکت - جزئیات کاربر ${id}`,
  };
}

async function UserDetailPage({ params }) {
  const { id } = await params;
  return <UserDetailMain userId={id} />;
}

export default UserDetailPage;
