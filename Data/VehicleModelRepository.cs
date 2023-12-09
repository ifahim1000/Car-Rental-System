using Car_Rental_System.Models;
using Dapper;
using System.Data.SqlClient;

namespace Car_Rental_System.Data
{
    public class VehicleModelRepository: IVehicleModelRepository
    {
       
        private readonly IDapperDbContext _dapper;
        private SqlCommand _command = null;
        public VehicleModelRepository(IDapperDbContext dapper)
        {
            _dapper = dapper;
        }

        public void InsertVehicleModel(int BrandId, string VehicleModelName)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BrandId", BrandId);
            parameters.Add("@VehicleModelName", VehicleModelName);
            _dapper.ModifyData("spInsertVehicleModel", parameters);
        }

        public List<VehicleModel> GetAllVehicleModels() {

            var parameters = new DynamicParameters();
            var allVehicleModels=_dapper.QueryData<VehicleModel>("spGetAllVehicleModels", parameters);
            return allVehicleModels.ToList();
        
        }

        public void DeleteVehicleModel(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@VehicleModelId", id);
            _dapper.ModifyData("spDeleteVehicleModel", parameters);
        }

        public VehicleModel GetVehicleModelById(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@VehicleModelId", id);
            return (VehicleModel)_dapper.GetInfoById<VehicleModel>("spGetVehicleModelById", parameters);
        }

        public bool IsVehicleModelAvailable(VehicleModel vehicleModel)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@VehicleModelId", vehicleModel.VehicleModelId);
            parameters.Add("@VehicleModelName",vehicleModel.VehicleModelName);
            parameters.Add("@BrandId", vehicleModel.BrandId);
            var result = _dapper.CheckExists<int, dynamic>("spIsVehicleModelAvailable", parameters);
            return result > 0;
        }

        public void UpdateVehicleModel(VehicleModel vehicleModel)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BrandId", vehicleModel.BrandId);
            parameters.Add("@VehicleModelName", vehicleModel.VehicleModelName);
            parameters.Add("@VehicleModelId", vehicleModel.VehicleModelId);
            _dapper.ModifyData("spUpdateVehicleModel", parameters);

        }

        public List<VehicleModel> GetVehicleModelBasedOnBrand(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BrandId", id);
            var vehicleModels = _dapper.QueryData<VehicleModel>("spGetVehicleModelBasedOnBrand", parameters);
            return vehicleModels.ToList();
        }
    }
}
