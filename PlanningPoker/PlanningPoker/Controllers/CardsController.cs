using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PlanningPoker.Models;

namespace PlanningPoker.Controllers
{
    [RoutePrefix("api/Cards")]
    public class CardsController : ApiController
    {
        [Authorize]
        [Route("")]
        public IHttpActionResult Get()
        {
            return Ok(Card.CreateCards());
        }
    }
}
