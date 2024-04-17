"use client";

import { useRouter } from "next/navigation"
import { useState } from 'react';
import SprintList from "@/app/components/SprintList";

export default function DynamicPage() {
  const router = useRouter()
  return (
    <div>
    <SprintList />
    </div>
  )
}