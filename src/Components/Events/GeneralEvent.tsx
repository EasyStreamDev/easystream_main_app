import React from 'react';
import './GeneralEvent.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AiOutlineBug, AiOutlinePlayCircle, AiOutlineSound, AiOutlineStop, AiOutlineVideoCamera } from 'react-icons/ai';
import { MdPanoramaHorizontal } from 'react-icons/md';
import { IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { BsTrash } from 'react-icons/bs';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NumericInput from 'material-ui-numeric-input';

export enum EventType {
  ChangeCamera,
  ChangeScene,
  StartLive,
  StopLive,
  ActivateSoundboard
}

export const GeneralEvent = () => {

  const keysEventType = Object.keys(EventType).filter(k => typeof EventType[k as any] === "number");
  const valuesEventType = keysEventType.map(k => EventType[k as any]);

  const [open, setOpen] = React.useState(false);
  const [newEventName, setNewEventName] = React.useState("");
  const [newEventSelected, setNewEventSelected] = React.useState(0);
  const [newEventParam, setNewEventParam] = React.useState(0)

  const handleOnChangeSelect = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as EventType;
    setNewEventSelected(value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [ exampleEvents, setExampleEvents ] = React.useState([
    {
      id: 1,
      name: "Change to camera 2",
      event: EventType.ChangeCamera,
      param_value: 2
    },
    {
      id: 4,
      name: "Cut the live with 30delay",
      event: EventType.StopLive,
      param_value: 30
    },
    {
      id: 5,
      name: "LoL Sound",
      event: EventType.ActivateSoundboard,
      param_value: 8
    }
  ])

  const handleSave = () => {
    console.log("newEventName", newEventName);
    console.log("newEventSelected", newEventSelected);
    console.log("newEventParam", newEventParam);
    if (newEventName !== "") {
      let newElem: any = {
        id: Math.max(...exampleEvents.map(o => o.id)) + 1,
        name: newEventName,
        event: newEventSelected as EventType,
      }
      if (newEventParam) {
        newElem.param_value = newEventParam;
      }

      const newList = exampleEvents.concat([newElem]);

      setExampleEvents(newList);
      alert("Event saved");
    } else {
      // Put alert
      alert("Missing parameters");
    }
    setNewEventName("");
    setNewEventSelected(0);
    setNewEventParam(0);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  }


    function deleteEvent(id: number) {
      const newList = exampleEvents.filter((item) => item.id !== id);

      setExampleEvents(newList);
    }

    function getEvent(eventEnum: any) {
      if (eventEnum === EventType.ActivateSoundboard)
        return "Activate Soundboard";
      if (eventEnum === EventType.ChangeCamera)
        return "Change the camera"
      if (eventEnum === EventType.ChangeScene)
        return "Change the scene"
      if (eventEnum === EventType.StartLive)
        return "Start the live"
      if (eventEnum === EventType.StopLive)
        return "Stop the live"
      return ""
    }

    function getIcon(eventEnum: EventType) {
      if (eventEnum === EventType.ActivateSoundboard)
        return <AiOutlineSound />
      if (eventEnum === EventType.ChangeCamera)
        return <AiOutlineVideoCamera />
      if (eventEnum === EventType.ChangeScene)
        return <MdPanoramaHorizontal />
      if (eventEnum === EventType.StartLive)
        return <AiOutlinePlayCircle />
      if (eventEnum === EventType.StopLive)
        return <AiOutlineStop />
      return <AiOutlineBug />
    }

    return (
      <>
        <div className="container events-container">

          <h2>List of Events</h2>

          {
            exampleEvents.length === 0 ? (
              <>
                <h4>No events found.</h4>
              </>
            ) : (exampleEvents.map((item, index) => {
              return (
                <Card key={index} className="card-event" sx={{ minWidth: 150, minHeight: 100, margin: 2 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      { getIcon(item.event) } "{ item.name }"
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      { getEvent(item.event) }
                    </Typography>
                    <Typography variant="body2">
                      { item.param_value ? "Parameter:" + item.param_value : "" }
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing className="rightAlignItem">
                    <IconButton onClick={() => deleteEvent(item.id)} aria-label="delete">
                      <BsTrash />
                    </IconButton>
                  </CardActions>
                </Card>
              )
            }))
          }

        </div>

        <Dialog open={open} onClose={handleCancel}>
          <DialogTitle>Add Event</DialogTitle>
          <DialogContent>
            <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aenean hendrerit, nisl ut mollis placerat, lorem risus feugiat purus, quis tincidunt nisi ipsum eu risus.
            Nulla at mollis tortor. Morbi accumsan mauris ac euismod tempor.
            Curabitur non consequat dolor. Nunc ut blandit tortor.
            Pellentesque viverra volutpat est, vel hendrerit neque elementum nec.
            </DialogContentText>

            <div className="form-item">
              <TextField
                autoFocus
                id="name"
                label="Name of the event"
                type="text"
                value={newEventName}
                variant="standard"
                onChange={(newValue) => setNewEventName(newValue.target.value)}
              />
            </div>

            <div className="form-item">
              <InputLabel id="select-event-label">Event</InputLabel>
              <Select
                labelId="select-event-label"
                id="select-event"
                value={newEventSelected}
                onChange={handleOnChangeSelect}
                autoWidth
                label="Event"
              >
                {
                  keysEventType.map((k) => {
                    return (<MenuItem key={EventType[k as any]} value={EventType[k as any]}>{getEvent(EventType[k as any])}</MenuItem>)
                  })
                }
              </Select>
            </div>

            <div className="form-item">
              <NumericInput
                name='Parameter event'
                precision={0}
                decimalChar=','
                thousandChar='.'
                label='Parameter event'
                onChange={(event) => setNewEventParam(event.target.value as number)}
                variant='outlined'
              />
            </div>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <div className="add_button_pos">
          <Button variant="contained" className="add_button" onClick={handleClickOpen}
          >
            Add Event
          </Button>
        </div>
      </>
    );
}
