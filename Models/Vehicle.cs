using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Car_Rental_System.Models
{
    public class Vehicle
    {
        public int VehicleId { get; set; }

        public int CategoryId { get; set; }

        [DisplayName("Category Name")]
        public string CategoryName { get; set; }
        
        public int BrandId { get; set; }

        [DisplayName("Vehicle Brand")]
        public string BrandName { get; set; }

        
        public int VehicleModelId { get; set; }

        [DisplayName("Vehicle Model")]
        public string VehicleModelName { get; set;}

        
        [DisplayName("Vehicle Capacity")]
        public int VehicleCapacity { get; set; }

        [DisplayName("Total Quantity")]
        public int TotalQuantity { get; set; }

        public int AvailableQuantity { get; set; }

        [DisplayName("Vehicle Image")]
        public IFormFile VehicleImage { get; set; }

        public byte[]? VehicleImageBase64 { get; set; }

        public string VehicleImageName { get; set; }

        public List<Car> Cars { get; set; }
      
    }
}
