import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { supabase } from '../lib/initSupabase';
import { Checkbox, FormControlLabel } from '@mui/material';

export default function Features() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add new feature
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const feature_name = formJson.feature_name;
            handleClose();
            const { data, error } = await supabase
              .from('features')
              .insert([
                { name: feature_name, jira_id: formJson.jira_id }
              ]);
            if (error) console.log('error', error)
            else {
              console.log('data', data)
              handleClose();
            }
          },
        }}
      >
        <DialogTitle>Add new feature</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="feature_name"
            name="feature_name"
            label="Enter feature name"
            type="text"
            fullWidth
            variant="standard"
          />

          <TextField
            autoFocus
            required
            margin="dense"
            id="jira_id"
            name="jira_id"
            label="Enter jira id"
            type="text"
            fullWidth
            variant="standard"
          />
          <FormControlLabel control={<Checkbox defaultChecked id="lld_required"/>} label="LLD Required"  />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
