using Car_Rental_System.Models;
using Car_Rental_System.ViewModel;

namespace Car_Rental_System.Data
{
    public interface IUserRepository
    {
        void InsertUser(User user);
        Tuple<int,int> CheckUser(User user);
        User GetUserInfoById(int id);
        bool IsUserNameAvailable(string UserName);

    }
}
