using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Read
{
    public class Region : BaseReadModel
    {
        public Region(string name, int num)
        {
            Name = name;
            NumberOfCaseReports = 0;
        }
        public string Name { get; set; }

        public int NumberOfCaseReports { get; set; }
        public List<District> Districts { get; set; }

    }
}