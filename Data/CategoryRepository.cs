using Car_Rental_System.Models;
using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace Car_Rental_System.Data
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IDapperDbContext _dapper;
        private SqlCommand _command = null;
        public CategoryRepository(IDapperDbContext dapper = null)
        {
            _dapper = dapper;
        }
        
        public List<Category> GetAllCategories()
        {
            var parameters = new DynamicParameters();
            var allCategories = _dapper.QueryData<Category>("spGetAllCategories", parameters);
            return allCategories.ToList();
        }

        public void InsertCategory(Category category)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@category_type", category.CategoryType);
            _dapper.ModifyData("spInsertCategory", parameters);

        }

        public void DeleteCategory(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@category_id", id);
            _dapper.ModifyData("spDeleteCategory", parameters);
        }

        public Category GetCategoryById(int id) 
        {
            var parameters = new DynamicParameters();
            parameters.Add("@category_id", id);
            return (Category)_dapper.GetInfoById<Category>("spGetCategoryById", parameters);

        }

        public void UpdateCategory(Category category)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@category_id", category.CategoryId);
            parameters.Add("@category_type", category.CategoryType);
            _dapper.ModifyData("spUpdateCategory", parameters);
        }
    }
}
