import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';


interface Props {
    Name: string;
    Close: Function;
  }

type metricDataCardProps =
    IState 
    & Props;

class Card extends React.Component<metricDataCardProps, {}>{


    public render() {

        let metric = this.props.metric.CurrentMetricMeasurement[this.props.Name];

        return (
                <div style={{ width: '150px', height: '120px', backgroundColor: 'teal', margin: '8px', borderRadius: '8px', display:'inline-block' }}>
                         <div style={{ display: 'inline-block', padding: '4px', marginRight: '10px' }} >{this.props.Name}</div>
                         <div style={{float: 'right'}}><button onClick={() => this.props.Close(this.props.Name)}> X </button></div>
                    
                    <div style={{padding: '20px'}}>
                    {metric !== undefined && metric.value}
                    </div>
                </div>
        );
    }
}

export default connect(
    (state: IState, ownProps: Props) => (
        {
            ...state,
            ...ownProps,
        }),
)(Card);