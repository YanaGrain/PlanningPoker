using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace PlanningPoker.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsClosed { get; set; }

        [JsonIgnore]
        public virtual ICollection<UserRoomLink> Links { get; set; }
        public virtual ICollection<Story> Stories { get; set; }

    }
}