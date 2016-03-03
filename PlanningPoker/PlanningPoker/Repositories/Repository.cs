using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using PlanningPoker.Models;

namespace PlanningPoker.Repositories
{
    public class Repository<T, TKey> : IRepository<T, TKey> where T : class
    {
        protected readonly PokerContext ctx;

        public Repository(PokerContext context)
        {
            ctx = context;
        }
        public void Add(T entity)
        {
            ctx.Set<T>().Add(entity);
        }

        public IQueryable<T> Find(Expression<Func<T, bool>> predicate)
        {
             return ctx.Set<T>().Where(predicate);           
        }

        public List<T> GetAll()
        {
            return ctx.Set<T>().ToList();
        }

        public T GetById(TKey id)
        {
            return ctx.Set<T>().Find(id);
        }

        public void Remove(T entity)
        {
            ctx.Set<T>().Remove(entity);
        }
        public void Update(T entity)
        {
            ctx.Entry(entity).State = EntityState.Modified;           
        }
        public bool IsExist(TKey id)
        {
            if (GetById(id) != null) return true;
            return false;
        }

        public List<T> Include(params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = ctx.Set<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query.ToList();
        }
    }
}