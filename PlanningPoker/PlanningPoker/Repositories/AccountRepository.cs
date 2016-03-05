using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PlanningPoker.Models;

namespace PlanningPoker.Repositories
{
    public class AccountRepository : Repository<UserModel, string>
    {
        //private PokerContext db = new PokerContext();
        //private PokerContext _ctx;

        private UserModelManager _userManager;

        public AccountRepository(PokerContext _ctx): base (_ctx)
        {
            //this._ctx = _ctx;
            _userManager = new UserModelManager(new UserStore<UserModel>(_ctx));
        }
      
        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            UserModel user = new UserModel
            {
                UserName = userModel.UserName,
                //FirstName = userModel.UserName,
                //LastName =  userModel.LastName,
                FullName = userModel.FullName
            };

            var result = await _userManager.CreateAsync(userModel, userModel.Password);

            return result;
        }

        public async Task<UserModel> FindUser(string userName, string password)
        {
            UserModel user = await _userManager.FindAsync(userName, password);

            return user;
        }

        public async Task<UserModel> FindUserByName(string userName)
        {
            UserModel user = await _userManager.FindByNameAsync(userName);

            return user;
        }

        public List<UserModel> GetAllUsers(int roomId)
        {
            var links = ctx.Links
                .Where(link => link.RoomId == roomId)
                .Include(link => link.User);
            List<UserModel> roomUsers = links.Select(link => link.User).ToList();

            List<UserModel> allUsers = _userManager.Users.ToList();

            List<UserModel> users = (allUsers.Except(roomUsers, new UserComparer())).ToList();


            return (users);
        }

        public UserModel GetAdmin(int roomId)
        {
            var links = ctx.Links
                .Where(link => link.RoomId == roomId && link.IsAdmin == true)
                .Include(link => link.User);
            var admin = links.Select(link => link.User).SingleOrDefault();

            //var admin = links.Select(link=>link.IsAdmin == true).SingleOrDefault();

            return (admin);
        }

        public UserModel GetUserByLink(int linkId)
        {
            var links = ctx.Links
                .Where(link => link.Id == linkId)
                .Include(link => link.User);
            var user = links.Select(link => link.User).SingleOrDefault();
            return (user);
        }

        public List<UserModel> GetRoomUsers(int roomId)
        {
            var links = ctx.Links
                .Where(link => link.RoomId == roomId /*&& link.IsAdmin == false*/)
                .Include(link => link.User);
            var users = links.Select(link => link.User);

            return (users.ToList());
        }

    }
}