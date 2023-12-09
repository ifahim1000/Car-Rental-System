using Car_Rental_System.Models;

namespace Car_Rental_System.Data
{
    public interface ICategoryRepository
    {
        List<Category> GetAllCategories();

        void InsertCategory(Category category);

        void DeleteCategory(int id);

        Category GetCategoryById(int id);

        void UpdateCategory(Category category);
    }
}
