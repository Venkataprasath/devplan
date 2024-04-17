"use client";

import { useRouter } from "next/navigation"
import { useState } from 'react';
import TeamList from "../components/TeamList";

export default function DynamicPage() {
  const router = useRouter()
  return (
    <div>
    <TeamList />
    </div>
  )
}