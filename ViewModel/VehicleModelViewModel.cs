using Car_Rental_System.Models;

namespace Car_Rental_System.ViewModel
{
    public class VehicleModelViewModel
    {
        public VehicleModel VehicleModelObject { get; set; }

        public List<Category> Categories { get; set; } = new List<Category>();

        public List<Brand> Brands { get; set; } = new List<Brand>();

        public List<VehicleModel> VehicleModels { get; set; }   
    }
}
