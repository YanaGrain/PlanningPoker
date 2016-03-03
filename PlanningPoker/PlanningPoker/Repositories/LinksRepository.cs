using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using PlanningPoker.Models;

namespace PlanningPoker.Repositories
{
    public class LinkRepository:Repository<UserRoomLink, int>
    {
        public LinkRepository(PokerContext _ctx): base (_ctx){ }

        public UserRoomLink GetLink(string userId, int roomId)
        {
            return Find(l => l.RoomId == roomId && l.UserId == userId).FirstOrDefault();
        }

        public List<UserRoomLink> GetLinks(string userId)
        {
            var links = Find(link => link.UserId == userId);
            return links.Include(link=>link.Room).ToList();
        } 
        
    }
}