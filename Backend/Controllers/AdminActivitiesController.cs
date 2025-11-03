using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MascotaSnacksAPI.Services;

namespace MascotaSnacksAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminActivitiesController : ControllerBase
    {
        private readonly AdminActivityService _activityService;

        public AdminActivitiesController(AdminActivityService activityService)
        {
            _activityService = activityService;
        }

        // GET: api/adminactivities
        [HttpGet]
        public IActionResult GetRecentActivities([FromQuery] int count = 20)
        {
            var activities = _activityService.GetRecentActivities(count);
            return Ok(activities);
        }

        // DELETE: api/adminactivities
        [HttpDelete]
        public IActionResult ClearActivities()
        {
            _activityService.ClearActivities();
            return Ok(new { message = "Actividades limpiadas exitosamente" });
        }
    }
}
