using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.Identity.EntityFramework;
using PlanningPoker.Models;

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

        public void AddRoomStory(Story story)
        {
            Clients.All.showNewStory(story.Id, story.IsEstimated, story.Name, story.Points);
        }

        public void DeleteRoomStory(int storyId)
        {
            Clients.All.hideDeletedStory(storyId);
        }

        public void AddStoryChoice(Choice choice)
        {
            Clients.All.showNewChoice(choice.Id, choice.UserId, choice.CardId, choice.StoryId);
        }

        public void AddDashRoom(Room room)
        {
            Clients.All.showNewRoom(room.Id, room.Name, room.Description);
        }

        public void ShowStoryCards()
        {
            Clients.All.showCards();
        }
    }
    
}