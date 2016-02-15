using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class Choice
    {
        public int Id { get; set; }
        public virtual UserModel User { get; set; }
        public virtual Card Card { get; set; }
        public virtual Room Room { get; set; }
        public Choice()
        {
            User = new UserModel();
            Card = new Card();
            Room = new Room();
        }

    }
}