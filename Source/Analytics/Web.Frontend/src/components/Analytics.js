import React, { Component } from "react";
import Diagram from "./Diagram.js";
import Typography from '@material-ui/core/Typography';

import CaseReportByHealthRiskTable from "./healthRisk/CaseReportByHealthRiskTable";
import HealthRiskPerDistrictTable from "./healthRisk/HealthRiskPerDistrictTable.js";
import ProjectPresence from "./ProjectPresence.js";
import CBSNavigation from './Navigation/CBSNavigation';


export const BASE_URL = process.env.API_BASE_URL;

class Analytics extends Component {
    constructor(props) {
        super(props);
    }

    headline(text, variant) {
        return(
        <Typography variant={variant} gutterBottom style={{marginTop: 40}}>
            {text}
        </Typography>
        );
    };
    render() {
        
        return (
            <div className="analytics--container">
                <CBSNavigation />
                {this.headline("Country Overview", "h2")}

                {this.headline("Project Presence", "h4")}
                <ProjectPresence />

                {this.headline("Situation Report", "h4")}
                <CaseReportByHealthRiskTable />
                <HealthRiskPerDistrictTable />

                <Diagram
                    selectedSeries={["Total"]}
                    hasDatePicker
                    defaultRange={"Day"}
                    title={range => `Epicurve by ${range}`}
                />
            </div>
        );
    }
}

export default Analytics;
