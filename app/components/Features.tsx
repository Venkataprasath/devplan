/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { supabase } from "../lib/initSupabase";
import Form from 'react-bootstrap/Form';


function Features() {
  const [features, setFeatures] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function addFeature() {
    const feature_name = document.getElementById('feature_name').value;
    const jira_id = document.getElementById('jira_id').value;
    const lld = document.getElementById('lld').checked;
    const { data, error } = await supabase
      .from('features')
      .insert([
        { name: feature_name, jira_id: jira_id }
      ]);
    if (error) console.log('error', error)
    else {
      console.log('data', data)
      handleClose();
    }
  }


  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add new feature
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New feature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
      <Form.Group className="mb-3" controlId="feature_name">
        <Form.Label>Feature Name</Form.Label>
        <Form.Control type="text" placeholder="Enter feature name" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="jira_id">
        <Form.Label>Jira ID</Form.Label>
        <Form.Control type="text" placeholder="Enter jira id" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="lld">
        <Form.Check type="checkbox" label="LLD required" />
      </Form.Group>
    </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addFeature}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Features;