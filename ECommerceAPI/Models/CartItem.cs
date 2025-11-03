namespace ECommerceAPI.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        // ✅ Add this to link the item to a specific cart
        public int CartId { get; set; }
        public Cart? Cart { get; set; }

        // ✅ Allow Product to be nullable to avoid warnings
        public Product? Product { get; set; }
    }
}
