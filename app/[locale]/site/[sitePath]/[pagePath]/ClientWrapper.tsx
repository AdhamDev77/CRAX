'use client';

// import dynamic from "next/dynamic";
import Client from "./client";
// const Client = dynamic(() => import("./client"), { ssr: false });

export default function ClientWrapper(props: { isEdit: boolean; path: string }) {
  return <Client {...props} />;
}
