import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { supabase } from '../lib/initSupabase';
import { Box, Button, Grid } from '@mui/material';

export default function PlanView1(props) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [leavePlan, setLeavePlan] = useState({});
  const [dates, setDates] = useState([]);
  const [sprint_tasks, setSprintTasks] = useState([]);
  const [sprintPlan, setSprintPlan] = useState({});

  useEffect(() => {
    getTeamMembers();
    if(Object.keys(leavePlan).length === 0){
      getLeavePlan();
    }
    getDates();
    setWorkItem();
  }, [leavePlan]);

  async function getTeamMembers() {
    const { data } = await supabase.from("members").select().eq('team_id', props.team_id);
    setTeamMembers(data);
    console.log(teamMembers);
  }

  async function getLeavePlan() {
    const {data} = await supabase.from('leaves').select().eq('sprint_id', props.sprint_id);
    let plan = {};
    data.map((leave) => {
      plan[leave.member_id] = leave.leaves;
    })

    setLeavePlan(plan);
    console.log("Leave plan" + JSON.stringify(leavePlan) + JSON.stringify(plan));
  }



  async function getDates() {
    console.log("Leave plan" + JSON.stringify(leavePlan));
    let dates = [];
    const { data } = await supabase.from("sprints").select().eq('id', props.sprint_id);
    for (let i = 0; i < 14; i++) {
      const temp_date = new Date(data[0].start_date);
      temp_date.setDate(temp_date.getDate() + i);
      console.log(temp_date)
      dates.push(temp_date);
    }
    setDates(dates);
    // getSprintTasks();
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
        isWeekend(date) || (leavePlan[task.dev_user_id] && leavePlan[task.dev_user_id].split(',').includes(date.getDate().toString())) ? i : i++;
      }
      date = new Date(task.fe_start_date);
      for (let i = 0; i < task.fe_efforts; ) {
        plan[task.fe_user_id][date.toLocaleDateString()] = plan[task.fe_user_id][date.toLocaleDateString()] == undefined ? '' : plan[task.fe_user_id][date.toLocaleDateString()];

        plan[task.fe_user_id][date.toLocaleDateString()] += task_name+ ',';
        date.setDate(date.getDate() + 1);
        isWeekend(date) || (leavePlan[task.fe_user_id] && leavePlan[task.fe_user_id].split(',').includes(date.getDate().toString()))  ? i : i++;
      }
      let qa_date = new Date(task.qa_start_date);
      for (let i = 0; i < task.qa_efforts; ) {
        plan[task.qa_user_id][qa_date.toLocaleDateString()] = plan[task.qa_user_id][qa_date.toLocaleDateString()] == undefined ? '' : plan[task.qa_user_id][qa_date.toLocaleDateString()];

        plan[task.qa_user_id][qa_date.toLocaleDateString()] += task_name+ ',';
        qa_date.setDate(qa_date.getDate() + 1);
        isWeekend(qa_date) || (leavePlan[task.qa_user_id] && leavePlan[task.qa_user_id].split(',').includes(qa_date.getDate().toString()))  ? i : i++;
      }
    });
    console.log(plan)
    setSprintPlan(plan);
  }

  function selectElementContents(el) {
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
      range = document.createRange();
      sel = window.getSelection();
      sel.removeAllRanges();
      try {
        range.selectNodeContents(el);
        sel.addRange(range);
      } catch (e) {
        range.selectNode(el);
        sel.addRange(range);
      }
    } else if (body.createTextRange) {
      range = body.createTextRange();
      range.moveToElementText(el);
      range.select();
    }
  }

  function copyTable(){
    selectElementContents(document.getElementById('plan_table'));
  }
  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" id='plan_table'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Leave Plan</TableCell>
            {dates.map((date) => (
              <TableCell>{date.toDateString()}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {teamMembers.map((member) => (
         <TableRow
         key={member.id}
         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
       >
          <TableCell component="th" scope="row">
                {member.name}
              </TableCell>
          <TableCell><input type="text" name={member.id+'_leave_plan'} onChange={changeLeavePlan} value={leavePlan[member.id]} placeholder="Enter leaves ex: 1,2"/></TableCell>
          {dates.map((date) => (
            <TableCell className={ leavePlan[member.id] && leavePlan[member.id].split(',').includes(date.getDate().toString()) || isWeekend(date) ? 'bg-red no-padding': 'bg-green no-padding'}>
              {
              leavePlan[member.id] && leavePlan[member.id].split(',').includes(date.getDate().toString()) || isWeekend(date) ?
              "Not Available" :
              sprintPlan[member.id]?.[date.toLocaleDateString()]?.slice(0,-1)
              }
            </TableCell>
          ))}
        </TableRow>
      ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
