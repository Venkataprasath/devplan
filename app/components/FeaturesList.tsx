/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { supabase } from "../lib/initSupabase";


function FeaturesList(props) {
  console.log(props)
  const [features, setFeatures] = useState([]);
  const [ selectedFeature, setSelectedFeature ] = useState(props.feature_id);

  useEffect(() => {
    getFeatures();
    setSelectedFeature(props.feature_id)
  }, []);


  async function getFeatures() {
    const { data } = await supabase.from("features").select();
    setFeatures(data);
  }

  return (
    <select name='feature' value={selectedFeature} data-value={selectedFeature}>
      {features.map((feature) => (
        <option value={feature.id}>{feature.name}</option>
      ))}
    </select>
  );
}

export default FeaturesList;