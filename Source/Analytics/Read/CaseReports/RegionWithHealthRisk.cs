/*---------------------------------------------------------------------------------------------
*  Copyright (c) The International Federation of Red Cross and Red Crescent Societies. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

using Dolittle.ReadModels;
using Concepts;

namespace Read.CaseReports
{
    public class RegionWithHealthRisk : IReadModel
    {
        public RegionName Name;

        public NumberOfPeople NumCases;
    }
}
