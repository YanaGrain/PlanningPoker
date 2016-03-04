using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;

namespace PlanningPoker.Models
{
    public class PokerContext : IdentityDbContext<UserModel>
    {
        public PokerContext()
            : base("PokerContext")
        {
            //don't forget about include if needed!
            this.Configuration.LazyLoadingEnabled = false;
            this.Configuration.ProxyCreationEnabled = false;
        }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<UserRoomLink> Links { get; set; }
        public DbSet<Story> Stories { get; set; }
        public DbSet<Choice> Choices { get; set; }
    }
}