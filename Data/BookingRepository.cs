using Car_Rental_System.Models;
using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace Car_Rental_System.Data
{
    public class BookingRepository: IBookingRepository
    {
        private readonly IVehicleRepository _vehicle;
        private readonly IUserRepository _user;
        private readonly IDapperDbContext _dapper;
        private SqlCommand _command = null;
        public BookingRepository(IVehicleRepository vehicle, IUserRepository user, IDapperDbContext dapper)
        {
            _vehicle = vehicle;
            _user = user;
            _dapper = dapper;
        }

        public void InsertBooking(Booking book,List<int> bookedCarsId)
        {
            
            DataTable carsTable = new DataTable();
            carsTable.Columns.Add("CarId", typeof(int));

            foreach (var item in bookedCarsId)
            {
                carsTable.Rows.Add(item);
            }
            
            var parameters = new DynamicParameters();
            parameters.Add("@UserId", book.UserId);
            parameters.Add("@VehicleId", book.VehicleId);
            parameters.Add("@StartDate", book.StartDate);
            parameters.Add("@EndDate", book.EndDate);
            parameters.Add("@VehicleQuantity", book.VehicleQuantity);
            parameters.Add("@Cars", carsTable.AsTableValuedParameter("dbo.BookedCarType"));
            _dapper.ModifyData("spInsertBooking", parameters);
        }

        
        public List<Booking> GetAllBookings()
        {
            var parameters = new DynamicParameters();
            var allBookings = _dapper.QueryData<Booking>("spGetAllBookings", parameters);
            return allBookings.ToList();
        }

        public void DeleteBooking(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@booked_id", id);
            _dapper.ModifyData("spDeleteBooking", parameters);

        }

        public List<Booking> GetParticularUserBookings(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("user_id", id);
            var myBookings = _dapper.QueryData<Booking>("spGetParticularUserBookings", parameters);
            return myBookings.ToList();
        }

        public List<Car> GetBookedCars(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BookingId", id);
            var bookedCars = _dapper.QueryData<Car>("spGetBookedCars",parameters);
            return bookedCars.ToList();
        }
        
        public void ReturnBooking(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@booked_id", id);
            _dapper.ModifyData("spReturnBooking", parameters);
        }
    }
}
