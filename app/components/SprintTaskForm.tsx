/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import FeaturesList from "./FeaturesList";
import { supabase } from "../lib/initSupabase";
import MembersList from "./MembersList";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Features from "./Features";
import PlanView from "./PlanView";

function SprintTaskForm(props){

  const [milestones, setMilestones] = useState([]);
  const [sprint_tasks, setSprintTasks] = useState([]);
  const [rows, setRows] = useState(0);
  const [stateKey, setStateKey] = useState(Date.now());

  async function getSprintTasks() {
    const { data } = await supabase.from("sprint_tasks").select().eq('sprint_id', props.sprint_id);
    setSprintTasks(data);
    console.log(sprint_tasks);
    setRows(data.length);
  }

  useEffect(() => {
    getMilestones();
    getSprintTasks();
  }, []);

  async function getMilestones() {
    setMilestones(['Dev Complete', 'QA Complete', 'UAT Complete', 'Go Live']);
  }

  async function addRow(){
    setRows(rows + 1);
    addFeatures()
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
      createSprintTask(sprint_task);
    }
  });
  setStateKey(Date.now());
  }

  async function createSprintTask(sprint_task){
    const { data, error } = await supabase
      .from('sprint_tasks')
      .insert([sprint_task]);
    if (error) console.log('error', error)
    else {
      console.log('data', data)
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

  function changeHandler(value) {
    this.setState({
        value: value
    });
}

  return (
    <>
<br/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
  crossOrigin="anonymous"
/>

    <div >
      <Features>
        </Features>
    </div>
    <br/>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th>Feature</th>
              <th>Milestone</th>
              <th>BE Efforts</th>
              <th>FE Efforts</th>
              <th>QA Efforts</th>
              <th>Dev User</th>
              <th>QA User</th>
              <th>FE User</th>
              <th>Dev Start Date</th>
              <th>FE Start Date</th>
              <th>QA Start Date</th>
              <th>QA Drop Date</th>
              </tr>
            </thead>

            {[...Array(rows).keys()].map((row) => (
            <tr className="sprint_task_rows" data-row_id={row}>
              <td>
                <FeaturesList feature_id={sprint_tasks[row]?.feature_id}/>
              </td>
              <td><select name="milestone" value={sprint_tasks[row]?.milestone} onChange={(e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'milestone')}>
                {milestones.map((milestone) => (
                  <option value={milestone}>{milestone}</option>
                ))}
                </select>
                <input type='hidden' name='id' value={sprint_tasks[row]?.id} />
                </td>
              <td><input type="text" placeholder="BE efforts" name='be_efforts' value={sprint_tasks[row]?.be_efforts}
              onChange={(e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'be_efforts')}
              ></input></td>
              <td><input type="text" placeholder="FE effort" name='fe_efforts' value={sprint_tasks[row]?.fe_efforts}
              onChange={(e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'fe_efforts')}></input></td>
              <td><input type="text" placeholder="QA effort" name='qa_efforts' value={sprint_tasks[row]?.qa_efforts}
              onChange={(e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'qa_efforts')}></input></td>
              <td><MembersList role_type={'dev'} user_id={sprint_tasks[row]?.dev_user_id} row_id={sprint_tasks[row]?.id} onChange={handleChange}/></td>
              <td><MembersList role_type={'qa'} user_id={sprint_tasks[row]?.qa_user_id} row_id={sprint_tasks[row]?.id} onChange={handleChange}/></td>
              <td><MembersList role_type={'fe'} user_id={sprint_tasks[row]?.fe_user_id} row_id={sprint_tasks[row]?.id} onChange={handleChange}/></td>
                <td>
                  <input type="date" placeholder="Dev Start date" name='dev_start_date' value={sprint_tasks[row]?.dev_start_date} onChange={
                    (e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'dev_start_date')
                  }></input>
                </td>
                <td>
                  <input type="date" placeholder="Fe Start date" name='fe_start_date' value={sprint_tasks[row]?.fe_start_date} onChange={
                    (e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'fe_start_date')
                  }></input>
                </td>
                <td>
                  <input type="date" placeholder="Dev End date" name='qa_start_date' value={sprint_tasks[row]?.qa_start_date} onChange={
                    (e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'qa_start_date')
                  }></input>
                </td>
              <td><input type="date" placeholder="QA drop date" name='qa_drop_date' value={sprint_tasks[row]?.qa_drop_date} onChange={
                    (e) => handleChange(sprint_tasks[row]?.id, e.target.value, 'qa_drop_date')
                  }></input></td>
              <td><Button variant='danger'>Delete</Button></td>
            </tr>
            ))}
            <tr>
                <td><Button onClick={addRow} variant='info'>Add Row</Button></td>
              </tr>
          </table>
          <div><PlanView sprint_id={props.sprint_id} team_id={props.team_id} key={stateKey}/></div>
          </>
  );
}
export default SprintTaskForm;