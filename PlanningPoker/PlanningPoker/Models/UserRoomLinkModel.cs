using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class UserRoomLink
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        //public virtual UserModel User { get; set; }
        public virtual UserModel User { get; set; }


        [ForeignKey("Room")]
        public int RoomId { get; set; }
        public virtual Room Room { get; set; }

        public bool IsAdmin { get; set; }
    }
}