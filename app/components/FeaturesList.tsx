/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { supabase } from "../lib/initSupabase";


function FeaturesList(props) {
  console.log(props)
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    getFeatures();
  }, []);


  async function getFeatures() {
    const { data } = await supabase.from("features").select();
    setFeatures(data);
  }

  return (
    <select name='feature' value={props.feature_id}>
      {features.map((feature) => (
        <option value={feature.id}>{feature.name}</option>
      ))}
    </select>
  );
}

export default FeaturesList;