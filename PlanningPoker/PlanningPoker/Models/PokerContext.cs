using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;

namespace PlanningPoker.Models
{
    public class PokerContext : IdentityDbContext<IdentityUser>
    {
        public PokerContext()
            : base("PokerContext")
        {
            
        }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Choice> Choices { get; set; }

        public System.Data.Entity.DbSet<PlanningPoker.Models.UserModel> IdentityUsers { get; set; }
    }
}