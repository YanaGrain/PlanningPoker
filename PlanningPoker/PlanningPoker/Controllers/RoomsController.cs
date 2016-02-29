using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.Results;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PlanningPoker.Models;

namespace PlanningPoker.Controllers
{
    public class RoomsController : ApiController
    {
        private PokerContext db = new PokerContext();
        private PokerRepository _repo = null;

        public RoomsController()
        {
            _repo = new PokerRepository();
        }

        [HttpGet]
        [Route("api/Rooms/{userid}")]        
        // GET: api/Rooms
        public JsonResult<List<Room>> GetRooms(string userid)
        {
            string userId = userid;

            var links = db.Links
                .Where(link => link.UserId == userId)
                .Include(link => link.Room).ToList();
            var rooms = links.Select(link => link.Room);
            
            return Json(rooms.ToList());
        }

        // GET: api/Rooms/5
        [ResponseType(typeof(Room))]
        [HttpGet]        
        [Route("api/Rooms/{id}/room")]
        public IHttpActionResult GetRoom(int id)
        {
            Room room = db.Rooms.Find(id);
            if (room == null)
            {
                return NotFound();
            }

            return Ok(room);
        }

        // PUT: api/Rooms/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutRoom(int id, Room room)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != room.Id)
            {
                return BadRequest();
            }

            db.Entry(room).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
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

        // POST: api/Rooms
        [ResponseType(typeof(Room))]
        public async Task<IHttpActionResult> PostRoom(Room room)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Rooms.Add(room);
            db.SaveChanges();

            string userName = User.Identity.GetUserName();
            IdentityUser user = await _repo.FindUserByName(userName);
            string userId = user.Id;

            var link = new UserRoomLink()
            {
                RoomId = room.Id,
                UserId = userId,
                IsAdmin = true
            };

            db.Links.Add(link);
            db.SaveChanges();

            //return CreatedAtRoute("DefaultApi", new { id = room.Id }, room);

            return Ok(room.Id);
        }

        // DELETE: api/Rooms/5
        [HttpDelete]
        [Route("api/Rooms/{id}")]
        [ResponseType(typeof(Room))]
        public IHttpActionResult DeleteRoom(int id)
        {
            Room room = db.Rooms.Find(id);
            if (room == null)
            {
                return NotFound();
            }

            db.Rooms.Remove(room);
            db.SaveChanges();

            return Ok(room);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RoomExists(int id)
        {
            return db.Rooms.Count(e => e.Id == id) > 0;
        }
    }
}