/* eslint-disable react/jsx-key */
import { get } from "http";
import { useEffect, useState } from "react"
import { supabase } from "../lib/initSupabase";
import { Table } from 'react-bootstrap';

export default function PlanView(props) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [leavePlan, setLeavePlan] = useState({});
  const [dates, setDates] = useState([]);
  const [sprint_tasks, setSprintTasks] = useState([]);
  const [sprintPlan, setSprintPlan] = useState({});

  useEffect(() => {
    getTeamMembers();
    getLeavePlan();
    getDates();
    setWorkItem();
  }, []);

  async function getTeamMembers() {
    const { data } = await supabase.from("members").select().eq('team_id', props.team_id);
    setTeamMembers(data);
    console.log(teamMembers);
  }

  async function getSprintTasks() {
    const { data } = await supabase.from("sprint_tasks").select().eq('sprint_id', props.sprint_id);
    setSprintTasks(data);
    console.log(sprint_tasks);
    setWorkItem();
  }

  function getLeavePlan() {
    setLeavePlan({
    });
  }



  async function getDates() {
    let dates = [];
    const { data } = await supabase.from("sprints").select().eq('id', props.sprint_id);
    for (let i = 0; i < 14; i++) {
      const temp_date = new Date(data[0].start_date);
      temp_date.setDate(temp_date.getDate() + i);
      console.log(temp_date)
      dates.push(temp_date);
    }
    setDates(dates);
    getSprintTasks();
  }

  async function changeLeavePlan(e) {
    let { name, value } = e.target;
    name = name.replaceAll('_leave_plan', '')
    setLeavePlan({
      ...leavePlan,
      [name]: value
    });
    await supabase.from('leaves').upsert({
      member_id: name,
      leaves: value,
      sprint_id: props.sprint_id
    },{ onConflict: 'member_id, sprint_id'}).select();
  }

  

  function isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  function getSprintPlan(){
    let plan = {};
    // plan = setWorkItem(plan);
    teamMembers.map((member) => {
      if(!plan[member.id]){
        plan[member.id] = {};
      }
      dates.map((date) => {
        if(isWeekend(date)){
          console.log(plan,member)
          plan[member.id][date] = 'Weekend';
        }else if (leavePlan[member] && leavePlan[member.id].split(',').includes(date.getDate().toString())){
          plan[member.id][date] = 'Leave';
        }else{
          plan[member.id][date] = 'Work';
        }
      })
    })
    console.log(plan)
    setSprintPlan(plan);
  }

  async function setWorkItem(){
    let [result1, result2 ] = await Promise.all([supabase.from("sprint_tasks").select().eq('sprint_id', props.sprint_id), supabase.from("features").select()]);
    let data = result1.data;
    let features = result2.data;
    let plan = {};
    data.map((task) => {
      if(!plan[task.dev_user_id]){
        plan[task.dev_user_id] = {};
      }
      if(!plan[task.qa_user_id]){
        plan[task.qa_user_id] = {};
      }
      if(!plan[task.fe_user_id]){
        plan[task.fe_user_id] = {};
      }
      let task_name = features.find(feature => feature.id === task.feature_id).name;
      let date = new Date(task.dev_start_date);
      for (let i = 0; i < task.be_efforts;) {
        plan[task.dev_user_id][date.toLocaleDateString()] = plan[task.dev_user_id][date.toLocaleDateString()] == undefined ? '' : plan[task.dev_user_id][date.toLocaleDateString()];
        plan[task.dev_user_id][date.toLocaleDateString()] += task_name + ',';
        date.setDate(date.getDate() + 1);
        isWeekend(date) ? i : i++;
      }
      date = new Date(task.fe_start_date);
      for (let i = 0; i < task.fe_efforts; ) {
        plan[task.fe_user_id][date.toLocaleDateString()] = plan[task.fe_user_id][date.toLocaleDateString()] == undefined ? '' : plan[task.fe_user_id][date.toLocaleDateString()];

        plan[task.fe_user_id][date.toLocaleDateString()] += task_name+ ',';
        date.setDate(date.getDate() + 1);
        isWeekend(date) ? i : i++;
      }
      let qa_date = new Date(task.qa_start_date);
      for (let i = 0; i < task.qa_efforts; ) {
        plan[task.qa_user_id][qa_date.toLocaleDateString()] = plan[task.qa_user_id][qa_date.toLocaleDateString()] == undefined ? '' : plan[task.qa_user_id][qa_date.toLocaleDateString()];

        plan[task.qa_user_id][qa_date.toLocaleDateString()] += task_name+ ',';
        qa_date.setDate(qa_date.getDate() + 1);
        isWeekend(qa_date) ? i : i++;
      }
    });
    console.log(plan)
    setSprintPlan(plan);
  }

  return (
    <>
    <Table striped bordered hover >
      <tr>
        <th>Name</th>
        <th>Leaves</th>
        {dates.map((date) => (
          <th>{date.toDateString()}</th>
        ))}
      </tr>
      {teamMembers.map((member) => (
        <tr>
          <td>{member.name}</td>
          <td><input type="text" name={member.id+'_leave_plan'} onChange={changeLeavePlan}/></td>
          {dates.map((date) => (
            <td className={ leavePlan[member.id] && leavePlan[member.id].split(',').includes(date.getDate().toString()) || isWeekend(date) ? 'bg-red no-padding': 'bg-green no-padding'}>
              {
              leavePlan[member.id] && leavePlan[member.id].split(',').includes(date.getDate().toString()) || isWeekend(date) ?
              "Not Available" :
              sprintPlan[member.id]?.[date.toLocaleDateString()]?.slice(0,-1)
              }
            </td>
          ))}
        </tr>
      ))}

    </Table>
    </>
  )
}