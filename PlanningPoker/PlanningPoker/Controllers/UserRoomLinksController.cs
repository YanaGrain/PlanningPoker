using System.Data.Entity.Infrastructure;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using PlanningPoker.Models;
using PlanningPoker.Repositories;

namespace PlanningPoker.Controllers
{
    public class UserRoomLinksController : ApiController
    {
        UnitOfWork unitOfWork = new UnitOfWork();
        //private PokerContext db = new PokerContext();

        [ResponseType(typeof(UserRoomLink))]
        [Route("api/UserRoomLinks/{userid}/{roomid}")]
        public UserRoomLink GetUserRoomLink(string userId, int roomId)
        {
            UserRoomLink userRoomLink = unitOfWork.Links.GetLink(userId, roomId);
            return (userRoomLink);
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

           unitOfWork.Links.Update(userRoomLink);

            try
            {
                unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Links.IsExist(id))
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
            
            unitOfWork.Links.Add(userRoomLink);
            unitOfWork.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userRoomLink.Id }, userRoomLink);
        }

        // DELETE: api/UserRoomLinks/5
        [ResponseType(typeof(UserRoomLink))]
        [Route("api/UserRoomLinks/{userid}/{roomid}")]
        public IHttpActionResult DeleteUserRoomLink(string userId, int roomId)
        {
            int id = unitOfWork.Links.GetLink(userId, roomId).Id;

            UserRoomLink userRoomLink = unitOfWork.Links.GetById(id);
            if (userRoomLink == null)
            {
                return NotFound();
            }

            unitOfWork.Links.Remove(userRoomLink);
            unitOfWork.SaveChanges();

            return Ok(userRoomLink);
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