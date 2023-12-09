using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Car_Rental_System.Models
{
    public class Category
    {
        public int CategoryId { get; set; }

        [Required]
        [DisplayName("Category Type")]
        public string CategoryType { get; set; }

        public int category_id { get; set; }
        public string category_type { get; set; }
    }
}
