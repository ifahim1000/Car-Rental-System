using Car_Rental_System.Models;

namespace Car_Rental_System.ViewModel
{
    public class BrandViewModel
    {
        public Brand VehicleBrand { get; set; }

        public List<Category> Categories = new List<Category>();

        public List<Brand> Brands { get; set; }
    }
}
