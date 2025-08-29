using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using MongoDbApp.Services;
using MongoDbApp.Models;

class Program
{
    static void Main(string[] args)
    {
        // Load configuration from appsettings.json
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        var connectionString = config["MongoDbSettings:ConnectionString"];
        var dbName = config["MongoDbSettings:DatabaseName"];

        if (string.IsNullOrEmpty(connectionString) || string.IsNullOrEmpty(dbName))
        {
            throw new InvalidOperationException("MongoDB connection settings are missing in appsettings.json");
        }

        var dbService = new MongoDbService(connectionString, dbName);


        // Insert a new user
        var newUser = new User { Name = "Leonardo", Email = "leo@example.com" };
        dbService.Users.InsertOne(newUser);

        Console.WriteLine("Inserted user with ID: " + newUser.Id);

        // Read all users
        var users = dbService.Users.Find(_ => true).ToList();

        Console.WriteLine("Users in database:");
        foreach (var user in users)
        {
            Console.WriteLine($"{user.Id} - {user.Name} - {user.Email}");
        }
    }
}
