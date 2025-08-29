using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MongoDbApp.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = string.Empty;

        [BsonElement("token")]
        public string? Token { get; set; }   // JWT or refresh token

        [BsonElement("isEmailConfirmed")]
        public bool IsEmailConfirmed { get; set; } = false;

        [BsonElement("role")]
        public string Role { get; set; } = "user"; // default role
    }
}
