import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { compose } from 'redux';
import '../css/style.css'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { fetchData } from "../actions/dataAction";
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import convertCSVToArray from "convert-csv-to-array"
import Loading from '../helper/loading'
import companyList from '../helper/companyList'
import Alert from '@material-ui/lab/Alert';



const styles = theme => ({
    formControl: {
        flexGrow : 1,
        margin : "25px auto",
        minWidth: 200,
      },
      selectEmpty: {
        marginTop: theme.spacing(4),
      },
  });
class Homepage extends React.Component{

    constructor(){
        super();
        this.state = {
            options : {},
            symbol: "GOOGL",
            data_string : "",
            loading : false,
            alert : ""
        }
    }

    handleChange = async(e) =>{

        this.setState({
            symbol:e.target.value,
        })
        const params = {
            function:"TIME_SERIES_INTRADAY",
            symbol : e.target.value,
            interval: "60min",
            apikey:"U0UT222ATR9SOPUN",
            datatype:"csv",
        }

        let company = companyList.find(item => item.symbol === e.target.value);
        
        this.setState({loading:true})
        await this.props.fetchData(params,company.name);
    }

    async componentDidUpdate(prevProps) {

        const {store_data} = this.props;

        if (store_data !== prevProps.store_data) {
            this.setState({
                data_string : this.props.store_data
            })
            if(store_data.Note){
                this.setState({alert : "Please try after 1 minute",loading : false})
                setTimeout(
                    () => this.setState({alert : ""}),
                    10000
                )
                return;
            }
            else{
                this.updateChart()
            }
          }
      }

    componentDidMount = async () =>{
        const { fetchData } = this.props;

        const params = {
            function:"TIME_SERIES_INTRADAY",
            symbol : this.state.symbol,
            interval: "60min",
            apikey: "U0UT222ATR9SOPUN",
            datatype:"csv",
        }
        
        this.setState({loading:true})
        await fetchData(params,"GOOGLE");
        this.updateChart()
    }
    updateChart = () => {

        if(this.props.store_data.Note)
            return;
        const {company} = this.props
        const data_string = this.props.store_data.replace("\r", "");
        const data = convertCSVToArray(data_string, {
            separator: ',',
        });

        var ohlc = [],
        volume = [],
        dataLength = data.length,
        i = 1;

        for (i; i < dataLength; i += 1) {
            ohlc.push([
                data[i].timestamp, // the date
                data[i].open, // open
                data[i].high, // high
                data[i].low, // low
                data[i].close // close
            ]);

            volume.push([
                data[i].timestamp, // the date
                data[i].volume // the volume
            ]);
        }

        const options = {
            chart : {
                borderWidth: 0.5,
                height:600
            },
            title : {
                text : `Stock data of ${company}`,
                style:{
                    color : "green",
                    fontSize : "24px",
                    fontWeight : "800"
                }
            },
            xAxis: {
                labels : {
                    enabled: false
                },
                reversed : true,
            },
            yAxis: [{
                labels: {
                    align: 'right'
                },
                height: '90%'
            }, {
                labels: {
                    align: 'left'
                },
                top: '80%',
                height: '20%',
                offset: 0,
            }],
            rangeSelector:{
                enabled : false
            },
            tooltip: {
                shape: 'square',
                headerShape: 'callout',
                borderWidth: 0,
                shadow: true,
                positioner: function (width, height, point) {
                    var chart = this.chart,
                        position;
    
                    if (point.isHeader) {
                        position = {
                            x: Math.max(
                                // Left side limit
                                chart.plotLeft,
                                Math.min(
                                    point.plotX + chart.plotLeft - width / 2,
                                    // Right side limit
                                    chart.chartWidth - width - chart.marginRight
                                )
                            ),
                            y: point.plotY
                        };
                    } else {
                        position = {
                            x: point.series.chart.plotLeft,
                            y: point.series.yAxis.top - chart.plotTop
                        };
                    }
    
                    return position;
                }
            },
            series: [{
                type: 'ohlc',
                id: 'aapl-ohlc',
                name: `${company} Stock Price`,
                data: ohlc
            }, {
                type: 'column',
                id: `aapl-volume`,
                name: `${company} Volume`,
                data: volume,
                yAxis: 1
            }],
            stockTools: {
                gui: {
                    enabled: false                 }
            }
        };
        this.setState({options,loading:false})
    }
    render(){
        
        const { classes } = this.props;
        const {symbol,loading,alert} = this.state;

        
        return(
            <div>

                {
                    loading && <Loading />
                }
                {!!alert.length && <Alert severity="warning" style={{width:"60%",marginLeft:"20%"}}>Call limit reached. Please try again after 1 minute</Alert>}
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Select Company</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={symbol}
                        onChange={this.handleChange}
                    >
                    {companyList.map(item => {
                        return(
                            <MenuItem value={item.symbol}>{item.name}</MenuItem>
                        );
                    })}
                </Select>
                </FormControl>
                <div className="chartWrapper">
                    <HighchartsReact
                    highcharts={Highcharts}
                    constructorType={"stockChart"}
                    options={this.state.options}
                    />
                </div>
          </div>
        );
    }
}

Homepage.propTypes = {
    getData: PropTypes.func.isRequired,
};

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
  )(Homepage);