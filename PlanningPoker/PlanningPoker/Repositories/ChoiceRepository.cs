using System.Collections.Generic;
using System.Linq;
using PlanningPoker.Models;

namespace PlanningPoker.Repositories
{
    public class ChoiceRepository : Repository<Choice, int>
    {
        public ChoiceRepository(PokerContext _ctx): base (_ctx){ }
        public List<Choice> GetChoices(int storyId)
        {
            return Find(choice => choice.StoryId == storyId).ToList();
        }
    }
}