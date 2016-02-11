using System;
using System.Collections.Generic;
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

    }
}