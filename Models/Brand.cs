using System.ComponentModel;

namespace Car_Rental_System.Models
{
    public class Brand
    {
        public int BrandId { get; set; }

        [DisplayName("Brand Name")]
        public string BrandName { get; set; }
        public int CategoryId {  get; set; }

        [DisplayName("Category Type")]
        public string CategoryName { get; set; }
    }
}
