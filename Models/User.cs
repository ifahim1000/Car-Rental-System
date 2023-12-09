using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Car_Rental_System.Models
{
    public class User
    {
        public int UserId { get; set; }

        public int UserType { get; set; }

        [Required]
        [DisplayName("User Name")]
        public string UserName { get; set; }

        [Required]
        [DisplayName("Password")]
        public string UserPassword { get; set; }

        [DisplayName("Mobile Number")]
        public string? MobileNumber { get; set; }


    }
}
