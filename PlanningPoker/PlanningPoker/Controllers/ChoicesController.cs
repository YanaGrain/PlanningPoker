using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using PlanningPoker.Models;
using PlanningPoker.Repositories;

namespace PlanningPoker.Controllers
{
    public class ChoicesController : ApiController
    {
        UnitOfWork unitOfWork = new UnitOfWork();
        
        // GET: api/Choices/5
        [ResponseType(typeof(Choice))]
        [Route("api/Choices/{storyId}")]
        public List<Choice> GetChoices(int storyId)
        {
            return unitOfWork.Choices.GetChoices(storyId);
        }

        // PUT: api/Choices/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutChoice(int id, Choice choice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != choice.Id)
            {
                return BadRequest();
            }

            unitOfWork.Choices.Update(choice);

            try
            {
                unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!unitOfWork.Choices.IsExist(id))
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

        // POST: api/Choices
        [ResponseType(typeof(Choice))]
        public IHttpActionResult PostChoice(Choice choice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Choices.Add(choice);
            unitOfWork.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = choice.Id }, choice);
        }

        // DELETE: api/Choices/5
        [ResponseType(typeof(Choice))]
        public IHttpActionResult DeleteChoice(int id)
        {
            Choice choice = unitOfWork.Choices.GetById(id);
            if (choice == null)
            {
                return NotFound();
            }

            unitOfWork.Choices.Remove(choice);
            unitOfWork.SaveChanges();

            return Ok(choice);
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