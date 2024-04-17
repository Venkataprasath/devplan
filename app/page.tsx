/* eslint-disable react/jsx-key */
'use client';
import Image from "next/image";
import { useState } from 'react';
import FeaturesList from "./components/FeaturesList";
import SprintTaskForm from "./components/SprintTaskForm";


export default function Home() {
  const [sprintNumber, setSprintNumber] = useState("");
    const [sprintStartDate, setSprintStartDate] = useState("");
    const [sprintEndDate, setSprintEndDate] = useState("");
    const [showTable, setShowTable] = useState(false);
    const [dates, setDates] = useState([new Date()]);
    const [showLeavePlanForm, setShowLeavePlanForm] = useState(false);
    const [leavePlan, setLeavePlan] = useState({});
    const [features, setFeatures] = useState([]);
    const teamMembers = ['Venkat', 'Kasi', 'Sridhar']
    const qaMembers = ['Harini', 'Ram', 'Prasanth']
    const milestones = ['Dev Complete', 'QA Complete', 'Go Live']
  function onSprintAdd() {
    alert("Sprint added");
    let dates = []
    for (let i = 0; i < 14; i++) {
      const date = new Date(sprintStartDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    console.log(dates);
    setDates(dates);
    // setShowTable(true);
    setShowLeavePlanForm(true);
  }

  function addFeature(){
    console.log("Feature added");
    const feature = {
      feature: (document.querySelector('input[name="feature"]') as HTMLInputElement).value,
      lld: (document.querySelector('input[name="lld"]') as HTMLInputElement).value,
      milestone: (document.querySelector('input[name="milestone"]') as HTMLInputElement).value,
      be_efforts: (document.querySelector('input[name="be_efforts"]') as HTMLInputElement).value,
      fe_efforts: (document.querySelector('input[name="fe_efforts"]') as HTMLInputElement).value,
      qa_efforts: (document.querySelector('input[name="qa_efforts"]') as HTMLInputElement).value,
      dev_user: (document.querySelector('input[name="dev_user"]') as HTMLInputElement).value,
      qa_user: (document.querySelector('input[name="qa_user"]') as HTMLInputElement).value,
      qa_drop_date: (document.querySelector('input[name="qa_drop_date"]') as HTMLInputElement).value,
    }
    setFeatures([...features, feature]);
  }

  function drawTable() {
    const table = document.createElement('table');
    table.innerHTML = `
      <tr>
        <th>Sprint Number</th>
        <th>Start Date</th>
        <th>End Date</th>
      </tr>
      <tr>
        <td>${sprintNumber}</td>
        <td>${sprintStartDate}</td>
        <td>${sprintEndDate}</td>
      </tr>
    `;
    document.body.appendChild(table);
  }

  const handleLeavePlan = (e) => {
    const name = e.target.name.replace('leave_dates_', '')
    const value = e.target.value;
    console.log({
      ...leavePlan,
      [name]: value
    })
    setLeavePlan({
      ...leavePlan,
      [name]: value
    });

  }


  return (
    <div>
      <h1>Dev Planner</h1>
      <input type="text" placeholder="Add sprint number" name="sprint_number" onChange={(e) => setSprintNumber(e.target.value)}/>
      <input type="date" placeholder="Add sprint start date" name="sprint_start_date" onChange={(e) => setSprintStartDate(e.target.value)}/>
      <input type="date" placeholder="Add sprint end date" name="sprint_end_date" onChange={(e) => setSprintEndDate(e.target.value)}/>
      <button
          type="submit"
          onClick={onSprintAdd}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>

        {showLeavePlanForm &&
        <>
        {teamMembers.map((member) => (
          <div>
            <h2>{member}</h2>
            <label>Leave days:</label><input type="text" placeholder="Add comma separated dates" name={'leave_dates_'+member} onChange={handleLeavePlan}/>
          </div>
        ))}
        <button
          type="submit"
          onClick={() => setShowTable(true)}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >Show table</button>
        </>}
        { showTable && <div>
          <h2>Leave Plan</h2>
          {teamMembers.map((member) => (
            <div>
              <h2>{member}</h2>
              <p>{leavePlan[member]}</p>
            </div>
          ))}
        </div>
        }
        {showTable &&
        <>
        <table>
          <tr>
            <th>Name</th>
            <th>Leaves</th>
            {dates.map((date) => (
              <th>{date.toDateString()}</th>
            ))}
          </tr>

          {teamMembers.map((member) => (
            <tr>
              <td>{member}</td>
              <td>{leavePlan[member]}</td>
              {dates.map((date) => (
                <td >
                  {leavePlan[member] && leavePlan[member].split(',').includes(date.getDate().toString()) ? <div className="bg-red-500 w-4 h-4 rounded-full"></div> : <div className="bg-green-500 w-4 h-4 rounded-full"></div>}
                </td>
              ))}
            </tr>
          ))}
        </table>
        </>}
        <div>
          <SprintTaskForm sprint_number={1}/>
          </div>

          {features.length > 0 && <table>
            <tr>
              <th>Feature</th>
              <th>LLD</th>
              <th>Milestone</th>
              <th>BE Efforts</th>
              <th>FE Efforts</th>
              <th>QA Efforts</th>
              <th>Dev User</th>
              <th>QA User</th>
              <th>QA Drop Date</th>
              </tr>
              {features.map((feature) => (
                <tr>
                  <td>{feature.feature}</td>
                  <td>{feature.lld}</td>
                  <td>{feature.milestone}</td>
                  <td>{feature.be_efforts}</td>
                  <td>{feature.fe_efforts}</td>
                  <td>{feature.qa_efforts}</td>
                  <td>{feature.dev_user}</td>
                  <td>{feature.qa_user}</td>
                  <td>{feature.qa_drop_date}</td>
                </tr>
              ))}
          </table>}

    </div>
     );
}

