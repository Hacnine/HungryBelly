import { PrismaClient } from "@prisma/client"
import bcryptjs from "bcryptjs"

const prisma = new PrismaClient()

async function seed() {
  try {
    console.log("Seeding database...")

    // Clear existing data
    await prisma.coupon.deleteMany()
    await prisma.order.deleteMany()
    await prisma.menu.deleteMany()
    await prisma.foodItem.deleteMany()
    await prisma.driver.deleteMany()
    await prisma.user.deleteMany()

    // Create admin user
    const adminPassword = await bcryptjs.hash("admin123", 10)
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@fooddelivery.com",
        password: adminPassword,
        role: "admin",
      },
    })
    console.log("Created admin user:", admin.email)

    // Create test user
    const userPassword = await bcryptjs.hash("user123", 10)
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "user@fooddelivery.com",
        password: userPassword,
        role: "user",
      },
    })
    console.log("Created test user:", user.email)

    // Create menu items
    const categories = ["Burgers", "Pizza", "Salads", "Desserts", "Drinks"]
    const menuItems = [
      { name: "Classic Burger", description: "Beef burger with cheese", price: 8.99, category: "Burgers" },
      { name: "Double Burger", description: "Double patty burger", price: 10.99, category: "Burgers" },
      { name: "Margherita Pizza", description: "Classic tomato and cheese", price: 12.99, category: "Pizza" },
      { name: "Pepperoni Pizza", description: "Pepperoni and cheese", price: 13.99, category: "Pizza" },
      { name: "Caesar Salad", description: "Fresh romaine and croutons", price: 7.99, category: "Salads" },
      { name: "Chocolate Cake", description: "Homemade chocolate cake", price: 5.99, category: "Desserts" },
      { name: "Coca Cola", description: "Cold soft drink", price: 2.49, category: "Drinks" },
    ]

    for (const item of menuItems) {
      await prisma.menu.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          available: true,
        },
      })
    }
    console.log("Created", menuItems.length, "menu items")

    // Create detailed food items with images
    const foodItems = [
      // Burgers
      {
        name: "Classic Beef Burger",
        description: "Juicy 100% Angus beef patty with fresh lettuce, tomatoes, pickles, onions, and our special sauce on a toasted sesame bun. A timeless favorite that never disappoints!",
        category: "Burgers",
        subcategory: "Beef",
        price: 12.99,
        discount: 0,
        ingredients: [
          { name: "Beef Patty", quantity: "200g" },
          { name: "Lettuce", quantity: "30g" },
          { name: "Tomato", quantity: "2 slices" },
          { name: "Pickles", quantity: "3 slices" },
          { name: "Onions", quantity: "20g" },
          { name: "Special Sauce", quantity: "2 tbsp" }
        ],
        nutrition: {
          calories: 650,
          protein: "35g",
          fat: "38g",
          carbs: "42g",
          sugar: "8g",
          fiber: "3g"
        },
        stock: 50,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        tags: ["Popular", "Beef", "Classic"],
        preparationTime: 15
      },
      {
        name: "Double Cheese Burger",
        description: "Two succulent beef patties stacked high with double cheddar cheese, crispy bacon, caramelized onions, and tangy BBQ sauce. Perfect for those with a hearty appetite!",
        category: "Burgers",
        subcategory: "Beef",
        price: 16.99,
        discount: 10,
        ingredients: [
          { name: "Beef Patty", quantity: "400g" },
          { name: "Cheddar Cheese", quantity: "4 slices" },
          { name: "Bacon", quantity: "4 strips" },
          { name: "Caramelized Onions", quantity: "40g" },
          { name: "BBQ Sauce", quantity: "3 tbsp" }
        ],
        nutrition: {
          calories: 980,
          protein: "58g",
          fat: "62g",
          carbs: "48g",
          sugar: "12g",
          fiber: "2g"
        },
        stock: 35,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
        tags: ["Premium", "Beef", "Cheese"],
        preparationTime: 18
      },
      {
        name: "Chicken Avocado Burger",
        description: "Grilled chicken breast topped with creamy avocado, crispy bacon, Swiss cheese, and garlic aioli on a brioche bun. A healthier yet indulgent option!",
        category: "Burgers",
        subcategory: "Chicken",
        price: 14.99,
        discount: 5,
        ingredients: [
          { name: "Chicken Breast", quantity: "180g" },
          { name: "Avocado", quantity: "1/2 piece" },
          { name: "Swiss Cheese", quantity: "2 slices" },
          { name: "Bacon", quantity: "2 strips" },
          { name: "Garlic Aioli", quantity: "2 tbsp" }
        ],
        nutrition: {
          calories: 720,
          protein: "42g",
          fat: "38g",
          carbs: "45g",
          sugar: "6g",
          fiber: "5g"
        },
        stock: 40,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80",
        tags: ["Healthy", "Chicken", "Avocado"],
        preparationTime: 16
      },
      // Pizzas
      {
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh mozzarella, San Marzano tomato sauce, fresh basil, and extra virgin olive oil. Simple perfection on a wood-fired crust!",
        category: "Pizza",
        subcategory: "Vegetarian",
        price: 14.99,
        discount: 0,
        ingredients: [
          { name: "Pizza Dough", quantity: "300g" },
          { name: "Mozzarella", quantity: "200g" },
          { name: "Tomato Sauce", quantity: "150ml" },
          { name: "Fresh Basil", quantity: "10g" },
          { name: "Olive Oil", quantity: "2 tbsp" }
        ],
        nutrition: {
          calories: 820,
          protein: "32g",
          fat: "28g",
          carbs: "98g",
          sugar: "8g",
          fiber: "4g"
        },
        stock: 60,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
        tags: ["Classic", "Vegetarian", "Italian"],
        preparationTime: 20
      },
      {
        name: "Pepperoni Supreme Pizza",
        description: "Loaded with premium pepperoni, Italian sausage, bell peppers, mushrooms, onions, and a blend of mozzarella and cheddar cheese. The ultimate meat lover's dream!",
        category: "Pizza",
        subcategory: "Meat",
        price: 18.99,
        discount: 15,
        ingredients: [
          { name: "Pizza Dough", quantity: "300g" },
          { name: "Pepperoni", quantity: "100g" },
          { name: "Italian Sausage", quantity: "80g" },
          { name: "Mozzarella", quantity: "150g" },
          { name: "Bell Peppers", quantity: "50g" },
          { name: "Mushrooms", quantity: "50g" }
        ],
        nutrition: {
          calories: 1150,
          protein: "48g",
          fat: "54g",
          carbs: "102g",
          sugar: "10g",
          fiber: "5g"
        },
        stock: 45,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
        tags: ["Best Seller", "Meat", "Spicy"],
        preparationTime: 22
      },
      {
        name: "BBQ Chicken Pizza",
        description: "Grilled chicken breast, red onions, cilantro, and a smoky BBQ sauce base topped with melted cheddar and mozzarella. A unique twist on traditional pizza!",
        category: "Pizza",
        subcategory: "Chicken",
        price: 16.99,
        discount: 0,
        ingredients: [
          { name: "Pizza Dough", quantity: "300g" },
          { name: "Grilled Chicken", quantity: "150g" },
          { name: "BBQ Sauce", quantity: "100ml" },
          { name: "Red Onions", quantity: "40g" },
          { name: "Cilantro", quantity: "10g" },
          { name: "Cheddar Cheese", quantity: "100g" }
        ],
        nutrition: {
          calories: 950,
          protein: "52g",
          fat: "32g",
          carbs: "98g",
          sugar: "18g",
          fiber: "4g"
        },
        stock: 40,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
        tags: ["Popular", "Chicken", "BBQ"],
        preparationTime: 20
      },
      // Salads
      {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce tossed in our homemade Caesar dressing, topped with parmesan cheese, garlic croutons, and a hint of lemon. Light yet satisfying!",
        category: "Salads",
        subcategory: "Classic",
        price: 9.99,
        discount: 0,
        ingredients: [
          { name: "Romaine Lettuce", quantity: "200g" },
          { name: "Caesar Dressing", quantity: "50ml" },
          { name: "Parmesan Cheese", quantity: "30g" },
          { name: "Croutons", quantity: "40g" },
          { name: "Lemon", quantity: "1 wedge" }
        ],
        nutrition: {
          calories: 380,
          protein: "12g",
          fat: "28g",
          carbs: "22g",
          sugar: "4g",
          fiber: "4g"
        },
        stock: 55,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
        tags: ["Healthy", "Vegetarian", "Light"],
        preparationTime: 10
      },
      {
        name: "Greek Salad",
        description: "Fresh cucumber, tomatoes, red onions, kalamata olives, and feta cheese drizzled with olive oil and oregano. A Mediterranean delight!",
        category: "Salads",
        subcategory: "Mediterranean",
        price: 11.99,
        discount: 0,
        ingredients: [
          { name: "Cucumber", quantity: "100g" },
          { name: "Tomatoes", quantity: "150g" },
          { name: "Red Onions", quantity: "30g" },
          { name: "Feta Cheese", quantity: "80g" },
          { name: "Kalamata Olives", quantity: "40g" },
          { name: "Olive Oil", quantity: "2 tbsp" }
        ],
        nutrition: {
          calories: 320,
          protein: "10g",
          fat: "24g",
          carbs: "18g",
          sugar: "8g",
          fiber: "4g"
        },
        stock: 50,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
        tags: ["Healthy", "Mediterranean", "Fresh"],
        preparationTime: 8
      },
      {
        name: "Grilled Chicken Salad",
        description: "Tender grilled chicken breast on mixed greens with cherry tomatoes, avocado, corn, and honey mustard dressing. Protein-packed and delicious!",
        category: "Salads",
        subcategory: "Protein",
        price: 13.99,
        discount: 10,
        ingredients: [
          { name: "Grilled Chicken", quantity: "150g" },
          { name: "Mixed Greens", quantity: "150g" },
          { name: "Cherry Tomatoes", quantity: "80g" },
          { name: "Avocado", quantity: "1/2 piece" },
          { name: "Corn", quantity: "50g" },
          { name: "Honey Mustard", quantity: "40ml" }
        ],
        nutrition: {
          calories: 450,
          protein: "38g",
          fat: "22g",
          carbs: "28g",
          sugar: "10g",
          fiber: "8g"
        },
        stock: 40,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        tags: ["Healthy", "High Protein", "Chicken"],
        preparationTime: 12
      },
      // Desserts
      {
        name: "Chocolate Lava Cake",
        description: "Decadent molten chocolate cake with a gooey chocolate center, served warm with vanilla ice cream. Pure chocolate heaven!",
        category: "Desserts",
        subcategory: "Chocolate",
        price: 7.99,
        discount: 0,
        ingredients: [
          { name: "Dark Chocolate", quantity: "100g" },
          { name: "Butter", quantity: "60g" },
          { name: "Eggs", quantity: "2 pieces" },
          { name: "Flour", quantity: "30g" },
          { name: "Sugar", quantity: "50g" },
          { name: "Vanilla Ice Cream", quantity: "1 scoop" }
        ],
        nutrition: {
          calories: 520,
          protein: "8g",
          fat: "32g",
          carbs: "52g",
          sugar: "38g",
          fiber: "3g"
        },
        stock: 30,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
        tags: ["Popular", "Chocolate", "Warm"],
        preparationTime: 15
      },
      {
        name: "New York Cheesecake",
        description: "Classic creamy cheesecake with a graham cracker crust, topped with fresh strawberry sauce. Rich, smooth, and utterly indulgent!",
        category: "Desserts",
        subcategory: "Cake",
        price: 6.99,
        discount: 0,
        ingredients: [
          { name: "Cream Cheese", quantity: "200g" },
          { name: "Graham Crackers", quantity: "80g" },
          { name: "Sugar", quantity: "60g" },
          { name: "Eggs", quantity: "2 pieces" },
          { name: "Strawberry Sauce", quantity: "50ml" }
        ],
        nutrition: {
          calories: 450,
          protein: "8g",
          fat: "28g",
          carbs: "42g",
          sugar: "32g",
          fiber: "1g"
        },
        stock: 25,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=800&q=80",
        tags: ["Classic", "Creamy", "Sweet"],
        preparationTime: 10
      },
      {
        name: "Tiramisu",
        description: "Authentic Italian dessert with espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa. A coffee lover's paradise!",
        category: "Desserts",
        subcategory: "Italian",
        price: 8.99,
        discount: 5,
        ingredients: [
          { name: "Ladyfingers", quantity: "150g" },
          { name: "Mascarpone", quantity: "250g" },
          { name: "Espresso", quantity: "100ml" },
          { name: "Cocoa Powder", quantity: "20g" },
          { name: "Sugar", quantity: "40g" }
        ],
        nutrition: {
          calories: 420,
          protein: "10g",
          fat: "24g",
          carbs: "42g",
          sugar: "28g",
          fiber: "2g"
        },
        stock: 20,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
        tags: ["Italian", "Coffee", "Elegant"],
        preparationTime: 12
      },
      // Drinks
      {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed oranges packed with vitamin C. No added sugar, just pure natural goodness!",
        category: "Drinks",
        subcategory: "Fresh Juice",
        price: 4.99,
        discount: 0,
        ingredients: [
          { name: "Fresh Oranges", quantity: "4 pieces" }
        ],
        nutrition: {
          calories: 120,
          protein: "2g",
          fat: "0g",
          carbs: "28g",
          sugar: "22g",
          fiber: "0g"
        },
        stock: 100,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
        tags: ["Healthy", "Fresh", "Vitamin C"],
        preparationTime: 5
      },
      {
        name: "Mango Smoothie",
        description: "Creamy blend of fresh mangoes, yogurt, and honey. Tropical, refreshing, and naturally sweet!",
        category: "Drinks",
        subcategory: "Smoothie",
        price: 5.99,
        discount: 0,
        ingredients: [
          { name: "Fresh Mango", quantity: "200g" },
          { name: "Greek Yogurt", quantity: "100ml" },
          { name: "Honey", quantity: "1 tbsp" },
          { name: "Ice", quantity: "100g" }
        ],
        nutrition: {
          calories: 180,
          protein: "6g",
          fat: "2g",
          carbs: "38g",
          sugar: "32g",
          fiber: "3g"
        },
        stock: 80,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80",
        tags: ["Healthy", "Smoothie", "Tropical"],
        preparationTime: 5
      },
      {
        name: "Iced Caramel Latte",
        description: "Rich espresso combined with cold milk and sweet caramel syrup, served over ice. The perfect pick-me-up!",
        category: "Drinks",
        subcategory: "Coffee",
        price: 5.49,
        discount: 0,
        ingredients: [
          { name: "Espresso", quantity: "60ml" },
          { name: "Milk", quantity: "200ml" },
          { name: "Caramel Syrup", quantity: "30ml" },
          { name: "Ice", quantity: "150g" }
        ],
        nutrition: {
          calories: 220,
          protein: "8g",
          fat: "6g",
          carbs: "34g",
          sugar: "28g",
          fiber: "0g"
        },
        stock: 90,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
        tags: ["Coffee", "Cold", "Sweet"],
        preparationTime: 7
      },
      {
        name: "Lemonade",
        description: "Classic homemade lemonade with fresh lemons, mint, and just the right amount of sweetness. Perfect for hot days!",
        category: "Drinks",
        subcategory: "Cold Drinks",
        price: 3.99,
        discount: 0,
        ingredients: [
          { name: "Fresh Lemons", quantity: "3 pieces" },
          { name: "Sugar", quantity: "50g" },
          { name: "Water", quantity: "500ml" },
          { name: "Mint", quantity: "5g" },
          { name: "Ice", quantity: "100g" }
        ],
        nutrition: {
          calories: 150,
          protein: "0g",
          fat: "0g",
          carbs: "38g",
          sugar: "35g",
          fiber: "0g"
        },
        stock: 120,
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f6c?w=800&q=80",
        tags: ["Refreshing", "Cold", "Citrus"],
        preparationTime: 5
      }
    ];

    // Get admin user ID for createdBy field
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@fooddelivery.com" }
    });

    for (const item of foodItems) {
      await prisma.foodItem.create({
        data: {
          ...item,
          createdBy: adminUser.id,
          shop: null
        }
      });
    }
    console.log("Created", foodItems.length, "food items with detailed information")

    // Create drivers
    const drivers = [
      {
        name: "John Driver",
        email: "john@drivers.com",
        phone: "555-0001",
        vehicle: "Honda Civic",
        licensePlate: "ABC123",
      },
      {
        name: "Jane Driver",
        email: "jane@drivers.com",
        phone: "555-0002",
        vehicle: "Toyota Prius",
        licensePlate: "XYZ789",
      },
    ]

    for (const driver of drivers) {
      await prisma.driver.create({
        data: {
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          vehicle: driver.vehicle,
          licensePlate: driver.licensePlate,
          available: true,
        },
      })
    }
    console.log("Created", drivers.length, "drivers")

    // Create coupons
    const coupons = [
      {
        code: "WELCOME10",
        description: "10% off for new users",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 15,
      },
      {
        code: "SAVE15",
        description: "15% off on orders over $50",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderValue: 50,
      },
      { code: "FLAT5", description: "$5 off your order", discountType: "FIXED", discountValue: 5, minOrderValue: 20 },
    ]

    for (const coupon of coupons) {
      await prisma.coupon.create({
        data: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderValue: coupon.minOrderValue,
          maxUses: 100,
          active: true,
        },
      })
    }
    console.log("Created", coupons.length, "coupons")

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
