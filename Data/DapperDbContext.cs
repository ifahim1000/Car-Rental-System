using Dapper;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;

namespace Car_Rental_System.Data
{
    public class DapperDbContext : IDapperDbContext
    {
        private readonly IDatabaseConnection _db;
        private SqlCommand _command = null;
        public DapperDbContext(IDatabaseConnection db)
        {
            _db = db;
        }
        public IEnumerable<T> QueryData<T>(string storedProcedureName)
        {
            return QueryData<T>(storedProcedureName, null);
        }

        public IEnumerable<T> QueryData<T>(string storedProcedureName, DynamicParameters parameters)
        {
            using (var _connection = _db.CreateConnection())
            {
                var result = _connection.Query<T>(
                    storedProcedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result;
            }
        }

        public T GetInfoById<T>(string storedProcedureName, DynamicParameters parameters) where T : class
        {
            using (var _connection = _db.CreateConnection())
            {
                var result = _connection.QueryFirstOrDefault<T>(
                    storedProcedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result;
            }
        }

        public void ModifyData(string storedProcedureName, DynamicParameters parameters)
        {
            using (var _connection = _db.CreateConnection())
            {
                   _connection.Execute(
                    storedProcedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

              
            }
        }

        public T CheckExists<T, P>(string storedProcedureName, DynamicParameters parameters)
        {
            using (var _connection = _db.CreateConnection())
            {
                return _connection.ExecuteScalar<T>(
                 storedProcedureName,
                 parameters,
                 commandType: CommandType.StoredProcedure
             );


            }
           
        }

    }
}
