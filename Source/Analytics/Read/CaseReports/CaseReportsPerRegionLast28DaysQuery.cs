using System.Linq;
using Dolittle.Queries;
using Dolittle.ReadModels;
using Concepts;

namespace Read.CaseReports
{
    public class CaseReportsPerRegionLast28DaysQuery : IQueryFor<CaseReportsPerRegionLast28Days>
    {
        readonly IReadModelRepositoryFor<CaseReportsPerRegionLast28Days> _repositoryForCaseReportsPerRegionLast28Days;

        public CaseReportsPerRegionLast28DaysQuery(IReadModelRepositoryFor<CaseReportsPerRegionLast28Days> repositoryForCaseReportsPerRegionLast28Days)
        {
            _repositoryForCaseReportsPerRegionLast28Days = repositoryForCaseReportsPerRegionLast28Days;
        }

        public IQueryable<CaseReportsPerRegionLast28Days> Query => 
            _repositoryForCaseReportsPerRegionLast28Days
                .Query
                .Where(report => report.Id == Day.Today);
    }
}
