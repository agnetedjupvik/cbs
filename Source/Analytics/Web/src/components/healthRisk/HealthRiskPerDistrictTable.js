import React, { Component } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { QueryCoordinator } from "@dolittle/queries";
import { CaseReportsPerRegionLast7DaysQuery } from "../../Features/CaseReports/CaseReportsPerRegionLast7DaysQuery";


class HealthRiskPerDistrictTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            healthRisksPerRegion: [],
            isLoading: true,
            isError: false
        };
    }

    fetchData() { 
        this.queryCoordinator = new QueryCoordinator();
        let healthRisksPerRegion = new CaseReportsPerRegionLast7DaysQuery();

        this.queryCoordinator.execute(healthRisksPerRegion).then(queryResult => {
            if(queryResult.success){
                this.setState({
                    healthRisksPerRegion: queryResult.items[0].healthRisks,
                    isLoading: false,
                    isError: false
                })
            }
            else {
                this.setState({ isLoading: false, isError: true })
            }
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    createRows(healthRisks) {
        const numHealthRisks = healthRisks.length;
        let rows = [];

        let allRegions = [];
        healthRisks.map(risk => {
            risk.regions.map(region => {
                if (!allRegions.includes(region.id)){
                    allRegions.push(region.id);
                }
            })
        });
        
        allRegions.map(regionName => {
            let row = new Array(1+numHealthRisks).fill(0);
            row[0] = regionName;
            for (let i=0; i<numHealthRisks; i++){
                let num = healthRisks[i].regions.find(region => region.id === regionName);
                row[i+1] = num ? num.numCases : 0;
            }
            rows.push(row);
        });
        return rows
    }

    render() {
        return (
            <div style={{marginBottom: 20}}>
                <Typography variant="h5">No. of cases per health risk and district for last 7 days</Typography>
                <Paper>
                    <Table>
                        <TableHead key="table">
                            <TableRow>
                            <TableCell></TableCell>
                            {this.state.healthRisksPerRegion.map(healthRisk => (<TableCell key={healthRisk.healthRiskName} align="right">{healthRisk.healthRiskName}</TableCell>))}
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                            {
                                this.createRows(this.state.healthRisksPerRegion).map(row => {
                                let rowName = row.shift();
                                return (
                                    <TableRow key={rowName}>
                                        <TableCell key="rowName" align="left">{rowName}</TableCell> {/* Special treatment of region name column */}
                                        {row.map(numCases => (
                                            <TableCell align="right" style={numCases === 0 ? {color: "#B5B5B5"} : {}}>
                                                {numCases}
                                            </TableCell>
                                        ))}     
                                    </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

export default HealthRiskPerDistrictTable;