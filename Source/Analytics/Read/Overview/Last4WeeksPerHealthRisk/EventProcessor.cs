/*---------------------------------------------------------------------------------------------
*  Copyright (c) The International Federation of Red Cross and Red Crescent Societies. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

using System;
using System.Collections.Generic;
using System.Linq;
using Concepts;
using Concepts.HealthRisks;
using Dolittle.Events.Processing;
using Dolittle.ReadModels;
using Events.Admin.HealthRisks;
using Events.Reporting.CaseReports;
using Read.HealthRisks;

namespace Read.Overview.Last4WeeksPerHealthRisk
{
    public class EventProcessor : ICanProcessEvents
    {
        readonly IReadModelRepositoryFor<HealthRisk> _healthRisks;
        readonly IReadModelRepositoryFor<CaseReportsLast4WeeksPerHealthRisk> _caseReportsLastWeeksPerHealthRisk;

        public EventProcessor(
            IReadModelRepositoryFor<HealthRisk> healthRisks,
            IReadModelRepositoryFor<CaseReportsLast4WeeksPerHealthRisk> caseReportsLastWeeksPerHealthRisk            
        )
        {
            _healthRisks = healthRisks;
            _caseReportsLastWeeksPerHealthRisk = caseReportsLastWeeksPerHealthRisk;
        }
        
        [EventProcessor("f2f78ff9-2d3a-a32d-cf9b-37f73451da6c")]
        public void Process(CaseReportReceived @event)
        {
            var healthRiskName = _healthRisks.GetById(@event.HealthRiskId)?.Name ?? "Unknown";
            var recieved = Day.From(@event.Timestamp);
            var numberOfCaseReports = @event.NumberOfFemalesUnder5+@event.NumberOfFemalesAged5AndOlder+@event.NumberOfMalesUnder5+@event.NumberOfMalesAged5AndOlder;

            for (var days = 0; days < 7; days++)
            {
                CreateOrUpdateCaseReports(recieved+days, @event.HealthRiskId, _ => {
                    _.HealthRiskName = healthRiskName;
                    _.Days0to6 += numberOfCaseReports;
                });
            }
            for (var days = 7; days < 14; days++)
            {
                CreateOrUpdateCaseReports(recieved+days, @event.HealthRiskId, _ => {
                    _.HealthRiskName = healthRiskName;
                    _.Days7to13 += numberOfCaseReports;
                });
            }
            for (var days = 14; days < 21; days++)
            {
                CreateOrUpdateCaseReports(recieved+days, @event.HealthRiskId, _ => {
                    _.HealthRiskName = healthRiskName;
                    _.Days14to20 += numberOfCaseReports;
                });
            }
            for (var days = 21; days < 28; days++)
            {
                CreateOrUpdateCaseReports(recieved+days, @event.HealthRiskId, _ => {
                    _.HealthRiskName = healthRiskName;
                    _.Days21to27 += numberOfCaseReports;
                });
            }
        }

        void CreateOrUpdateCaseReports(Day day, HealthRiskId id, Action<CaseReportsLast4WeeksForHealthRisk> update)
        {
            var aggregatedReports = _caseReportsLastWeeksPerHealthRisk.GetById(day);
            if (aggregatedReports == null)
            {
                aggregatedReports = new CaseReportsLast4WeeksPerHealthRisk
                {
                    Id = day,
                    CaseReportsPerHealthRisk = new Dictionary<HealthRiskId, CaseReportsLast4WeeksForHealthRisk>()
                };
                _caseReportsLastWeeksPerHealthRisk.Insert(aggregatedReports);
            }

            if (!aggregatedReports.CaseReportsPerHealthRisk.ContainsKey(id))
            {
                aggregatedReports.CaseReportsPerHealthRisk[id] = new CaseReportsLast4WeeksForHealthRisk
                {
                    Days0to6 = 0,
                    Days7to13 = 0,
                    Days14to20 = 0,
                    Days21to27 = 0
                };
            }

            var aggregatedReportsForHealthRisk = aggregatedReports.CaseReportsPerHealthRisk[id];
            
            update(aggregatedReportsForHealthRisk);

            _caseReportsLastWeeksPerHealthRisk.Update(aggregatedReports);
        }

        [EventProcessor("2fa9f18d-8e35-72ad-d7e2-1bab517172fa")]
        public void Process(HealthRiskModified @event)
        {
            var alreadyAggregatedReports = _caseReportsLastWeeksPerHealthRisk.Query.Where(_ => _.Id >= Day.Today).ToList();
            foreach (var aggregatedReports in alreadyAggregatedReports)
            {
                if (aggregatedReports.CaseReportsPerHealthRisk.ContainsKey(@event.Id))
                {
                    aggregatedReports.CaseReportsPerHealthRisk[@event.Id].HealthRiskName = @event.Name;
                    _caseReportsLastWeeksPerHealthRisk.Update(aggregatedReports);
                }
            }
        }
    }
}
