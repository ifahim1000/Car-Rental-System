using Car_Rental_System.Data;
using Car_Rental_System.Models;
using Car_Rental_System.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace Car_Rental_System.Controllers
{
    public class RidesController: Controller
    { 
        private readonly IHttpContextAccessor _accessor;
        private readonly IBookingRepository _booking;
        public RidesController( IHttpContextAccessor accessor, IBookingRepository booking)
        {
            _accessor = accessor;
            _booking = booking;
        }

        public IActionResult Index()
        {
            RidesViewModel ridesObject = new RidesViewModel();

            var userId = _accessor.HttpContext.Session.GetInt32("userId");
            var userType = _accessor.HttpContext.Session.GetInt32("userType");
            if(userType == 1)
            {
                ridesObject.AllBooking = _booking.GetAllBookings();
            }
            if(userType == 2)
            {
                int particularUserId = (int)userId;
                ridesObject.MyBooking = _booking.GetParticularUserBookings(particularUserId);
            }

            return View(ridesObject);
        }

        [HttpPost]
        public IActionResult DeleteBooking(int id) {
            try
            {
                _booking.DeleteBooking(id);
                return Json(new { success = true, message = "Deletation Successfull!!" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

        }

        [HttpGet]

        public IActionResult GetBookedCars(int id)
        {
            List<Car> bookedCars = _booking.GetBookedCars(id);
            return PartialView("_BookedCars",bookedCars);
        }

        
        [HttpPost]
        public IActionResult ReturnBooking(int id)
        {
            try
            {
                _booking.ReturnBooking(id);
                return Json(new { success = true, message = "Returned Successfully!!" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
