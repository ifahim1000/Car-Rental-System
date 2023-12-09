using Car_Rental_System.Models;

namespace Car_Rental_System.Data
{
    public interface IVehicleRepository
    {
        List<Vehicle> GetAllVehicles();
        void InsertVehicle(Vehicle vehicle);
        void DeleteVehicle(int id);
        Vehicle GetVehicleInfoById(int id);
        void UpdateVehicle(Vehicle vehicle);
        List<Car> GetVehicleAvailabilityById(int id, DateTime startDate, DateTime endDate);
        List<Vehicle> GetVehicleAvailability();
        void ChangeTotalVehicle(int VehicleId, int TotalQuantity);
        void UpdateVehicleWithoutImage(Vehicle vehicle);
        int GetLastInsertedVehicleId();
        void InsertCar(Car car, int id);
        List<Car> GetVehicleDetails(int id);

        void UpdateCar(Car car);
        void DeleteCar(Car car);

    }
}
