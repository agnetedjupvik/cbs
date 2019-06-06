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
        public Region(string name)
        {
            Name = name;
        }

        public string Name { get; set; }
    }
}
