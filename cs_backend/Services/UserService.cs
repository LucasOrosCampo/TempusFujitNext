using cs_backend.Controllers;
using cs_backend.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace cs_backend.Services
{
    public class UserService(IDbContextFactory<MyDbContext> dbFactory)
    {
        static int saltSize = 16;
        static int keySize = 32;
        static int iterations = 10000;
       public async Task<bool> Register(UserAuthenticationData registerUser)
        {
            if (!registerUser.IsValid()) return false; 
            
            var hashedPassword = Hash(registerUser.Password);
            using var db = dbFactory.CreateDbContext();

            if (db.Users.Any(x => x.UserName == registerUser.UserName)) return false;

            db.Users.Add(new() { UserName = registerUser.UserName, HashedPassword = hashedPassword.encodedHash });
            db.SaveChanges();
            return true;
        }

        public async Task<bool> LogIn(UserAuthenticationData loginUser)
        {
            if (!loginUser.IsValid()) return false;

            using var db = dbFactory.CreateDbContext();
            var expectedHashedPasswordAsB64 = db.Users.FirstOrDefault(x => x.UserName == loginUser.UserName)?.HashedPassword;
            if (expectedHashedPasswordAsB64 == null) return false;

            var userHash = Convert.FromBase64String(expectedHashedPasswordAsB64);

            byte[] salt = new byte[saltSize];
            Array.Copy(userHash, 0, salt, 0, saltSize);

            var hash = Hash(loginUser.Password, salt);

            var expectedKeyHash = new byte[keySize];
            Array.Copy(userHash, saltSize, expectedKeyHash, 0, keySize);

            return CryptographicOperations.FixedTimeEquals(expectedKeyHash, hash.keyHash);

        }

        private static (string encodedHash, byte[] keyHash) Hash(string password, byte[]? salt = null)
        {
            if (salt == null)
            {
                using var saltGenerator =  RandomNumberGenerator.Create();
                salt = new byte[saltSize];
                saltGenerator.GetBytes(salt);
            }

            using var keyGenerator = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
            byte[] keyHash = keyGenerator.GetBytes(keySize);

            byte[] hash = new byte[saltSize + keySize];
            Array.Copy(salt, 0, hash, 0, saltSize);
            Array.Copy(keyHash, 0, hash, saltSize, keySize);

            return (Convert.ToBase64String(hash), keyHash);
        }
    }
}
