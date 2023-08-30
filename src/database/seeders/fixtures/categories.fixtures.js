const categoriesFixtures = [
  {
    categoryName: "Sofa",
    products: [
      {
        productName: "Product 1",
        productImage: "product-1.jpeg",
        description: "This is the description of product 1",
        mrp: 50,
      },
      {
        productName: "Product 2",
        productImage: "product-2.jpeg",
        description: "This is the description of product 2",
        mrp: 40,
      },
    ],
  },
  {
    categoryName: "Wardrobe",
    products: [
      {
        productName: "wardrobe 1",
        productImage: "wardrobe-1.jpeg",
        description: "This is the description of wardrobe 1",
        mrp: 45,
      },
    ],
  },
  {
    categoryName: "Kitchen",
    products: [
      {
        productName: "Jar",
        productImage:
          "jar.jpeg",
          description: "This is the description of jar 1",
        mrp: 30,
      },
    ],
  }
];

module.exports = categoriesFixtures;
