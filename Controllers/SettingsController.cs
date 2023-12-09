using Car_Rental_System.Data;
using Car_Rental_System.Models;
using Car_Rental_System.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace Car_Rental_System.Controllers
{
    public class SettingsController: Controller
    {
        private readonly ICategoryRepository _category;
        private readonly IVehicleRepository _vehicle;
        private readonly IBrandRepository _brand;
        private readonly IVehicleModelRepository _vehicleModel;


        public SettingsController(ICategoryRepository category, IVehicleRepository vehicle, IBrandRepository brand, IVehicleModelRepository vehicleModel)
        {
            _category = category;
            _vehicle = vehicle;
            _brand = brand;
            _vehicleModel = vehicleModel;

        }
        // Category
        public IActionResult Category() {
            try
            {
                CategoryViewModel categoryViewObject = new CategoryViewModel();
                categoryViewObject.AllCategories = _category.GetAllCategories();
                return View(categoryViewObject);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, errorMessage = ex.Message });
            }
           
        }


        [HttpPost]
        public IActionResult AddCategory([FromBody] Category category) {

            try
            {
                _category.InsertCategory(category);
                return Json(new { success = true, message = "Category Added Successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
       
        }

        [HttpPost]

        public IActionResult DeleteCategory(int id)
        {
            try
            {
                _category.DeleteCategory(id);
                return Json(new { success = true, message = "Deletation Successfull!!" });

            }
            catch (Exception ex)
            { 
                return Json(new { success = false, message = ex.Message });
            }
           
        }

        [HttpGet]

        public IActionResult GetCategoryById(int id)
        {
            try
            {
                Category category = _category.GetCategoryById(id);
                return Json(category);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]

        public IActionResult UpdateCategory([FromBody] Category category)
        {
            try
            {
                _category.UpdateCategory(category);
                return Json(new { success = true, message = "Edited Successfully!!" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }




        // Brand

        public IActionResult Brand()
        {
            BrandViewModel brandViewObject = new BrandViewModel();
            brandViewObject.Categories = _category.GetAllCategories();
            brandViewObject.Brands = _brand.GetAllBrands();
            return View(brandViewObject);
        }

        [HttpPost]

        public IActionResult AddBrand(Brand brand)
        {
            try
            {
                _brand.InsertBrand(brand);
                return Json(new { success = true, message = "Brand Added Successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

        }

        [HttpPost]
        public IActionResult DeleteBrand(int id)
        {
            try
            {
                _brand.DeleteBrand(id);
                return Json(new { success = true, message = "Brand Deleted Successfully" });
            }
            catch(Exception ex) {
                return Json(new { success = false, message = ex.Message });
            }

        }

        [HttpGet]

        public IActionResult GetBrandById(int id)
        {
            try
            {
                Brand brand = _brand.GetBrandById(id);
                return Json(brand);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

        }

        [HttpPost]
        public IActionResult UpdateBrand(Brand brand)
        {
            try
            {
                bool available = _brand.IsBrandNameAvailable(brand);
                if (!available)
                {
                    try
                    {
                        _brand.UpdateBrand(brand);
                        return Json(new { success = true, message = "Brand Name Does not Exists" });
                    }
                    catch( Exception ex)
                    {

                        return Json(new
                        {
                            success = false,
                            message = ex.Message
                        });
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Brand Name Already Exists" });
                }

            }
            catch (Exception ex)
            {

                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }




        // Model

        public IActionResult VehicleModel()
        {
            VehicleModelViewModel VehicleModelViewObject = new VehicleModelViewModel();
            VehicleModelViewObject.Categories = _category.GetAllCategories();
            VehicleModelViewObject.VehicleModels = _vehicleModel.GetAllVehicleModels();
            return View(VehicleModelViewObject);
        }

        [HttpGet]

        public IActionResult GetBrandBasedOnCategory(int id)
        {
            try
            {
                VehicleModelViewModel VehicleModelViewObject = new VehicleModelViewModel();
                VehicleModelViewObject.Brands = _brand.GetBrandBasedOnCategory(id);
                return Json(VehicleModelViewObject.Brands);
            }
            catch(Exception ex)
            {
                return Json(new {success= false, message= ex.Message });
            }
        }

        [HttpPost]

         public IActionResult AddVehicleModel(int BrandId, string VehicleModelName)
         {
                try
                {
                    _vehicleModel.InsertVehicleModel(BrandId,VehicleModelName);
                    return Json(new {success= true,message = "Vehicle Added Successfully" });
                }
                catch( Exception ex)
                {
                    return Json(new { success= false, message= ex.Message });
                }
         }

        [HttpPost]

        public IActionResult DeleteVehicleModel(int id) {

            try
            {
                _vehicleModel.DeleteVehicleModel(id);
                return Json(new { success = true, message = "Deleted Model Successfully" });
            }
            catch(Exception ex)
            {
                return Json(new {success= false,message= ex.Message});
            }
        
        }

        [HttpGet]

        public IActionResult GetVehicleModelById(int id)
        {
            try
            {
                VehicleModelViewModel VehicleModelViewObject = new VehicleModelViewModel();
                VehicleModelViewObject.VehicleModelObject = _vehicleModel.GetVehicleModelById(id);
                VehicleModelViewObject.Brands = _brand.GetBrandBasedOnCategory(VehicleModelViewObject.VehicleModelObject.CategoryId);
                return Json(VehicleModelViewObject);
            }
            catch (Exception ex)
            {
                return Json(new {success= false,message=ex.Message});
            }
        }

        public IActionResult UpdateVehicleModel(VehicleModel vehicleModel)
        {
            try
            {
                bool available = _vehicleModel.IsVehicleModelAvailable(vehicleModel);
                if (!available)
                {
                    try
                    {
                        _vehicleModel.UpdateVehicleModel(vehicleModel);
                        return Json(new { success = true, message = "Vehicle Model Does not Exists" });
                    }
                    catch (Exception ex)
                    {

                        return Json(new
                        {
                            success = false,
                            message = ex.Message
                        });
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Vehicle Model Already Exists" });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }






        //Vehicle
        public IActionResult Vehicle()
        {
            VehicleViewModel vehicleViewObject = new VehicleViewModel();
            vehicleViewObject.Categories= _category.GetAllCategories();
            vehicleViewObject.Vehicles = _vehicle.GetAllVehicles();
            return View(vehicleViewObject);

        }

        [HttpGet]
        public IActionResult GetVehicleModelBasedOnBrand(int id)
        {
            try
            {
                var vehiclemodels=_vehicleModel.GetVehicleModelBasedOnBrand(id);
                return Json(vehiclemodels);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult AddVehicle()
        {
            var newVehicle = new Vehicle();

            newVehicle.CategoryId = int.Parse(Request.Form["CategoryId"]);
            newVehicle.BrandId = int.Parse(Request.Form["BrandId"]);
            newVehicle.VehicleModelId = int.Parse(Request.Form["VehicleModelId"]);
            newVehicle.VehicleCapacity = int.Parse(Request.Form["VehicleCapacity"]);
            newVehicle.TotalQuantity = int.Parse(Request.Form["TotalQuantity"]);
            newVehicle.VehicleImage = Request.Form.Files["VehicleImage"];
            newVehicle.VehicleImageName = Request.Form.Files["VehicleImage"].FileName;
            var carsJson = Request.Form["Cars"];
            newVehicle.Cars = JsonConvert.DeserializeObject<List<Car>>(carsJson);

            try
            {
                _vehicle.InsertVehicle(newVehicle);
                return Json(new { success = true, message = "Vehicle Added Successfully!!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false,message = ex.Message});
            }
           
        }

       

        
        [HttpPost]
        public IActionResult DeleteVehicle(int id)
        {
            try
            {
                _vehicle.DeleteVehicle(id);
                return Json(new { success = true, message = "Deletation Successfull!!" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

        }

        [HttpGet]
        
        public IActionResult GetVehicleDetails(int id)
        {
            try
            {
                List<Car> cars = _vehicle.GetVehicleDetails(id);
                return Json(cars);
            }
            catch (Exception ex)
            {
                return Json(new { success = false,message =ex.Message});
            }
        }
        
        [HttpGet]

        public IActionResult GetVehicleById(int id)
        {
            try
            {
                VehicleViewModel vehicleObject = new VehicleViewModel();
                vehicleObject.Transport = _vehicle.GetVehicleInfoById(id);
                vehicleObject.Brands = _brand.GetBrandBasedOnCategory(vehicleObject.Transport.CategoryId);
                vehicleObject.Models = _vehicleModel.GetVehicleModelBasedOnBrand(vehicleObject.Transport.BrandId);
                return Json(vehicleObject);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]

        public IActionResult UpdateVehicle()
        {
            var newVehicle = new Vehicle();
            newVehicle.VehicleId = int.Parse(Request.Form["VehicleId"]);
            newVehicle.CategoryId = int.Parse(Request.Form["CategoryId"]);
            newVehicle.BrandId = int.Parse(Request.Form["BrandId"]);
            newVehicle.VehicleModelId = int.Parse(Request.Form["VehicleModelId"]);
            newVehicle.VehicleCapacity = int.Parse(Request.Form["VehicleCapacity"]);
            newVehicle.TotalQuantity = int.Parse(Request.Form["TotalQuantity"]);
            newVehicle.VehicleImageName = Request.Form["VehicleImageName"].ToString();
            if (Request.Form.Files.Count > 0 && Request.Form.Files[0] != null)
            {
                newVehicle.VehicleImage = Request.Form.Files["VehicleImage"];
            }
            var carsJson = Request.Form["Cars"];
            newVehicle.Cars = JsonConvert.DeserializeObject<List<Car>>(carsJson);

            List<Car> carsToBeDeleted = _vehicle.GetVehicleDetails(newVehicle.VehicleId);
            carsToBeDeleted = carsToBeDeleted.Where(c => !newVehicle.Cars.Any(newCar => newCar.CarId == c.CarId)).ToList();

            foreach(var car in carsToBeDeleted)
            {
                try
                {
                    _vehicle.DeleteCar(car);
                }
                catch (Exception ex)
                {
                    return Json(new {success=false,message= ex.Message});
                }
            }


            try
            {
                if (newVehicle.VehicleImage == null)
                {
                    _vehicle.UpdateVehicleWithoutImage(newVehicle);
                }
                else
                {
                    _vehicle.UpdateVehicle(newVehicle);
                }
                foreach (var car in newVehicle.Cars)
                {
                    if (car.CarId == 0)
                    {
                        try
                        {
                            _vehicle.InsertCar(car, newVehicle.VehicleId);

                        }
                        catch (Exception ex)
                        {
                            return Json(new { success = false, message = ex.Message });
                        }
                    }
                    else
                    {
                        try
                        {
                            _vehicle.UpdateCar(car);
                        }
                        catch (Exception ex)
                        {

                            return Json(new { success = false, message = ex.Message });
                        }
                    }

                }

                return Json(new { success = true, message = "Edited Successfully!!" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }

        }

        /*
        [HttpPost]

        public IActionResult ChangeTotalVehicle(int VehicleId,int TotalQuantity)
        {
            try
            {
                _vehicle.ChangeTotalVehicle(VehicleId, TotalQuantity);

                return Json(new { success = true, message = "Incremented Sucessfully!!" });
            }
            catch(Exception ex)
            {
                return Json(new { success = false,message = ex.Message});
            }
        }*/
    }
}
