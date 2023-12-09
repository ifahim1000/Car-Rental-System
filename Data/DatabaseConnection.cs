using System.Data;
using System.Data.SqlClient;

namespace Car_Rental_System.Data
{
    public class DatabaseConnection : IDatabaseConnection
    {
        private readonly IConfiguration _configuration;
        public DatabaseConnection(IConfiguration configuration)
        { 
            _configuration = configuration;
        }
        public string GetDbConnection()
        {
            return _configuration.GetConnectionString("DefaultConnection");

        }

        public IDbConnection CreateConnection()
        {
            return new SqlConnection(GetDbConnection());
        }
       
    }
       
}
