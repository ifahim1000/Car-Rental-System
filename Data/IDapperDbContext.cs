using Dapper;

namespace Car_Rental_System.Data
{
    public interface IDapperDbContext
    {
        IEnumerable<T> QueryData<T>(string storedProcedureName, DynamicParameters parameters = null);
        T GetInfoById<T>(string storedProcedureName, DynamicParameters parameters) where T : class;
        void ModifyData(string storedProcedureName, DynamicParameters parameters);
        T CheckExists<T, P>(string storedProcedureName, DynamicParameters parameters);
    }
}
