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
        
        public void SendMessage(string name, string message, int storyId)
        {
            Clients.All.broadcastMessage(name, message, storyId);
        }

        public void AddRoomUser(IdentityUser user, int roomId)
        {
            Clients.All.showNewUser(user.Id, user.UserName, roomId);
        }

        public void DeleteRoomUser(string userId, int roomId, string userName)
        {
            Clients.All.hideDeletedUser(userId, roomId, userName);
        }

        public void AddRoomStory(Story story, int roomId)
        {
            Clients.All.showNewStory(story.Id, story.IsEstimated, story.Name, story.Points, roomId);
        }

        public void DeleteRoomStory(int storyId, int roomId)
        {
            Clients.All.hideDeletedStory(storyId, roomId);
        }

        public void AddStoryChoice(Choice choice)
        {
            Clients.All.showNewChoice(choice.Id, choice.UserId, choice.CardId, choice.StoryId);
        }

        public void AddDashRoom(string userId)
        {
            Clients.All.showNewRoom(userId);
        }

        public void DelDashRoom(string userId)
        {
            Clients.All.hideDelRoom(userId);
        }

        public void ShowStoryCards(int storyId)
        {
            Clients.All.showCards(storyId);
        }

        public void CloseStory(int storyId)
        {
            Clients.All.closeTheStory(storyId);
        }
    }
    
}