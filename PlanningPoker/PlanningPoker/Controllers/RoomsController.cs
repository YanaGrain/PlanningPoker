using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.Results;
using Microsoft.AspNet.Identity.EntityFramework;
using PlanningPoker.Models;
using PlanningPoker.Repositories;

namespace PlanningPoker.Controllers
{
    public class RoomsController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        //private PokerContext db = new PokerContext();
        private AccountRepository _repo = null;

        public RoomsController()
        {
            _repo = new AccountRepository(new PokerContext());
        }

        [HttpGet]
        [Route("api/Rooms/{userid}")]        
        // GET: api/Rooms
        public JsonResult<List<Room>> GetRooms(string userid)
        {
            string userId = userid;

            var links = unitOfWork.Links.GetLinks(userId);
            var rooms = links.Select(link => link.Room);
            
            return Json(rooms.ToList());
        }

        // GET: api/Rooms/5
        [ResponseType(typeof(Room))]
        [HttpGet]        
        [Route("api/Rooms/{id}/room")]
        public Room GetRoom(int id)
        {
            Room room = unitOfWork.Rooms.GetById(id);           

            return (room);
        }

        // PUT: api/Rooms/5
        [HttpPut]
        [ResponseType(typeof(void))]
        [Route("api/Rooms/{id}")]        
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

            unitOfWork.Rooms.Update(room);

            try
            {
                unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Rooms.IsExist(id))
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
        [HttpPost]
        [Route("api/Rooms/{name}")]
        [ResponseType(typeof(Room))]
        public async Task<IHttpActionResult> PostRoom(Room room, string name)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Rooms.Add(room);
            unitOfWork.SaveChanges();

            //string userName = User.Identity.GetUserName();
            IdentityUser user = await _repo.FindUserByName(name);
            string userId = user.Id;

            var link = new UserRoomLink()
            {
                RoomId = room.Id,
                UserId = userId,
                IsAdmin = true
            };

            unitOfWork.Links.Add(link);
            unitOfWork.SaveChanges();

            //return CreatedAtRoute("DefaultApi", new { id = room.Id }, room);

            return Ok(room.Id);
        }

        // DELETE: api/Rooms/5
        [HttpDelete]
        [Route("api/Rooms/{id}")]
        [ResponseType(typeof(Room))]
        public IHttpActionResult DeleteRoom(int id)
        {
            Room room = unitOfWork.Rooms.GetById(id);
            if (room == null)
            {
                return NotFound();
            }

            unitOfWork.Rooms.Remove(room);
            unitOfWork.SaveChanges();

            return Ok(room);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

    }
}