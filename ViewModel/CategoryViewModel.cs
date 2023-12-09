using Car_Rental_System.Models;

namespace Car_Rental_System.ViewModel
{
    public class CategoryViewModel
    {
        public Category CategoryItem { get; set; }

        public List<Category> AllCategories = new List<Category>();

    }
}
