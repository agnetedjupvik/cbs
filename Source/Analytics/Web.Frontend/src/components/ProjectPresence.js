import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { PresenceIndicator } from "./PresenceIndicator";
import Map from "./Map.js";
import { updateRange } from "../actions/analysisactions";
import { formatDate, fromOrDefault, toOrDefault } from "../utils/dateUtils";
import { BASE_URL } from "./Analytics";
import { getJson } from "../utils/request";

class ProjectPresence extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDatePicker: false,
            from: null,
            to: null,
            caseReports: { reportedHealthRisks: [] },
            alerts: { totalNumberOfAlerts: 0, alertsPerHealthRisk: [] },
            dataCollectors: {
                activeDataCollectors: 0,
                totalNumberOfDataCollectors: 0,
                inactiveDataCollectors: 0
            },
            isLoading: true,
            isError: false
        };
    }

    fetchData() {
        const from = fromOrDefault(this.props.range.from);
        const to = toOrDefault(this.props.range.to);

        this.url = `${BASE_URL}KPI/${formatDate(from)}/${formatDate(to)}/`;

        this.setState({ isLoading: true });

        getJson(this.url)
            .then(json =>
                this.setState({
                    alerts: json.alerts,
                    dataCollectors: json.dataCollectors,
                    caseReports: json.caseReports,
                    isLoading: false,
                    isError: false
                })
            )
            .catch(_ =>
                this.setState({
                    isLoading: false,
                    isError: true
                })
            );
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.range.from !== this.props.range.from ||
            prevProps.range.to !== this.props.range.to
        ) {
            this.fetchData();
        }
    }

    render() {
        const header = (
            <Typography variant="h5" onClick={() => this.fetchData()}>Project Presence</Typography>
        )
        
        if (this.state.isLoading) {
            return (
                <>
                    {header}   
                    <div
                        className="analytics--loadingContainer"
                        style={{ height: "264px" }}
                    >
                        <CircularProgress />
                    </div>
                </>
            );
        }

        if (this.state.isError) {
            return (
                <>
                    {header}  
                    <div
                        className="analytics--loadingContainer"
                        style={{ height: "264px" }}
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
                </>
            );
        }

        let headerPanelContainerStyle = {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: 10,
            marginBottom: 10,
        };
        
        return (
            <>
                <Paper>
                    <div style={{marginLeft: 10, paddingTop: 10}}>
                        <div className="analytics--headerPanelContainer" style={headerPanelContainerStyle}>
                            <PresenceIndicator 
                                headline={`${this.state.caseReports.totalNumberOfReports} Reports`}
                                list={this.state.caseReports.reportedHealthRisks}
                                color="#9f0000"
                                icon="fa-heartbeat"
                            />
                            
                            <PresenceIndicator 
                                headline={`${this.state.dataCollectors.activeDataCollectors} Active Data Collectors`}
                                list={[{name:"Inactive Data Collectors", inactiveDataCollectors: this.state.dataCollectors.inactiveDataCollectors}]}
                                color="#009f00"
                                icon="fa-user"
                            />
                            
                            <Map />
                        </div>
                    </div>
                </Paper>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        range: state.analytics.range
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateRange }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectPresence);
