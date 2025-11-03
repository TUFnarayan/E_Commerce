namespace ECommerceAPI.Models
{
    public class Cart
    {
        public int Id { get; set; }

        // Each cart can have multiple items
        public List<CartItem> Items { get; set; } = new List<CartItem>();

        // Optional: Link to a user (if you have authentication)
        public string? UserId { get; set; }

        // Total price (calculated server-side)
        public decimal TotalPrice { get; set; }
    }
}
