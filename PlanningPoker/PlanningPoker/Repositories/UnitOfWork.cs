using System;
using PlanningPoker.Models;

namespace PlanningPoker.Repositories
{
    public class UnitOfWork : IDisposable
    {
        private PokerContext db = new PokerContext();
        private AccountRepository _accountRepository;
        private RoomRepository _roomRepository;
        private LinkRepository _linkRepository;
        private CardRepository _cardRepository;
        private ChoiceRepository _choiceRepository;
        private StoryRepository _storyRepository;

        public AccountRepository Accounts
        {
            get
            {
                if (_accountRepository == null)
                    _accountRepository = new AccountRepository(db);
                return _accountRepository;
            }
        }

        public RoomRepository Rooms
        {
            get
            {
                if (_roomRepository == null)
                    _roomRepository = new RoomRepository(db);
                return _roomRepository;
            }
        }

        public LinkRepository Links
        {
            get
            {
                if (_linkRepository == null)
                    _linkRepository = new LinkRepository(db);
                return _linkRepository;
            }
        }

        public CardRepository Cards
        {
            get
            {
                if (_cardRepository == null)
                    _cardRepository = new CardRepository(db);
                return _cardRepository;
            }
        }

        public ChoiceRepository Choices
        {
            get
            {
                if (_choiceRepository == null)
                    _choiceRepository = new ChoiceRepository(db);
                return _choiceRepository;
            }
        }

        public StoryRepository Stories
        {
            get
            {
                if (_storyRepository == null)
                    _storyRepository = new StoryRepository(db);
                return _storyRepository;
            }
        }

        public void Dispose()
        {
            db.Dispose();
        }
        public void SaveChanges()
        {
            db.SaveChanges();
        }
    }
}