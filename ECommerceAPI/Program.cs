using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ECommerceAPI.Data;
using ECommerceAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ECommerceAPI.Configuration;
using ECommerceAPI.Services;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT options from configuration
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

// ASP.NET Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Configure password/lockout options here if desired
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// JwtService
builder.Services.AddScoped<IJwtService, JwtService>();

// Authentication with JwtBearer
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ECommerce API",
        Version = "v1",
        Description = "A simple E-Commerce API built with ASP.NET Core and SQL Server"
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new Product
            {
                Name = "Classic White T-Shirt",
                Description = "Comfortable cotton t-shirt, unisex.",
                Price = 399.00m,
                ImageUrl = "https://via.placeholder.com/300x300.png?text=Classic+White+T-Shirt"
            },
            new Product
            {
                Name = "Minimalist Sneakers",
                Description = "Lightweight sneakers for daily wear.",
                Price = 2499.00m,
                ImageUrl = "https://via.placeholder.com/300x300.png?text=Minimalist+Sneakers"
            },
            new Product
            {
                Name = "Wireless Headphones",
                Description = "Noise-cancelling, long battery life.",
                Price = 4599.00m,
                ImageUrl = "https://via.placeholder.com/300x300.png?text=Wireless+Headphones"
            }
        );

        db.SaveChanges();
        Console.WriteLine("Seeded sample products into database.");
    }

    var imageMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        ["Classic White T-Shirt"] = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
        ["Minimalist Sneakers"] = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        ["Wireless Headphones"] = "https://images.unsplash.com/photo-1518444022172-9f9f5d7b0b7e?auto=format&fit=crop&w=600&q=80",
        ["iPhone 16"] = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
        ["iPhone 16 Pro"] = "https://images.unsplash.com/photo-1510552776732-01acc7a4f4f6?auto=format&fit=crop&w=600&q=80"
    };

    var productsToUpdate = db.Products.Where(p => string.IsNullOrEmpty(p.ImageUrl)).ToList();
    if (productsToUpdate.Any())
    {
        foreach (var p in productsToUpdate)
        {
            if (imageMap.TryGetValue(p.Name, out var url))
                p.ImageUrl = url;
            else
                p.ImageUrl = "https://via.placeholder.com/300x300.png?text=Product";
        }
        db.SaveChanges();
        Console.WriteLine($"Updated {productsToUpdate.Count} product(s) with placeholder images.");
    }

    // Ensure Identity roles and an admin user exist
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    const string adminRole = "Admin";
    if (!roleManager.RoleExistsAsync(adminRole).GetAwaiter().GetResult())
    {
        roleManager.CreateAsync(new IdentityRole(adminRole)).GetAwaiter().GetResult();
        Console.WriteLine("Created role: Admin");
    }

    var adminUserName = builder.Configuration["AdminUser:UserName"] ?? "admin";
    var adminEmail = builder.Configuration["AdminUser:Email"] ?? "admin@local";
    var adminPassword = builder.Configuration["AdminUser:Password"] ?? "P@ssw0rd!";

    var adminUser = userManager.FindByNameAsync(adminUserName).GetAwaiter().GetResult();
    if (adminUser == null)
    {
        adminUser = new ApplicationUser { UserName = adminUserName, Email = adminEmail, EmailConfirmed = true };
        var createResult = userManager.CreateAsync(adminUser, adminPassword).GetAwaiter().GetResult();
        if (createResult.Succeeded)
        {
            userManager.AddToRoleAsync(adminUser, adminRole).GetAwaiter().GetResult();
            Console.WriteLine($"Created admin user '{adminUserName}' with default password. Change the password in production.");
        }
        else
        {
            Console.WriteLine("Failed to create admin user: " + string.Join(';', createResult.Errors.Select(e => e.Description)));
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
