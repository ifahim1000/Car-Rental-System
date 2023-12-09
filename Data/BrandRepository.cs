using Car_Rental_System.Models;
using Dapper;
using System.Data.SqlClient;

namespace Car_Rental_System.Data
{
    public class BrandRepository: IBrandRepository
    {
        private readonly IDapperDbContext _dapper;
        private SqlCommand _command = null;
        public BrandRepository(IDapperDbContext dapper = null)
        {
            _dapper = dapper;
        }

        public void InsertBrand(Brand brand)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CategoryId",brand.CategoryId);
            parameters.Add("@BrandName", brand.BrandName);
            _dapper.ModifyData("spInsertBrand", parameters);

        }

        public List<Brand> GetAllBrands()
        {
            var parameters = new DynamicParameters();
            var allBrands = _dapper.QueryData<Brand>("spGetAllBrands", parameters);
            return allBrands.ToList();

        }

        public void DeleteBrand(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BrandId", id);
            _dapper.ModifyData("spDeleteBrand", parameters);
        }

        public Brand GetBrandById(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BrandId", id);
            return (Brand)_dapper.GetInfoById<Brand>("spGetBrandById", parameters);

        }

        public bool IsBrandNameAvailable(Brand brand)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BrandId", brand.BrandId);
            parameters.Add("@BrandName",brand.BrandName);
            parameters.Add("@CategoryId", brand.CategoryId);
            var result = _dapper.CheckExists<int, dynamic>("spIsBrandNameAvailable", parameters);
            return result > 0;
        }

        public void UpdateBrand(Brand brand)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BrandId", brand.BrandId);
            parameters.Add("@BrandName", brand.BrandName);
            parameters.Add("@CategoryId", brand.CategoryId);
            _dapper.ModifyData("spUpdateBrand", parameters);
        }

        public List<Brand> GetBrandBasedOnCategory(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CategoryId", id);
            var allBrands = _dapper.QueryData<Brand>("spGetBrandBasedOnCategory", parameters);
            return allBrands.ToList();

        }
    }
}
