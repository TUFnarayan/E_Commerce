using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerceAPI.Data;
using ECommerceAPI.Models;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CheckoutController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Checkout endpoint
        [HttpPost("{customerName}")]
        public async Task<ActionResult<Order>> Checkout(string customerName)
        {
            // Get all items in the cart
            var cartItems = await _context.CartItems.Include(c => c.Product).ToListAsync();
            if (cartItems == null || !cartItems.Any())
                return BadRequest("Cart is empty!");

            // Create a new order
            var order = new Order
            {
                CustomerName = customerName,
                Items = cartItems.Select(c => new OrderItem
                {
                    ProductId = c.ProductId,
                    Quantity = c.Quantity
                }).ToList()
            };

            // Add order and clear cart
            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Checkout successful!", Order = order });
        }
    }
}
