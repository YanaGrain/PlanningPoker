using PlanningPoker.Models;

namespace PlanningPoker.Repositories
{
    public class CardRepository:Repository<Card, int>
    {
        public CardRepository(PokerContext _ctx): base (_ctx){ }
    }
}