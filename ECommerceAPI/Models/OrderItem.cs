namespace ECommerceAPI.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        public decimal Price { get; set; }  // ✅ Each item’s price at order time

        // Navigation properties should not be bound from incoming JSON — ignore during serialization/deserialization
        [System.Text.Json.Serialization.JsonIgnore]
        public Order? Order { get; set; }   // navigation

        [System.Text.Json.Serialization.JsonIgnore]
        public Product? Product { get; set; }
    }
}
