using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Read
{
    public class TestDataCaseReport : BaseReadModel
    {
        public string Date { get; set; }
        public string Date2 { get; set; }
        public string Time { get; set; }
        public string ISOWeek { get; set; }
        public string Status { get; set; }
        public string DataCollector { get; set; }
        public string Region { get; set; }
        public string District { get; set; }
        public string village { get; set; }
        public string HealthRisk { get; set; }
        public int MalesUnder5 { get; set; }
        public string MalesOver5 { get; set; }

        public int Under5 { get; set; }

        public int Over5 { get; set; }

        public int Total { get; set; }

        public int Male { get; set; }

        public int Female { get; set; }

        public string LatLong { get; set; }

    }
}
/*
{
      "Date": "2019 February 13",
      "Date 2": "13/02/2019",
      "Time": "19:50:39",
      "ISO week": 7,
      "Status": "Success",
      "Data Collector": "muse",
      "Region": "togda",
      "District": "hedmark",
      "village": "son",
      "Health Risk": "AWD",
      "Males < 5": 1,
      "Males ≥ 5": "",
      "Females < 5": "",
      "Females ≥ 5": "",
      "Under 5": 1,
      "Over 5": 0,
      "Total": 1,
      "Male": 1,
      "Female": 0,
      "Lat. / Long.": "46.412179/9.066287"
    },

    */