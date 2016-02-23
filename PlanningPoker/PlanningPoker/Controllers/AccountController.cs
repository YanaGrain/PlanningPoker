using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PlanningPoker.Models;
using System.Data.Entity;

namespace PlanningPoker.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private PokerContext db = new PokerContext();
        private PokerRepository _repo = null;

        public AccountController()
        {
            _repo = new PokerRepository();
        }

        // GET: api/Account/Users
        [Route("Users/{roomId}")]
        public JsonResult<List<IdentityUser>> GetUsers(int roomId)
        {            
            List<IdentityUser> users = _repo.GetAllUsers(roomId);
            return Json(users);
        }

        // GET: api/Account/{roomId}/Users
        [Route("{roomId}/Users")]
        public List<IdentityUser> GetRoomUsers(int roomId)
        {
            List<IdentityUser> users = _repo.GetRoomUsers(roomId);
            return (users);
        }

        // GET: api/Account/{roomId}/Admin
        [Route("{roomId}/Admin")]
        public IdentityUser GetAdmin(int roomId)
        {
            IdentityUser admin = _repo.GetAdmin(roomId);
            return (admin);
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

            IdentityResult result = await _repo.RegisterUser(userModel);

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

            IdentityUser user = await _repo.FindUserByName(userName);
            
            /*IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }*/

            return (user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repo.Dispose();
            }

            base.Dispose(disposing);
        }

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
