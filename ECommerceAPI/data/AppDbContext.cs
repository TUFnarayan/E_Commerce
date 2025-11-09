using Microsoft.EntityFrameworkCore;
using ECommerceAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ECommerceAPI.Data
{
    // Use IdentityDbContext so ASP.NET Identity tables are created in the same DB
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}

