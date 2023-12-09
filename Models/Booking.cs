using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace Car_Rental_System.Models
{
    public class Booking
    {
        public int BookingId {  get; set; }

        public int UserId { get; set; }

        public string UserName { get; set; }

        public int VehicleId {  get; set; }


        [DisplayName("Car Model")]
        public string VehicleModelName { get; set; }

        public string CategoryType { get; set; }

        public string BrandName { get; set; }

        public int VehicleCapacity { get; set; }

        [DisplayName("Pick Up Date")]
        //[DataType(DataType.Date)]
        public DateTime StartDate { get; set; } = DateTime.Now.Date;

        [DisplayName("Drop Off Date")]
        //[DataType(DataType.Date)]
        public DateTime EndDate { get; set; } = DateTime.Now.Date;

        [DisplayName("Booked Vehicles")]
        public int VehicleQuantity { get; set; }


    }
}
