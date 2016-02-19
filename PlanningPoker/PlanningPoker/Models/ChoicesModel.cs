using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class Choice
    {
        public int Id { get; set; }

        [ForeignKey("Card")]
        public int CardId { get; set; }
        public virtual Card Card { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual UserModel User { get; set; }

        [ForeignKey("Story")]
        public int StoryId { get; set; }
        public virtual Story Story { get; set; }

    }
}