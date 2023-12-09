using Car_Rental_System.Models;

namespace Car_Rental_System.ViewModel
{
    public class RidesViewModel
    {
        public List<Booking>? AllBooking { get; set; }

        public List<Booking>? MyBooking { get; set; }
    }
}
