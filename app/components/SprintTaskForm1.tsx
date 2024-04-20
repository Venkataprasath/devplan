import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FeaturesList from './FeaturesList';
import MembersList from './MembersList';
import { supabase } from '../lib/initSupabase';
import PlanView1 from './PlanView1';
import { Button, Divider, Link } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Features from './Features';

export default function SprintTaskForm1(props) {
  
  const [milestones, setMilestones] = useState([]);
  const [sprint_tasks, setSprintTasks] = useState([]);
  const [rows, setRows] = useState(0);
  const [stateKey, setStateKey] = useState(Date.now());
  const [min_date, setMinDate] = useState(formattedDate(new Date()));

  function formattedDate(date)
  {
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1; // Months start at 0!
      let dd = date.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      return yyyy + '-' + mm + '-' + dd;
  }
  async function getMinDate(){
    const {data} = await supabase.from('sprints').select().eq('id', props.sprint_id);
    setMinDate(formattedDate(new Date(data[0].start_date)));
  }

  async function getSprintTasks() {
    const { data } = await supabase.from("sprint_tasks").select().eq('sprint_id', props.sprint_id).order('id', {ascending: true});
    setSprintTasks(data);
    console.log(sprint_tasks);
    setRows(data.length);
  }

  useEffect(() => {
    getMinDate();
    getMilestones();
    if(Object.keys(sprint_tasks).length === 0){
    getSprintTasks();
    }
    
  }, [sprint_tasks]);

  async function getMilestones() {
    setMilestones(['Dev Complete', 'QA Complete', 'UAT Complete', 'Go Live']);
  }

  async function addRow(){
    setSprintTasks([...sprint_tasks, {}]);
  }

  async function addFeatures(){
    Array.from(document.getElementsByClassName('sprint_task_rows')).forEach((row) => {
    const sprint_task = {
      feature_id: (row.querySelector('select[name="feature"]')as HTMLInputElement).value,
      milestone: (row.querySelector('select[name="milestone"]')as HTMLInputElement).value,
      be_efforts: (row.querySelector('input[name="be_efforts"]')as HTMLInputElement).value,
      fe_efforts: (row.querySelector('input[name="fe_efforts"]')as HTMLInputElement).value,
      qa_efforts: (row.querySelector('input[name="qa_efforts"]')as HTMLInputElement).value,
      dev_user_id: (row.querySelector('select[name="dev_user"]')as HTMLInputElement).value,
      qa_user_id: (row.querySelector('select[name="qa_user"]')as HTMLInputElement).value,
      qa_drop_date: (row.querySelector('input[name="qa_drop_date"]')as HTMLInputElement).value,
      dev_start_date: (row.querySelector('input[name="dev_start_date"]')as HTMLInputElement).value,
      qa_start_date: (row.querySelector('input[name="qa_start_date"]')as HTMLInputElement).value,
      fe_user_id: (row.querySelector('select[name="fe_user"]')as HTMLInputElement).value,
      fe_start_date: (row.querySelector('input[name="fe_start_date"]')as HTMLInputElement).value,
      sprint_id: props.sprint_id,
    }
    const sprint_task_id = (row.querySelector('input[name="id"]')as HTMLInputElement)?.value;
    removeEmptyValues(sprint_task);
    if(sprint_task_id){
      updateSprintTask(sprint_task_id, sprint_task);
    } else {
      createSprintTask(sprint_task, row);
    }
  });
  setStateKey(Date.now());
  }

  async function createSprintTask(sprint_task, row){
    const { data, error } = await supabase
      .from('sprint_tasks')
      .insert([sprint_task]).select();
    if (error) console.log('error', error)
    else {
      row.querySelector('input[name="id"]').value = data[0].id;
      console.log('data', data)
      sprint_tasks.pop();
      setSprintTasks([...sprint_tasks, data[0]]);
    }
  }

  function removeEmptyValues(obj){
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
    Object.keys(obj).forEach(key => obj[key] === '' && delete obj[key]);
  }

  async function updateSprintTask(sprint_task_id, sprint_task){
    const { data, error } = await supabase
      .from('sprint_tasks')
      .update(sprint_task)
      .match({ 'id': sprint_task_id });
    if (error) console.log('error', error)
    else {
      console.log('data', data)
    }
  }

  function handleChange(id, value, hash_key){
    const newData = sprint_tasks.map(row => {
      if (row.id === id) {
        row[hash_key] = value;
        return row;
      }
      return row;
    });
    console.log(newData)
    setSprintTasks(newData)
    addFeatures()
  }

  async function deleteSprintTask(e) {
    const id = e.target.id;
    console.log(id)
    const newData = sprint_tasks.filter(row => row.id != id);
    const { error } = await supabase
    .from('sprint_tasks')
    .delete()
    .eq('id', id)
    setSprintTasks(newData);
    setStateKey(Date.now());
  }

  return (
    <>
    <Features />
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
              <TableCell>Feature</TableCell>
              <TableCell>Milestone</TableCell>
              <TableCell>BE Efforts</TableCell>
              <TableCell>FE Efforts</TableCell>
              <TableCell>QA Efforts</TableCell>
              <TableCell>Dev User</TableCell>
              <TableCell>QA User</TableCell>
              <TableCell>FE User</TableCell>
              <TableCell>Dev Start Date</TableCell>
              <TableCell>FE Start Date</TableCell>
              <TableCell>QA Start Date</TableCell>
              <TableCell>QA Drop Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {[...Array(sprint_tasks.length).keys()].map((row) => (
            <TableRow
              key={row}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              className='sprint_task_rows'
            >
              <TableCell component="th" scope="row">
                <FeaturesList feature_id={sprint_tasks[row]?.feature_id}/>
              </TableCell>
              <TableCell align="right">
                <select name="milestone" value={sprint_tasks[row]?.milestone} onChange={(e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'milestone')}>
                {milestones.map((milestone) => (
                  <option value={milestone}>{milestone}</option>
                ))}
                </select>
                <input type='hidden' name='id' value={sprint_tasks[row]?.id} />
              </TableCell>
              <TableCell align="right"><input type="text" placeholder="BE efforts" name='be_efforts' value={sprint_tasks[row]?.be_efforts}
              onChange={(e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'be_efforts')}
              ></input></TableCell>
              <TableCell align="right"><input type="text" placeholder="FE effort" name='fe_efforts' value={sprint_tasks[row]?.fe_efforts}
              onChange={(e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'fe_efforts')}></input></TableCell>
              <TableCell align="right"><input type="text" placeholder="QA effort" name='qa_efforts' value={sprint_tasks[row]?.qa_efforts}
              onChange={(e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'qa_efforts')}></input></TableCell>
              <TableCell align="right"><MembersList role_type={'dev'} user_id={sprint_tasks[row]?.dev_user_id} row_id={sprint_tasks[row]?.id} onChange={handleChange}/></TableCell>
              <TableCell align="right"><MembersList role_type={'qa'} user_id={sprint_tasks[row]?.qa_user_id} row_id={sprint_tasks[row]?.id} onChange={handleChange}/></TableCell>
              <TableCell align="right"><MembersList role_type={'fe'} user_id={sprint_tasks[row]?.fe_user_id} row_id={sprint_tasks[row]?.id} onChange={handleChange}/></TableCell>
              <TableCell align="right">
                <input type="date" min={min_date} placeholder="Dev Start date" name='dev_start_date' value={sprint_tasks[row]?.dev_start_date} onChange={
                  (e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'dev_start_date')
                }></input>
              </TableCell>
              <TableCell align="right">
                <input type="date" min={min_date} placeholder="Fe Start date" name='fe_start_date' value={sprint_tasks[row]?.fe_start_date} onChange={
                  (e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'fe_start_date')
                }></input>
              </TableCell>
              <TableCell align="right">
                <input type="date" min={min_date}  placeholder="QA Start date" name='qa_start_date' value={sprint_tasks[row]?.qa_start_date} onChange={
                  (e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'qa_start_date')
                }></input>
              </TableCell>
              <TableCell align="right"><input type="date" placeholder="QA drop date" name='qa_drop_date' value={sprint_tasks[row]?.qa_drop_date} onChange={
                  (e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'qa_drop_date')
                }></input></TableCell>
                <TableCell><Link
  component="button"
  variant="body2"
  onClick={() => {
    deleteSprintTask({target: {id: sprint_tasks[row]?.id}});
  }}
><DeleteOutlineOutlinedIcon color="error"/>
</Link></TableCell>
            </TableRow>
          ))}
          <TableRow>
                <TableCell><Button onClick={addRow} variant="contained">Add Row</Button></TableCell>
              </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
              <Divider/>
              <Divider/>
              <Divider/>
              <Divider />
    <PlanView1 sprint_id={props.sprint_id} team_id={props.team_id} key={stateKey}/>
</>
  );
}
