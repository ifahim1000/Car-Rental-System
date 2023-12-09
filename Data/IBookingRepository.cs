using Car_Rental_System.Models;

namespace Car_Rental_System.Data
{
    public interface IBookingRepository
    {
        void InsertBooking(Booking book, List<int> bookedCarsId);
        List<Booking> GetAllBookings();
        void DeleteBooking(int id);
        List<Booking> GetParticularUserBookings(int id);

        List<Car> GetBookedCars(int id);
        void ReturnBooking(int id);


    }
}
