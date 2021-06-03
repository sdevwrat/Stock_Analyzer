import React from "react";
import { compose } from 'redux';
import {connect} from 'react-redux';
import '../css/style.css'
import Button from '@material-ui/core/Button';
import { fetchData } from "../actions/dataAction";
import { withStyles } from '@material-ui/core/styles';
import convertCSVToArray from "convert-csv-to-array"
import Loading from '../helper/loading'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MultiSelect from "react-multi-select-component";
import companyList from '../helper/companyList'
import Alert from '@material-ui/lab/Alert';

const styles = theme => ({
    formControl: {
        margin : "25px",
        minWidth: 200,
      },
      selectEmpty: {
        marginTop: theme.spacing(4),
      },
  });
  
  
class ComparePage extends React.Component{

    constructor(){
        super();
        this.state = {
            loading : false,
            options : [],
            data_arr : [],
            prevSelected : [],
            selected : [],
            alert : ""
        }
    }

    handleSelect = (company) =>{
        this.setState({
            selected : company
        })
    }

    componentDidMount = () =>{
        const options = [];
        companyList.map(company => {
            let obj = {}
            obj.value = company.symbol;
            obj.label = company.name;
            options.push(obj);
        })
        this.setState({options})
    }

    componentDidUpdate(prevProps) {

  
        const {store_data,company} = this.props;
        let {data_arr,selected} = this.state;

        if (store_data !== prevProps.store_data) {
            if(store_data.Note){    // API limit is 5 per minute
                this.setState({data_arr : [], alert : "Please try after 1 minute",loading : false,prevSelected:[]})
                setTimeout(
                    () => this.setState({alert : ""}),
                    10000
                )
                return ;
            }
            const data_string = store_data.replace("\r", "");
            let data = convertCSVToArray(data_string, {separator: ',',});    

            data[1].company = company
            data_arr.push(data[1]);

            this.setState({data_arr});
            if(data_arr.length === selected.length)
                this.setState({loading : false})
        }
    }

    handleCompare = () =>{

        const {selected ,prevSelected} = this.state;

        if(prevSelected === selected)
            return ;

        this.setState({prevSelected:selected, data_arr: [], loading :true })

        selected.map(async (company) => {
            const  params = {
            function:"TIME_SERIES_INTRADAY",
            symbol : company.value,
            interval: "60min",
            apikey:"U0UT222ATR9SOPUN",
            datatype:"csv",
        }
        await this.props.fetchData(params,company.label);
        })

    }

    render(){

        const { classes } = this.props;
        const {loading,data_arr,options,selected,alert} = this.state;
        return(
            <div>

                {
                    !!loading && <Loading />
                }
                {!!alert.length && <Alert severity="warning" style={{width:"60%",marginLeft:"20%"}}>Call limit reached. Please try again after 1 minute</Alert>}
                <div style={{maxWidth : "400px",margin:"25px 37%"}}>
                    <MultiSelect
                        
                        options={options}
                        value={selected}
                        onChange={this.handleSelect}
                        labelledBy="Select"
                        overrideStrings = {
                            { "allItemsAreSelected" : "All Companies are selected.",
                              "selectSomeItems": "Select Companies.."
                            }
                        }
                    />
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick = {this.handleCompare} disabled = {selected.length < 2} >
                        Compare
                    </Button>
                </div>
                {   data_arr.length < 2 && 
                        <p style={{fontSize:"18px",fontWeight:"400"}}>Please select 2 or more companies for comparing</p>
                }
                {
                    data_arr.length >= 2 &&
                        <TableContainer component={Paper} style={{width:"94%",margin:"16px 0 0 3%"}}>
                            <div style={{textAlign:"left",margin:"10px",fontWeight:"600",fontSize:"18px",color:"#584dff"}}>Latest Data of the selected Companies </div>
                            <Table className={classes.table} aria-label="simple table" >
                                <TableHead style={{borderBottom : "2px solid"}}>
                                    <TableRow >
                                        <TableCell>Company</TableCell>
                                        <TableCell align="right">Volume</TableCell>
                                        <TableCell align="right">Open</TableCell>
                                        <TableCell align="right">High</TableCell>
                                        <TableCell align="right">Low</TableCell>
                                        <TableCell align="right">Close</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data_arr.map((data,idx) => (
                                        <TableRow key={idx}>
                                            <TableCell component="th" scope="row">{data.company}</TableCell>
                                            <TableCell align="right">{data.volume}</TableCell>
                                            <TableCell align="right">{data.open}</TableCell>
                                            <TableCell align="right">{data.high}</TableCell>
                                            <TableCell align="right">{data.low}</TableCell>
                                            <TableCell align="right">{data.close}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
            </div>
        );
    }
}

const mapStateToProps = state =>({
    company : state.company,
    store_data : state.data
});

const mapDispatchToProps = (dispatch) =>{
    return {
        fetchData : (params,company) => dispatch(fetchData(params,company)) 
    }
};

export default compose(
    withStyles(styles),
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
  )(ComparePage);