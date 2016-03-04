using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class UserComparer:IEqualityComparer<UserModel>
    {
        public bool Equals(UserModel x, UserModel y)
        {
            return (x.Id == y.Id);               
        }

        public int GetHashCode(UserModel obj)
        {
            return obj.Id.GetHashCode();
        }
    }
}