/* eslint-disable react/jsx-key */
'use client';
import { useEffect, useState } from 'react';
import { supabase } from "../lib/initSupabase";
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function SprintList(){
  const current_path = usePathname();
  const [sprints, setSprints] = useState([]);

  useEffect(()=>{
    getSprints()
  },[]);

  async function getSprints(){
    const {data} = await supabase.from('sprints').select();
    setSprints(data);
  }

  function addDays(start_date: any, number_of_days: any): import("react").ReactNode {
    let date = new Date(start_date);
    date.setDate(date.getDate() + number_of_days);
    return date.toLocaleDateString();
  }

  return (
      <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Sprint number
                </th>
                <th scope="col" className="px-6 py-3">
                    Start date
                </th>
                <th scope="col" className="px-6 py-3">
                    End date
                </th>
            </tr>
        </thead>
        <tbody>
          {sprints && sprints.map((sprint) => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <td><Link href={`${current_path}/${sprint.id}`}>{sprint.sprint_no}</Link></td>
                </th>
                <td className="px-6 py-4">
                    {new Date(sprint.start_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                    {addDays(sprint.start_date,sprint.number_of_days)}
                </td>
            </tr>
          ))}
        </tbody>
    </table>
</div>
  )
}