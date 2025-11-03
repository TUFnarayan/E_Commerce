namespace ECommerceAPI.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.Now;

        public decimal TotalAmount { get; set; }   // ✅ Added for order summary

        public List<OrderItem> Items { get; set; } = new List<OrderItem>(); // ✅ Avoid null refs
    }
}
