using System.ComponentModel;

namespace Car_Rental_System.Models
{
    public class VehicleModel
    {
        public int VehicleModelId { get; set; }

        [DisplayName("Model Name")]
        public string VehicleModelName { get; set;}

        public int BrandId { get; set; }

        [DisplayName("Brand Name")]
        public string BrandName { get; set; }
        public int CategoryId { get; set; }

        [DisplayName("Category Type")]
        public string CategoryName { get; set; }
    }
}
