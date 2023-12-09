using Car_Rental_System.Models;
using System.Data.SqlClient;
using System.Data;
using static System.Net.Mime.MediaTypeNames;
using Dapper;

namespace Car_Rental_System.Data
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly ICategoryRepository _category;
        private readonly IDapperDbContext _dapper;
        private SqlCommand _command = null;
        public VehicleRepository( ICategoryRepository category, IDapperDbContext dapper)
        {
            _category = category;
            _dapper = dapper;
        }
        private IFormFile ConvertByteArrayToFormFile(byte[] data)
        {
            if (data == null || data.Length == 0)
            {
                return null;
            }

            // Create MemoryStream from the byte array
            var stream = new MemoryStream(data);

            // Create IFormFile with the MemoryStream 
            var posterFile = new FormFile(stream, 0, data.Length, null, "vehicle_poster.jpg");
            posterFile.Headers = new HeaderDictionary { { "Content-Type", "image/jpeg" } };

            return posterFile;
        }
        public void InsertVehicle(Vehicle vehicle)
        {
            DataTable carsTable = new DataTable();
            carsTable.Columns.Add("ModelYear", typeof(string));
            carsTable.Columns.Add("NumberPlate",typeof(string));

            foreach (var item in vehicle.Cars)
            {
                carsTable.Rows.Add(item.ModelYear,item.NumberPlate);
            }

            var parameters = new DynamicParameters();
            parameters.Add("@VehicleModelId", vehicle.VehicleModelId);
            parameters.Add("@VehicleCapacity", vehicle.VehicleCapacity);
            parameters.Add("@TotalQuantity", vehicle.TotalQuantity);
            parameters.Add("@VehicleImageName", vehicle.VehicleImageName);
            parameters.Add("@Cars", carsTable.AsTableValuedParameter("dbo.CarType"));
            using (var stream = new MemoryStream())
            {
                vehicle.VehicleImage.CopyTo(stream);
                byte[] image = stream.ToArray();
                parameters.Add("@VehicleImageBase64", image);
            }
            _dapper.ModifyData("spInsertVehicle", parameters);
        }
        public int GetLastInsertedVehicleId()
        {
            var parameters = new DynamicParameters();
            return (int)_dapper.GetInfoById<Vehicle>("spGetLastInsertedVehicleId", parameters).VehicleId;
        }

       
        public List<Vehicle> GetAllVehicles()
        {
            var parameters = new DynamicParameters();
            var allVehicles = _dapper.QueryData<Vehicle>("spGetAllVehicles", parameters);
            foreach ( var vehicle in allVehicles )
            {
                vehicle.VehicleImage = ConvertByteArrayToFormFile(vehicle.VehicleImageBase64);
            }
            return allVehicles.ToList();
        }

        public void DeleteVehicle(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@VehicleId", id);
            _dapper.ModifyData("spDeleteVehicle", parameters);
        }

        public List<Car > GetVehicleDetails(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@VehicleId", id);
            var cars = _dapper.QueryData<Car>("spGetVehicleDetails", parameters);
            return cars.ToList();
        }

        public Vehicle GetVehicleInfoById(int id) {

            var parameters = new DynamicParameters();
            parameters.Add("@VehicleId", id);
            var vehicle= (Vehicle)_dapper.GetInfoById<Vehicle>("spGetVehicleById", parameters);
            vehicle.Cars = _dapper.QueryData<Car>("spGetCarsByVehicleId",parameters).ToList();

            return vehicle;

        }

        public void UpdateVehicle(Vehicle vehicle)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@VehicleId", vehicle.VehicleId);
            parameters.Add("@VehicleModelId", vehicle.VehicleModelId);
            parameters.Add("@VehicleCapacity", vehicle.VehicleCapacity);
            parameters.Add("@TotalQuantity", vehicle.TotalQuantity);
            parameters.Add("@VehicleImageName", vehicle.VehicleImageName);
            using (var stream = new MemoryStream())
            {
                vehicle.VehicleImage.CopyTo(stream);
                byte[] image = stream.ToArray();
                parameters.Add("@VehiclePoster", image);
            }
            _dapper.ModifyData("spUpdateVehicle", parameters);

        }

        public void UpdateVehicleWithoutImage(Vehicle vehicle)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@VehicleId", vehicle.VehicleId);
            parameters.Add("@VehicleModelId", vehicle.VehicleModelId);
            parameters.Add("@VehicleCapacity", vehicle.VehicleCapacity);
            parameters.Add("@TotalQuantity", vehicle.TotalQuantity);
            parameters.Add("@VehicleImageName", vehicle.VehicleImageName);
            _dapper.ModifyData("spUpdateVehicleWithoutImage", parameters);

        }

        public List<Car> GetVehicleAvailabilityById(int id, DateTime startDate, DateTime endDate)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Vehicleid", id);
            parameters.Add("@StartDate", startDate);
            parameters.Add("@EndDate", endDate);

            return _dapper.QueryData<Car>("spGetVehicleAvailabilityById", parameters).ToList();

        }

        public List<Vehicle> GetVehicleAvailability()
        {
            var parameters = new DynamicParameters();
            var allVehicles = _dapper.QueryData<Vehicle>("spGetVehicleAvailability", parameters);
            foreach (var vehicle in allVehicles)
            {
                vehicle.VehicleImage = ConvertByteArrayToFormFile(vehicle.VehicleImageBase64);
            }
            return allVehicles.ToList();

        }

        public void ChangeTotalVehicle(int VehicleId, int TotalQuantity)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@vehicle_id", VehicleId);
            parameters.Add("@total_quantity", TotalQuantity);
            _dapper.ModifyData("spChangeTotalVehicle", parameters);
        }

        public void InsertCar(Car car, int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@ModelYear", car.ModelYear);
            parameters.Add("@NumberPlate", car.NumberPlate);
            parameters.Add("@VehicleId", id);
            _dapper.ModifyData("spInsertCar", parameters);
        }

        public void UpdateCar(Car car)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CarId", car.CarId);
            parameters.Add("@ModelYear", car.ModelYear);
            parameters.Add("@NumberPlate", car.NumberPlate);
            _dapper.ModifyData("spUpdateCar", parameters);
        }

        public void DeleteCar(Car car)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CarId", car.CarId);
            _dapper.ModifyData("spDeleteCar", parameters);

        }



    }
}
