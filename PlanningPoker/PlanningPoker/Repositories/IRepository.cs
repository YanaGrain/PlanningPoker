using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace PlanningPoker.Repositories
{
    public interface IRepository<T, in TKey> where T: class
    {
        List<T> GetAll();
        T GetById(TKey id);
        IQueryable<T> Find(Expression<Func<T, bool>> predicate);
        void Add(T entity);
        void Remove(T entity);
        void Update(T entity);
        bool IsExist(TKey id);
        List<T> Include(params Expression<Func<T, object>>[] includeProperties);
    }
}
