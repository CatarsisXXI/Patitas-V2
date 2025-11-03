using System;
using System.Collections.Generic;
using System.Linq;

namespace MascotaSnacksAPI.Services
{
    public class AdminActivity
    {
        public int ActivityID { get; set; }
        public string AdminName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string EntityType { get; set; } = string.Empty; // "Producto", "Pedido", etc.
        public int? EntityID { get; set; }
    }

    public class AdminActivityService
    {
        private readonly List<AdminActivity> _activities = new();
        private int _nextId = 1;
        private const int MaxActivities = 100; // Keep only last 100 activities

        public void LogActivity(string adminName, string action, string description, string entityType, int? entityId = null)
        {
            var activity = new AdminActivity
            {
                ActivityID = _nextId++,
                AdminName = adminName,
                Action = action,
                Description = description,
                Timestamp = DateTime.Now,
                EntityType = entityType,
                EntityID = entityId
            };

            _activities.Add(activity);

            // Keep only the most recent activities
            if (_activities.Count > MaxActivities)
            {
                _activities.RemoveAt(0);
            }
        }

        public List<AdminActivity> GetRecentActivities(int count = 20)
        {
            return _activities
                .OrderByDescending(a => a.Timestamp)
                .Take(count)
                .ToList();
        }

        public void ClearActivities()
        {
            _activities.Clear();
            _nextId = 1;
        }
    }
}