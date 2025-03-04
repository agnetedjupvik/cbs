/*---------------------------------------------------------------------------------------------
*  Copyright (c) The International Federation of Red Cross and Red Crescent Societies. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

using Dolittle.Events.Processing;
using Events.Reporting.CaseReports;
using Dolittle.ReadModels;
using Concepts;
using Read.DataCollectors;
using Read.HealthRisks;
using System.Linq;

namespace Read.CaseReports
{
    public class CaseReportEventProcessor : ICanProcessEvents
    {
        readonly IReadModelRepositoryFor<CaseReport> _caseReportRepository;
        readonly IReadModelRepositoryFor<CaseReportsPerRegionLast7Days> _caseReportsPerRegionLast7DaysRepository;
        readonly IReadModelRepositoryFor<HealthRisk> _healthRisks;
        readonly IReadModelRepositoryFor<District> _districts;
        readonly IReadModelRepositoryFor<Region> _regions;
        readonly IReadModelRepositoryFor<DataCollector> _dataCollectors;

        public CaseReportEventProcessor(
            IReadModelRepositoryFor<CaseReport> caseReportRepository, 
            IReadModelRepositoryFor<CaseReportsPerRegionLast7Days> repository,
            IReadModelRepositoryFor<DataCollector> dataCollectors,
            IReadModelRepositoryFor<HealthRisk> healthRisks,
            IReadModelRepositoryFor<District> districts,
            IReadModelRepositoryFor<Region> regions
            )
        {
            _caseReportRepository = caseReportRepository;
            _caseReportsPerRegionLast7DaysRepository = repository;
            _healthRisks = healthRisks;
            _districts = districts;
            _regions = regions;
            _dataCollectors = dataCollectors;
        }

        public RegionWithHealthRisk AddRegionWithCases(RegionName region, NumberOfPeople numCases)
        {
            return new RegionWithHealthRisk()
            {
                Name = region,
                NumCases = numCases
            };
        }

        
        
       [EventProcessor("db27c06b-d33c-4788-8e9d-2a1bbba13be3")]
        public void Process(CaseReportReceived @event)
        {
            // Insert CaseReports
            var caseReport = new CaseReport(@event.DataCollectorId, 
            @event.HealthRiskId, @event.Origin, @event.Message, @event.NumberOfMalesUnder5, @event.NumberOfMalesAged5AndOlder, 
            @event.NumberOfFemalesUnder5, @event.NumberOfFemalesAged5AndOlder, @event.Longitude, @event.Latitude,
            @event.Timestamp);
            
            _caseReportRepository.Insert(caseReport);

            var healthRisk = _healthRisks.GetById(caseReport.HealthRiskId);
            var dataCollector = _dataCollectors.GetById(@event.DataCollectorId);
            var district = _districts.Query.FirstOrDefault(_ => _.Name == dataCollector.District);

            InsertPerHealthRiskAndRegionForComingWeek(caseReport, healthRisk, district);
            UpdateDataCollectorLastActive(dataCollector, caseReport);
        }

        public void UpdateDataCollectorLastActive(DataCollector dataCollector, CaseReport caseReport)
        {
            dataCollector.LastActive = caseReport.Timestamp;
            _dataCollectors.Update(dataCollector);
        }

        public void InsertPerHealthRiskAndRegionForComingWeek(CaseReport caseReport, HealthRisk healthRisk, District district)
        {
            // Insert by health risk and region
            var today = Day.From(caseReport.Timestamp);
            var region = _regions.GetById(district.RegionId);
            var totalCases = caseReport.NumberOfMalesUnder5
                                +caseReport.NumberOfMalesAged5AndOlder
                                +caseReport.NumberOfFemalesUnder5
                                +caseReport.NumberOfFemalesAged5AndOlder;

            for (var day = today; day < today + 7; day++)
            {
                var dayReport = _caseReportsPerRegionLast7DaysRepository.GetById(day);
                if (dayReport != null)
                {
                    var healthRiskForDay = dayReport.HealthRisks.FirstOrDefault(d => d.Id == caseReport.HealthRiskId);
                    if (healthRiskForDay != null)
                    {   
                        var regionForHealthRisk = healthRiskForDay.Regions.FirstOrDefault(r => r.Name == region.Name);
                        if (regionForHealthRisk != null)
                        {
                            regionForHealthRisk.NumCases += totalCases;
                        } else
                        {
                            healthRiskForDay.Regions.Add(AddRegionWithCases(region.Name, totalCases));
                        }
                    }
                    else 
                    {
                        dayReport.HealthRisks.Add(new HealthRisksInRegionsLast7Days()
                        {
                            Id = caseReport.HealthRiskId,
                            HealthRiskName = healthRisk.Name,
                            Regions = new [] { AddRegionWithCases(region.Name, totalCases) }
                        });
                    }
                    _caseReportsPerRegionLast7DaysRepository.Update(dayReport);
                }
                else 
                {
                    dayReport = new CaseReportsPerRegionLast7Days()
                    {
                        Id = day,
                        HealthRisks = new [] 
                        {
                            new HealthRisksInRegionsLast7Days()
                            {
                                Id = caseReport.HealthRiskId,
                                HealthRiskName = healthRisk.Name,
                                Regions = new []{ AddRegionWithCases(region.Name, totalCases) }
                            }
                        }
                    };
                    _caseReportsPerRegionLast7DaysRepository.Insert(dayReport);
                }
            };
        }
    }
}
