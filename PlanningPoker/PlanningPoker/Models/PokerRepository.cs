using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;

namespace PlanningPoker.Models
{
    public class PokerRepository : IDisposable
    {
        private PokerContext db = new PokerContext();
        private PokerContext _ctx;

        private UserManager<IdentityUser> _userManager;

        public PokerRepository()
        {
            _ctx = new PokerContext();
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
            var links = db.Links
                .Where(link => link.RoomId == roomId)
                .Include(link => link.User);
            List<IdentityUser> roomUsers = links.Select(link => link.User).ToList();

            List<IdentityUser> allUsers = _userManager.Users.ToList();

            List<IdentityUser> users = (allUsers.Except(roomUsers, new UserComparer())).ToList();
            

            return (users);
        }

        public IdentityUser GetAdmin(int roomId)
        {
            var links = db.Links
                .Where(link => link.RoomId == roomId && link.IsAdmin==true)
                .Include(link => link.User);
            var admin = links.Select(link => link.User).SingleOrDefault();

            //var admin = links.Select(link=>link.IsAdmin == true).SingleOrDefault();
            
            return (admin);
        }

        public List<IdentityUser> GetRoomUsers(int roomId)
        {
            var links = db.Links
                .Where(link => link.RoomId == roomId && link.IsAdmin == false)
                .Include(link => link.User);
            var users = links.Select(link => link.User);
            
            //var admin = links.Where(link=>link.IsAdmin == true);

            //var allUsers = users.Except(admin);               
            
            return (users.ToList());
        }

        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }
    }
}