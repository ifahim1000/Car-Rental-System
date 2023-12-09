using System.Data;

namespace Car_Rental_System.Data
{
    public interface IDatabaseConnection
    {
        string GetDbConnection();
        IDbConnection CreateConnection();
    }
}
