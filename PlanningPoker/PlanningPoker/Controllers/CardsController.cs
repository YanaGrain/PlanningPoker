using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.Results;
using PlanningPoker.Models;
using PlanningPoker.Repositories;

namespace PlanningPoker.Controllers
{
    public class CardsController : ApiController
    {
        UnitOfWork unitOfWork = new UnitOfWork();
        //private PokerContext db = new PokerContext();
        // GET: api/Cards
        public JsonResult<List<Card>> GetCards()
        {
            return Json(unitOfWork.Cards.GetAll());
        }

        // GET: api/Cards/5
        [ResponseType(typeof(Card))]
        public Card GetCard(int id)
        {
            Card card = unitOfWork.Cards.GetById(id);           

            return card;
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