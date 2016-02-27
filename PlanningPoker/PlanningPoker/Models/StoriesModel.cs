using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class Story
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsEstimated { get; set; }
        public bool IsClosed { get; set; }
        public int Points { get; set; }

        [ForeignKey("Room")]
        public int RoomId { get; set; }
        public virtual Room Room { get; set; }
        public virtual ICollection<Choice> Choices { get; set; }
    }
 
}