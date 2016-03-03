using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PlanningPoker.Models;
using PlanningPoker.Repositories;

namespace PlanningPoker.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        UnitOfWork unitOfWork = new UnitOfWork();
        //private PokerContext db = new PokerContext();
        //private AccountRepository _repo = null;

        public AccountController()
        {
            unitOfWork = new UnitOfWork();
            //_repo = new AccountRepository;
        }

        // GET: api/Account/Users
        [Route("Users/{roomId}")]
        public JsonResult<List<IdentityUser>> GetUsers(int roomId)
        {            
            List<IdentityUser> users = unitOfWork.Accounts.GetAllUsers(roomId);
            return Json(users);
        }

        // GET: api/Account/{roomId}/Users
        [Route("{roomId}/Users")]
        public List<IdentityUser> GetRoomUsers(int roomId)
        {
            List<IdentityUser> users = unitOfWork.Accounts.GetRoomUsers(roomId);
            return (users);
        }

        // GET: api/Account/{roomId}/Admin
        [Route("{roomId}/Admin")]
        public IdentityUser GetAdmin(int roomId)
        {
            IdentityUser admin = unitOfWork.Accounts.GetAdmin(roomId);
            return (admin);
        }

        // GET: api/Account/{linkId}
        [Route("addUser/{linkId}")]
        public IdentityUser GetUserByLink(int linkId)
        {
            IdentityUser user = unitOfWork.Accounts.GetUserByLink(linkId);
            return (user);
        }

        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await unitOfWork.Accounts.RegisterUser(userModel);

            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok();
        }

        [HttpGet]
        [Route("{UserName}")]
        public async Task<IdentityUser> GetUser(string userName)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            IdentityUser user = await unitOfWork.Accounts.FindUserByName(userName);

            /*IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }*/           
            return (user);
        }

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        unitOfWork.Accounts.Dispose();
        //    }

        //    base.Dispose(disposing);
        //}

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        //public async Task<string> GetUserId(string userName)
        //{
        //    IdentityUser user = await _repo.FindUserByName(userName);
        //    return user.Id;
        //}
    }
}
