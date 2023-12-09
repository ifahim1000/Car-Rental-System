using Car_Rental_System.Models;
using Car_Rental_System.ViewModel;
using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace Car_Rental_System.Data
{
    public class UserRepository: IUserRepository
    {
        private readonly IDatabaseConnection _db;
        private readonly IDapperDbContext _dapper;
        private SqlCommand _command = null;
        
        public UserRepository(IDapperDbContext dapper,IDatabaseConnection db)
        {
            _dapper = dapper;
            _db = db;
        }

        public void InsertUser(User user)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_name", user.UserName);
            parameters.Add("@mobile_number", user.MobileNumber);
            parameters.Add("@user_password", user.UserPassword);
            _dapper.ModifyData("spInsertUser", parameters);

        }

        public Tuple<int,int> CheckUser(User user)
        {
            Tuple <int,int> userIdWithType = Tuple.Create(0,0);
            var parameters = new DynamicParameters();
            parameters.Add("@user_name", user.UserName);
            parameters.Add("@user_password", user.UserPassword);
            var verifyUser= (User)_dapper.GetInfoById<User>("spCheckUser", parameters);
            userIdWithType = new Tuple<int, int>(verifyUser.UserId, verifyUser.UserType);

            return userIdWithType;
        }
        public User GetUserInfoById(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", id);
            return (User)_dapper.GetInfoById<User>("spGetUserInfoById", parameters); ;
        }

        public bool IsUserNameAvailable(string UserName)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_name", UserName);
            var result = _dapper.CheckExists<int,dynamic>("spCheckUserName",parameters);
            return result >0;
        }
    }
}
