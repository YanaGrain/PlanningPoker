using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.Results;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PlanningPoker.Models;

namespace PlanningPoker.Controllers
{
    public class UserModelsController : ApiController
    {
        private PokerRepository _repo = null;

        public UserModelsController()
        {
           _repo = new PokerRepository();
        }
        private PokerContext db = new PokerContext();

        // GET: api/UserModels
        public JsonResult<List<UserModel>> GetIdentityUsers()
        {
            return Json(db.IdentityUsers.ToList());
        }

        // GET: api/UserModels/5
        [ResponseType(typeof(UserModel))]
        [HttpGet]
        public JsonResult<IdentityUser> GetUserByName(string userName)
        {
            IdentityUser user = db.IdentityUsers.Where(x => x.UserName == userName).FirstOrDefault();
            //IdentityUser user = await _repo.FindUserByName(userName);
            return Json(user);
            //return Ok(user.Id);
        }


        // PUT: api/UserModels/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserModel(string id, UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userModel.Id)
            {
                return BadRequest();
            }

            db.Entry(userModel).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/UserModels
        [ResponseType(typeof(UserModel))]
        public IHttpActionResult PostUserModel(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.IdentityUsers.Add(userModel);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (UserModelExists(userModel.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = userModel.Id }, userModel);
        }

        // DELETE: api/UserModels/5
        [ResponseType(typeof(UserModel))]
        public IHttpActionResult DeleteUserModel(string id)
        {
            UserModel userModel = db.IdentityUsers.Find(id);
            if (userModel == null)
            {
                return NotFound();
            }

            db.IdentityUsers.Remove(userModel);
            db.SaveChanges();

            return Ok(userModel);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserModelExists(string id)
        {
            return db.IdentityUsers.Count(e => e.Id == id) > 0;
        }
    }
}