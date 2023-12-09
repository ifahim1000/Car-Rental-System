using Car_Rental_System.Models;

namespace Car_Rental_System.Data
{
    public interface IBrandRepository
    {
        void InsertBrand(Brand brand);
        List<Brand> GetAllBrands();
        void DeleteBrand(int id);
        Brand GetBrandById(int id);
        bool IsBrandNameAvailable(Brand brand);
        void UpdateBrand(Brand brand);
        List<Brand> GetBrandBasedOnCategory(int id);


    }
}
