using Car_Rental_System.Models;

namespace Car_Rental_System.Data
{
    public interface IVehicleModelRepository
    {
        void InsertVehicleModel(int BrandId, string VehicleModelName);
        List<VehicleModel> GetAllVehicleModels();
        void DeleteVehicleModel(int id);
        VehicleModel GetVehicleModelById(int id);
        bool IsVehicleModelAvailable(VehicleModel vehicleModel);
        void UpdateVehicleModel(VehicleModel vehicleModel);
        List<VehicleModel> GetVehicleModelBasedOnBrand(int id);

        
    }
}
