using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class Card
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public string Path { get; set; }

        public virtual ICollection<Choice> Choices { get; set; }
    }
}
