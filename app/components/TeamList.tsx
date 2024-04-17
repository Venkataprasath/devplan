/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { supabase } from "../lib/initSupabase";
import Table from 'react-bootstrap/Table';
import Link from "next/link";



function TeamList() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getteams();
  }, []);

  async function getteams() {
    const { data } = await supabase.from("team").select();
    setTeams(data);
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Team Name</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr>
            <td><Link href={`/teams/${team.id}/sprints`}>{team.name}</Link></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TeamList;