import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { metricDataObj } from './reducer';
import Plot from 'react-plotly.js';

type chartProps =
    IState & Props

interface Props {
    datafromurql: any;
}

type charts = {
    [key: string]: chartData;
}

interface chartData {
    x: string[];
    y: string[];
    type: string,
    mode: string,
    marker: any;
}

class Chart extends React.Component<chartProps, {}>{

    private populateCharts(): charts {

        let datafromurql = this.props.datafromurql;
        let charts: charts = {};

        if (datafromurql.data !== undefined) {

            Object.keys(this.props.metric.HistMetricMeasurement).map((key, index) => {

                let histdataforthekey: metricDataObj[] = [];
                if (this.props.datafromurql.data !== undefined && this.props.datafromurql.data.getMultipleMeasurements) {
                    for (const iterator of this.props.datafromurql.data.getMultipleMeasurements) {
                        if (iterator["metric"] === key) {
                            histdataforthekey = iterator["measurements"];
                        }
                    }
                }
                charts[key] = this.prepareChartData(histdataforthekey.concat(this.props.metric.HistMetricMeasurement[key]));
            });
        }

        return charts;
    }

    public prepareChartData(measurements: any[]): chartData {
        let preparedchartData: chartData = {
            x: measurements.map(function (data) { return new Date(data['at']).toLocaleTimeString(); }),
            y: measurements.map(function (data) { return data['value']; }),
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'orange' },
        }

        return preparedchartData;
    }

    private getCurrentTime(): string {
        return new Date().toLocaleTimeString();
    }

    private getthirtyminsback(lastmins: number): string {
        let datetime = new Date();
        datetime.setMinutes(datetime.getMinutes() - lastmins);
        return datetime.toLocaleTimeString();
    }

    private chartLayout(name: string): any {

        let from = this.getthirtyminsback(30);
        let to = this.getCurrentTime();

        let layout = {
            width: 1200, height: 800, title: `Chart for metric ${name}`,
            xaxis: {
                range: [from, to],
                type: 'Date'
            }
        }
        return layout;
    }

    public render() {

        if (this.props.datafromurql.data === undefined) {
            return null;
        }

        let ChartsForMetrics = this.populateCharts();
        let chartsData = [{}];

        this.props.metric.SelectedMetrics.map(key => {

            chartsData.push({x: ChartsForMetrics[key].x, y: ChartsForMetrics[key].y, type: 'scatter', mode: 'lines', text: key})

        });


        return (
            <React.Fragment>
                {ChartsForMetrics !== undefined &&
                    this.props.metric.SelectedMetrics.length > 0  && 
                    <div style={{ margin: '10px', display: 'inline-block' }}>
                            <Plot
                            data={chartsData}
                            layout={this.chartLayout('')}
                        />
                        </div>
                    }              
            </React.Fragment>);
    }
}

export default connect(
    (state: IState, ownProps: Props) => (
        {
            ...state,
            ...ownProps,
        }),
)(Chart);