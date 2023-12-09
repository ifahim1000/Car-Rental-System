using Car_Rental_System.Data;
using Car_Rental_System.Models;
using Car_Rental_System.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Diagnostics;

namespace Car_Rental_System.Controllers
{
    public class HomeController : Controller
    {
        private readonly IVehicleRepository _vehicle;
        private readonly IUserRepository _user;
        private readonly IHttpContextAccessor _accessor;
        private readonly IBookingRepository _booking;
        public HomeController(IVehicleRepository vehicle, IHttpContextAccessor accessor, IUserRepository user, IBookingRepository booking)
        {
            _vehicle = vehicle;
            _accessor = accessor;
            _user = user;
            _booking = booking;
        }

        public IActionResult Index()
        {
            HomeViewModel homeViewModel = new HomeViewModel();
            homeViewModel.Vehicles = _vehicle.GetVehicleAvailability();
            return View(homeViewModel);
        }

       
        [HttpGet]

        public IActionResult GetVehicleAvailabilityById(Booking book)
        {
            var userId = _accessor.HttpContext.Session.GetInt32("userId");
            if (userId == null)
            {
                return Json(new { success = true, message = "Sign In!!"});
            }
            else
            {
                try
                {
                    HomeViewModel homeobject = new HomeViewModel();
                    homeobject.Transport.VehicleModelName = book.VehicleModelName;
                    homeobject.Transport.VehicleCapacity = book.VehicleCapacity;
                    homeobject.Transport.Cars = _vehicle.GetVehicleAvailabilityById(book.VehicleId,book.StartDate,book.EndDate);
                    homeobject.Transport.AvailableQuantity = homeobject.Transport.Cars.Count;
                   
                    foreach (var car in homeobject.Transport.Cars)
                    {
                        if(!homeobject.CarsSortedOnModelYear.ContainsKey(car.ModelYear))
                        {
                            homeobject.CarsSortedOnModelYear[car.ModelYear] = new List<Car>();
                        }
                        homeobject.CarsSortedOnModelYear[(car.ModelYear)].Add(car);
                    }

                    return PartialView("_BookingForm",homeobject);
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = ex.Message });
                }
            }
        }

        [HttpPost]

       public IActionResult AddBooking() {
           
            var userId = _accessor.HttpContext.Session.GetInt32("userId");
            Booking book = new Booking();
            book.UserId = (int)userId;
            book.VehicleId = int.Parse(Request.Form["VehicleId"]);
            book.StartDate = DateTime.Parse(Request.Form["StartDate"]);
            book.EndDate = DateTime.Parse(Request.Form["EndDate"]).AddHours(23).AddMinutes(59).AddSeconds(59) ;
            var carsJson = Request.Form["Cars"];
            List<int> bookedCarsId= JsonConvert.DeserializeObject<List<int>>(carsJson);
            book.VehicleQuantity = bookedCarsId.Count;
           try
           {
                _booking.InsertBooking(book, bookedCarsId);
                return Json(new { success = true, message = "Booked Vehicle Successfully !!" });

           }
           catch (Exception ex)
           {
               return Json(new { success = false, message = "Error Occured While Booking !!" });
           }
       }

        [HttpGet]
        public IActionResult IsUserNameAvailable(string UserName)
        {
            try
            {
                bool available= _user.IsUserNameAvailable(UserName);
                if(available)
                {
                    return Json(new { success = false, message = "UserName Exists" });
                }
                else
                {
                    return Json(new { success = true, message = "UserName Does not Exists" });
                }
                
            }
            catch(Exception ex)
            {
                return Json(new { success=false, message= ex.Message});
            }
        }

        [HttpPost]
        public IActionResult Register([FromBody]User user)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _user.InsertUser(user);
                    return Json(new { success = true, message = "Registration successful" });
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = "Registration not successful. Internal Error" });
                }
            }
            else
            {
                var errors = ModelState.Values.SelectMany(modelState => modelState.Errors).Select(error => error.ErrorMessage);

                return Json(new { success = false, message = "Registration Failed, Found Errors", errors });
            }
           
        }

        [HttpPost]

        public IActionResult SignIn([FromBody] User user)
        {
            if(ModelState.IsValid)
            {
                try
                {
                    var userIdWithType = _user.CheckUser(user);
                    if (userIdWithType.Item1>0)
                    {
                        _accessor.HttpContext.Session.SetInt32("userId", userIdWithType.Item1);
                        _accessor.HttpContext.Session.SetInt32("userType", userIdWithType.Item2);
                        _accessor.HttpContext.Session.SetString("userName", user.UserName);
                        return Json(new { success = true, message = "LogIn successful" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Login failed. User not found." });
                    }
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = "Error Occured" });
                }
            }
            else
            {
                return Json(new { success = false, message = "LogIn Unsuccessful" });
            }
           
        }

        [HttpPost]
        public IActionResult Logout()
        {
            _accessor.HttpContext.Session.Remove("userId");
            _accessor.HttpContext.Session.Remove("userType");
            _accessor.HttpContext.Session.Remove("userName");
            return Json(new { success = true, message = "Logging Out Sucessfully !!" });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}