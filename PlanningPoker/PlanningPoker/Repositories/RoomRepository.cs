using PlanningPoker.Models;

namespace PlanningPoker.Repositories
{
    public class RoomRepository:Repository<Room, int>
    {
        public RoomRepository(PokerContext _ctx): base (_ctx){}
        
    }
}