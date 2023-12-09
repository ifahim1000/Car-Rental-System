using Car_Rental_System.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Car_Rental_System.ViewModel
{
    public class VehicleViewModel
    {
        public Vehicle Transport { get; set; }

        public List<Vehicle> Vehicles = new List<Vehicle>();    

        public List<Category> Categories = new List<Category>();

        public List<Brand> Brands = new List<Brand>();

        public List<VehicleModel> Models = new List<VehicleModel>();

    }
}
