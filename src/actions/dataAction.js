import axios from 'axios'
import { FETCH_DATA } from './actionType'

export const fetchData = (params,company) => dispatch =>
    axios.get("https://www.alphavantage.co/query",{params}).then(resp =>
        dispatch({
            type : FETCH_DATA,
            data : resp.data,
            company
    }));