"use client";

import PlanView from "@/app/components/PlanView";
import SprintTaskForm from "@/app/components/SprintTaskForm";
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react';

export default function DynamicPage({params}: any) {
  const router = useRouter()
  const [planView, setPlanView] = useState();
  
  return (
    <>
    <div><SprintTaskForm sprint_id={params.sprint_id} team_id={params.team_id}/></div>
    <div></div>
    </>
  )
}