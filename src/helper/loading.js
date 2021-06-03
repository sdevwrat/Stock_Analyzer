import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    position:"relative",
    top : "40%",
    zIndex:"101",
    width: '78%',
    marginLeft : "13%",
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function LinearIndeterminate() {
  const classes = useStyles();

  return (
    <div className="panel__refresh">
        <div className={classes.root}>
                <LinearProgress />
                <LinearProgress color="secondary" />
        </div>
    </div>
  );
}
