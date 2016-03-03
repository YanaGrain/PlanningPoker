using System.Collections.Generic;
using System.Linq;
using PlanningPoker.Models;

namespace PlanningPoker.Repositories
{
    public class StoryRepository:Repository<Story, int>
    {
        public StoryRepository(PokerContext _ctx ) : base(_ctx) { }

        public List<Story> GetStories(int roomId)
        {
            return Find(story => story.RoomId == roomId).ToList();
        }
        public Story GetCurrentStory(int roomId)
        {
            return Find(st => st.RoomId == roomId && st.IsClosed == false).FirstOrDefault();
        }
    }
}