import React, { Component } from "react";
import { connect } from "react-redux";
import { formatDate, toOrDefault, fromOrDefault } from "../utils/dateUtils";
import { SegmentedControl, Alert, Button } from "evergreen-ui";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getJson } from "../utils/request";
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';


import { BASE_URL } from "./Analytics";

const defaultOptions = {
    chart: {
        type: "column"
    },
    subtitle: {
        text: "Source: CSB"
    },
    xAxis: {
        categories: [],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: "Number of cases in total"
        }
    },
    plotOptions: {
        column: {
            pointPadding: 0.1,
            borderWidth: 0
        }
    },

    options: {
        barPercentage: 1.0,
        categoryPercentage: 1.0
    }
};

class Diagram extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [
                { label: "Daily", value: "Day" },
                { label: "Weekly", value: "Week" }
            ],
            value: this.props.defaultRange,
            isLoading: true,
            isError: false,
            series: []
        };
    }

    fetchData() {
        const from = fromOrDefault(this.props.range.from);
        const to = toOrDefault(this.props.range.to);

        const series = this.props.selectedSeries
            .map(series => `selectedSeries=${series}`)
            .join("&");

        this.url = `${BASE_URL}Epicurve/${formatDate(from)}/${formatDate(to)}/${
            this.state.value
        }?${series}`;

        getJson(this.url)
            .then(json =>
                this.setState({
                    series: json.series,
                    xAxis: { categories: json.categories },
                    isLoading: true,
                    isError: false
                })
            )
            .catch(_ => this.setState({ isLoading: false, isError: true }));
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.state.value !== prevState.value ||
            prevProps.range.from !== this.props.range.from ||
            prevProps.range.to !== this.props.range.to
        ) {
            this.fetchData();
        }
    }

    handleChange = () => {
        if (value === 'Week'){
            this.setState({value: 'Day'})
        } else {
            this.setState({value: 'Week'})
        }
    }

    render() {
        var options = {
            ...defaultOptions,
            title: { 
                text: this.props.title(this.state.value),
            },
            series: this.state.series,
            xAxis: this.state.xAxis,
            chart: {
                style: {
                    fontFamily: 'Roboto'
                }
            },
            tooltip: { fontFamily: 'Roboto'},
            legend: {
                align: 'right',
                verticalAlign: 'top',
           }
        };

        

        if (this.state.isError) {
            return (
                <div
                    className="analytics--loadingContainer"
                    style={{ height: "450px" }}
                >
                    <Paper>
                        <div style={{display: "flex", padding: 5}}>
                            <div style={{padding: 10}}><i class="fa fa-exclamation-triangle"></i></div>
                            <div>
                                <Typography variant="h6" style={{color: "#9f0000"}}>We could not the reach the backend.</Typography>
                                <Typography>{`Url: ${this.url}`}</Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => this.fetchData()}
                                    style={{marginTop: 10, marginBottom: 10}}
                                >
                                    Retry
                                </Button>
                            </div>     
                        </div>      
                    </Paper>
                </div>
            );
        }

        return (
            <>
                <Paper>
                    <div style={{padding: 10}}>
                    
                    <HighchartsReact highcharts={Highcharts} options={options} />
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Typography>Day</Typography>
                        <Switch 
                            value={this.state.value}
                            onChange={value => this.setState(this.state.value === 'Day' ? { value: 'Week' } : { value : 'Day' })}
                            options={this.state.options}
                        />
                        <Typography>Week</Typography>
                    </div>
                    </div>
                </Paper>
            </>
        );
    }
}

Diagram.defaultProps = {
    selectedSeries: ["Total"],
    hasDatePicker: true,
    defaultRange: "Day",
    title: "range => `Epicurve by ${range}`"
};

function mapStateToProps(state) {
    return {
        range: state.analytics.range
    };
}

export default connect(mapStateToProps)(Diagram);
