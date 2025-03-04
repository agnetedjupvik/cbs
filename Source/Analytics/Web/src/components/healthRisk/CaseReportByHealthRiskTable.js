import React, { Component } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import '../lastWeekTotals/last-week-totals.scss';

import { QueryCoordinator } from "@dolittle/queries";
import { CaseReportsLast4WeeksPerHealthRiskQuery } from "../../Features/Overview/Last4WeeksPerHealthRisk/CaseReportsLast4WeeksPerHealthRiskQuery";

class CaseReportByHealthRiskTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            healthRisks: [],
            isLoading: true,
            isError: false
        };
    }

    fetchData() { 
      this.queryCoordinator = new QueryCoordinator();
      let lastWeeksPerHealthRisk = new CaseReportsLast4WeeksPerHealthRiskQuery();

      this.queryCoordinator.execute(lastWeeksPerHealthRisk).then(queryResult => {
          if(queryResult.success){
              this.setState({
                  healthRisks: queryResult.items[0].caseReportsPerHealthRisk,
                  isLoading: false,
                  isError: false
              });
          }
          else{
              this.setState({ isLoading: false, isError: true })
          }
      });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
          <div className="tableContainer">
            <h2 className="headline">Reports for the last 4 weeks</h2>
              <Table className="table">
                <TableHead className="tableHead">
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className="headerText">0-6 days</TableCell>
                    <TableCell className="headerText">7-13 days</TableCell>
                    <TableCell className="headerText">14-21 days</TableCell>
                    <TableCell className="headerText">22-27 days</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(this.state.healthRisks).map(key => (
                    <TableRow key={this.state.healthRisks[key].healthRiskName}>
                      <TableCell className="cell">
                        {this.state.healthRisks[key].healthRiskName}
                      </TableCell>
                      <TableCell className="cell" style={this.state.healthRisks[key].days0to6 === 0 ? {color: "#B5B5B5"} : {}}>
                        {this.state.healthRisks[key].days0to6}
                      </TableCell>
                      <TableCell className="cell" style={this.state.healthRisks[key].days7to13 === 0 ? {color: "#B5B5B5"} : {}}>
                        {this.state.healthRisks[key].days7to13}
                      </TableCell>
                      <TableCell className="cell" style={this.state.healthRisks[key].days14to20 === 0 ? {color: "#B5B5B5"} : {}}>
                        {this.state.healthRisks[key].days14to20}
                      </TableCell>
                      <TableCell className="cell" style={this.state.healthRisks[key].days21to27 === 0 ? {color: "#B5B5B5"} : {}}>
                        {this.state.healthRisks[key].days21to27}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
        );
    }
}

export default CaseReportByHealthRiskTable;