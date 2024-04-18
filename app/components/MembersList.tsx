/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { supabase } from "../lib/initSupabase";


function MembersList(props) {
  console.log(props)
  const { role_type } = props;
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getMembers();
  }, []);

  async function getMembers() {
    let internal_role = role_type === 'qa' ? 'qa' : 'dev';
    const { data } = await supabase.from("members").select().eq('role_type', internal_role);
    setMembers(data);
  }

  return (
    <select name={role_type+'_user'} value={props.user_id} onChange={(e) => props.onChange(props.row_id, e.target.value, role_type+'_user_id')}>
      {members.map((member) => (
        <option value={member.id}>{member.name}</option>
      ))}
    </select>
  );
}

export default MembersList;