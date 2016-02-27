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
    public class StoriesController : ApiController
    {
        private PokerContext db = new PokerContext();

        // GET: api/Stories/roomId
        [Route("api/Stories/{roomId}")]
        public List<Story> GetStories(int roomId)
        {
            var stories = db.Stories
                .Where(story => story.RoomId == roomId);
            return stories.ToList();
        }

        // GET: api/Stories/5
        [ResponseType(typeof(Story))]
        [Route("api/Stories/{roomId}/current")]
        public Story GetCurrentStory(int roomId)
        {
            Story story = db.Stories.Where(st=>st.RoomId == roomId && st.IsClosed == false).FirstOrDefault();
            return (story);
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

            db.Entry(story).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StoryExists(id))
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

            db.Stories.Add(story);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = story.Id }, story);
        }

        // DELETE: api/Stories/5
        [ResponseType(typeof(Story))]
        [HttpDelete]
        [Route("api/Stories/{id}")]
        public IHttpActionResult DeleteStory(int id)
        {
            Story story = db.Stories.Find(id);
            if (story == null)
            {
                return NotFound();
            }

            db.Stories.Remove(story);
            db.SaveChanges();

            return Ok(story);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StoryExists(int id)
        {
            return db.Stories.Count(e => e.Id == id) > 0;
        }
    }
}