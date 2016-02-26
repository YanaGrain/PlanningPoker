using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.Identity.EntityFramework;

namespace PlanningPoker.Hubs
{
    public class PokerHub : Hub
    {
        //static List<IdentityUser> Users = new List<IdentityUser>();
        public void SendMessage(string name, string message)
        {
            Clients.All.broadcastMessage(name, message);
        }

       public void AddRoomUser(IdentityUser user)
        {
            Clients.All.showNewUser(user.Id, user.UserName);
        }

        public void DeleteRoomUser(string userId)
        {
            Clients.All.hideDeletedUser(userId);
        }
    }
    
}