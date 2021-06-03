import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  title: {
    flexGrow: 1,
    fontWeight : 800
  },
  link : {
    '&:hover':{
        cursor : "pointer",
        textDecoration : "none"
    }
  }
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            <Link style={{color:"#fff",textDecoration:"none"}}  className={classes.link} to="/">Stock Analyzer</Link>
          </Typography>
          <Link style={{marginRight:"10px",color : "#fff",textDecoration:"none"}} className={classes.link} to="/">HomePage</Link>
          <Link style={{color:"#fff",textDecoration:"none"}} className={classes.link} to="/compare">Comparator</Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
