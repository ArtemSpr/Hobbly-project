using MongoDB.Driver;
using MongoDbApp.Models;

namespace MongoDbApp.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(string connectionString, string dbName)
        {
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(dbName);
        }

        public IMongoCollection<User> Users =>
            _database.GetCollection<User>("Users");
    }
}
