using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class UserComparer:IEqualityComparer<IdentityUser>
    {
        public bool Equals(IdentityUser x, IdentityUser y)
        {
            return (x.Id == y.Id);               
        }

        public int GetHashCode(IdentityUser obj)
        {
            return obj.Id.GetHashCode();
        }
    }
}