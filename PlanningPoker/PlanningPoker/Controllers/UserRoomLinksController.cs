using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using PlanningPoker.Models;

namespace PlanningPoker.Controllers
{
    public class UserRoomLinksController : ApiController
    {
        private PokerContext db = new PokerContext();

        // GET: api/UserRoomLinks
        public IQueryable<UserRoomLink> GetLinks()
        {
            return db.Links;
        }

        

        [ResponseType(typeof(UserRoomLink))]
        [Route("api/UserRoomLinks/{userid}/{roomid}")]
        public IHttpActionResult GetUserRoomLink(string userId, int roomId)
        {
            UserRoomLink userRoomLink = db.Links.Where<UserRoomLink>(l=>l.RoomId == roomId && l.UserId==userId).FirstOrDefault();
            if (userRoomLink == null)
            {
                return NotFound();
            }

            return Ok(userRoomLink);
        }

        // PUT: api/UserRoomLinks/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserRoomLink(int id, UserRoomLink userRoomLink)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userRoomLink.Id)
            {
                return BadRequest();
            }

            db.Entry(userRoomLink).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserRoomLinkExists(id))
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

        // POST: api/UserRoomLinks
        [ResponseType(typeof(UserRoomLink))]
        public IHttpActionResult PostUserRoomLink(UserRoomLink userRoomLink)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            db.Links.Add(userRoomLink);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userRoomLink.Id }, userRoomLink);
        }

        // DELETE: api/UserRoomLinks/5
        [ResponseType(typeof(UserRoomLink))]
        [Route("api/UserRoomLinks/{userid}/{roomid}")]
        public IHttpActionResult DeleteUserRoomLink(string userId, int roomId)
        {
            int id = db.Links.Where(link => link.UserId == userId && link.RoomId == roomId).SingleOrDefault().Id;

            UserRoomLink userRoomLink = db.Links.Find(id);
            if (userRoomLink == null)
            {
                return NotFound();
            }

            db.Links.Remove(userRoomLink);
            db.SaveChanges();

            return Ok(userRoomLink);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserRoomLinkExists(int id)
        {
            return db.Links.Count(e => e.Id == id) > 0;
        }
    }
}