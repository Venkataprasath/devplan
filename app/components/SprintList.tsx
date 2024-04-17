/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { supabase } from "../lib/initSupabase";
import Table from 'react-bootstrap/Table';
import { usePathname } from 'next/navigation';

import Link from "next/link";



function SprintList() {
  const current_path = usePathname(); // current path

  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    getSprints();
  }, []);

  async function getSprints() {
    const { data } = await supabase.from("sprints").select();
    setSprints(data);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Sprint Number</th>
        </tr>
      </thead>
      <tbody>
        {sprints.map((sprint) => (
          <tr>
            <td><Link href={`${current_path}/${sprint.id}`}>{sprint.sprint_no}</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  );  
}

export default SprintList;