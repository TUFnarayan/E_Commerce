namespace ECommerceAPI.Dtos
{
    public class UpdateProductDto
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = "";
    }
}
