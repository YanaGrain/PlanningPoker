using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PlanningPoker.Models;

namespace PlanningPoker.Repositories
{
    public class AccountRepository : Repository<IdentityUser, string>
    {
        //private PokerContext db = new PokerContext();
        //private PokerContext _ctx;

        private UserManager<IdentityUser> _userManager;

        public AccountRepository(PokerContext _ctx): base (_ctx)
        {
            //this._ctx = _ctx;
            _userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(_ctx));
        }
      
        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            IdentityUser user = new IdentityUser
            {
                UserName = userModel.UserName
            };

            var result = await _userManager.CreateAsync(user, userModel.Password);

            return result;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = await _userManager.FindAsync(userName, password);

            return user;
        }

        public async Task<IdentityUser> FindUserByName(string userName)
        {
            IdentityUser user = await _userManager.FindByNameAsync(userName);

            return user;
        }

        public List<IdentityUser> GetAllUsers(int roomId)
        {
            var links = ctx.Links
                .Where(link => link.RoomId == roomId)
                .Include(link => link.User);
            List<IdentityUser> roomUsers = links.Select(link => link.User).ToList();

            List<IdentityUser> allUsers = _userManager.Users.ToList();

            List<IdentityUser> users = (allUsers.Except(roomUsers, new UserComparer())).ToList();


            return (users);
        }

        public IdentityUser GetAdmin(int roomId)
        {
            var links = ctx.Links
                .Where(link => link.RoomId == roomId && link.IsAdmin == true)
                .Include(link => link.User);
            var admin = links.Select(link => link.User).SingleOrDefault();

            //var admin = links.Select(link=>link.IsAdmin == true).SingleOrDefault();

            return (admin);
        }

        public IdentityUser GetUserByLink(int linkId)
        {
            var links = ctx.Links
                .Where(link => link.Id == linkId)
                .Include(link => link.User);
            var user = links.Select(link => link.User).SingleOrDefault();
            return (user);
        }

        public List<IdentityUser> GetRoomUsers(int roomId)
        {
            var links = ctx.Links
                .Where(link => link.RoomId == roomId /*&& link.IsAdmin == false*/)
                .Include(link => link.User);
            var users = links.Select(link => link.User);

            return (users.ToList());
        }

    }
}