using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using PlanningPoker.Models;
using PlanningPoker.Repositories;

namespace PlanningPoker.Controllers
{
    public class StoriesController : ApiController
    {
        UnitOfWork unitOfWork = new UnitOfWork();

        // GET: api/Stories/roomId
        [Route("api/Stories/{roomId}")]
        public List<Story> GetStories(int roomId)
        {
            return unitOfWork.Stories.GetStories(roomId);
        }

        // GET: api/Stories/5
        [ResponseType(typeof(Story))]
        [Route("api/Stories/{roomId}/current")]
        public Story GetCurrentStory(int roomId)
        {
            return unitOfWork.Stories.GetCurrentStory(roomId);
        }

        // PUT: api/Stories/5
        [HttpPut]
        [ResponseType(typeof(void))]
        [Route("api/Stories/{id}")]
        public IHttpActionResult PutStory(int id, Story story)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != story.Id)
            {
                return BadRequest();
            }

            unitOfWork.Stories.Update(story);

            try
            {
                unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Stories.IsExist(id))
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

        // POST: api/Stories
        [ResponseType(typeof(Story))]
        public IHttpActionResult PostStory(Story story)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Stories.Add(story);
            unitOfWork.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = story.Id }, story);
        }

        // DELETE: api/Stories/5
        [ResponseType(typeof(Story))]
        [HttpDelete]
        [Route("api/Stories/{id}")]
        public IHttpActionResult DeleteStory(int id)
        {
            Story story = unitOfWork.Stories.GetById(id);
            if (story == null)
            {
                return NotFound();
            }

            unitOfWork.Stories.Remove(story);
            unitOfWork.SaveChanges();

            return Ok(story);
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