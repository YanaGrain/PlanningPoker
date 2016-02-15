using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsClosed { get; set; }

        public virtual ICollection<Choice> Choices { get; set; }
    }
}