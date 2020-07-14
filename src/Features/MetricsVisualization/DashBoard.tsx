import React, { useEffect } from 'react';
import { IState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { actions as metricactions } from './reducer'
import { Query } from 'urql';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Card from './Card';
import Chart from './Chart';
import { queryHistoryData } from './Queries';


interface props {
    datafromurql: any;
}

type MeasurementQuery = {
    metricName: string,
    after: number,
    before: number;
}

const DashBoard: React.FC<props> = (props) => {

    const datafromurql = props.datafromurql;
    const metricNames: string[] = ['select a metric'];
    const dispatch = useDispatch();
    const [selectedFilter] = React.useState('select a metric');
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        dispatch(metricactions.metricSelected({ selectedMetric: event.target.value as string }));
    };


    const removeSelectedFilter = (metricName: string) => {
        dispatch(metricactions.metricRemoved({ selectedMetric: metricName }));
    }


    const getSelectedMetrics = (state: IState) => {
        return { selectedMetrics: state.metric.SelectedMetrics };
    }

    const getInputs = (state: IState) => {
        let inputs: MeasurementQuery[] = [];
        let dateval = new Date().getTime();
        let after = dateval - 1800 * 1000;
        for (const iterator of state.metric.SelectedMetrics) {
            inputs.push({ metricName: iterator, after: after, before: dateval });
        }
        return {
            inputs
        };
    }

    const { selectedMetrics } = useSelector(getSelectedMetrics);
    const { inputs } = useSelector(getInputs);

    if (!datafromurql.fetching && metricNames.length <= 1) {
        for (const iterator of datafromurql.data.getMetrics) {
            metricNames.push(iterator);
        }
    }

    useEffect(() => {

    }, [selectedMetrics]);


    let displayMetrics: string[] = [];
    for (const iterator of metricNames) {
        if(!selectedMetrics.includes(iterator)){
            displayMetrics.push(iterator);
        }
    }

    return (
        <React.Fragment>
            <div style={{padding: '10px', float:'right'}}>
            {displayMetrics !== undefined && displayMetrics.length > 0 &&
                <Select
                    labelId="metrics-label"
                    id="metrics"
                    value={selectedFilter}
                    onChange={handleChange}
                >
                    {displayMetrics.map(x => (
                        <MenuItem key={x} value={x} >{x}</MenuItem>
                    ))}
                </Select>}
                </div>
<div>
            {selectedMetrics.length > 0 && selectedMetrics.map(x => (
                <Card Name={x}  Close={removeSelectedFilter}/>
            ))}
            </div>

<div>
            {selectedMetrics.length > 0 &&
                <Query query={queryHistoryData} variables={{ inputs }} requestPolicy='network-only' >
                    {queryResults => (
                        <Chart datafromurql={queryResults} ></Chart>
                    )}
                </Query>
            }
            </div>

        </React.Fragment>
    );

}

export default DashBoard;