using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ECommerceAPI.Data;
using ECommerceAPI.Models;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CheckoutController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpPost("{customerName}")]
        public async Task<ActionResult<Order>> Checkout(string customerName)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var cartItems = await _context.CartItems.Include(c => c.Product).Where(c => c.Cart != null && c.Cart.UserId == userId).ToListAsync();
            if (cartItems == null || !cartItems.Any())
                return BadRequest("Cart is empty!");

            var order = new Order
            {
                CustomerName = customerName,
                UserId = userId,
                Items = cartItems.Select(c => new OrderItem
                {
                    ProductId = c.ProductId,
                    Quantity = c.Quantity
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Checkout successful!", Order = order });
        }
    }
}
