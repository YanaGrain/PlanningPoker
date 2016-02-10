using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class Card
    {
        public int Id { get; set; }
        public string Value { get; set; }
        //public string Path { get; set; }

        //public virtual ICollection<PokerChoice> Choices { get; set; }

        public static List<Card> CreateCards()
        {
            List<Card> cardsList = new List<Card>
            {
                new Card {Id = 1, Value = "0" },
                new Card {Id = 2, Value = "1/2" },
                new Card {Id = 3, Value = "1" },
                new Card {Id = 4, Value = "2" },
                new Card {Id = 5, Value = "3" },
                new Card {Id = 6, Value = "5" },
                new Card {Id = 7, Value = "8" },
                new Card {Id = 8, Value = "13" },
                new Card {Id = 9, Value = "20" },
                new Card {Id = 10, Value = "40" },
                new Card {Id = 11, Value = "100" },
                new Card {Id = 12, Value = "Wtf" },
                new Card {Id = 13, Value = "Coffee" }
            };

            return cardsList;
        }
    }
}
