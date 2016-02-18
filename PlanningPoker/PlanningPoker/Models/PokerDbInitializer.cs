using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanningPoker.Models
{
    public class PokerDbInitializer: System.Data.Entity.DropCreateDatabaseIfModelChanges<PokerContext>
    {
        protected override void Seed(PokerContext db)
        {
            db.Cards.Add(new Card { Value = "0", Path = "../../img/cards/card0.png" });
            db.Cards.Add(new Card { Value = "1/2", Path = "../../img/cards/cardHalf.png" });
            db.Cards.Add(new Card { Value = "1", Path = "../../img/cards/card1.png" });
            db.Cards.Add(new Card { Value = "2", Path = "../../img/cards/card2.png" });
            db.Cards.Add(new Card { Value = "3", Path = "../../img/cards/card3.png" });
            db.Cards.Add(new Card { Value = "5", Path = "../../img/cards/card5.png" });
            db.Cards.Add(new Card { Value = "8", Path = "../../img/cards/card8.png" });
            db.Cards.Add(new Card { Value = "13", Path = "../../img/cards/card13.png" });
            db.Cards.Add(new Card { Value = "20", Path = "../../img/cards/card20.png" });
            db.Cards.Add(new Card { Value = "40", Path = "../../img/cards/card40.png" });
            db.Cards.Add(new Card { Value = "100", Path = "../../img/cards/card100.png" });
            db.Cards.Add(new Card { Value = "?", Path = "../../img/cards/cardWtf.png" });
            db.Cards.Add(new Card { Value = "Coffee", Path = "../../img/cards/cardCoffee.png" });

            base.Seed(db);
        }
    }
}