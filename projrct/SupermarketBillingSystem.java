import java.util.ArrayList;
import java.util.Scanner;

class Product {
    String name;
    int quantity;
    double price;

    Product(String name, int quantity, double price) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    double getTotal() {
        return quantity * price;
    }
}

public class SupermarketBillingSystem {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ArrayList<Product> productList = new ArrayList<>();

        System.out.println("Welcome to the Supermarket Billing System!");
        String choice;

        
        do {
            System.out.print("Enter product name: ");
            String name = scanner.nextLine();

            System.out.print("Enter quantity: ");
            int quantity = Integer.parseInt(scanner.nextLine());

            System.out.print("Enter price per unit: ₹");
            double price = Double.parseDouble(scanner.nextLine());

            productList.add(new Product(name, quantity, price));

            System.out.print("Do you want to enter another product? (yes/no): ");
            choice = scanner.nextLine().trim().toLowerCase();
        } while (choice.equals("yes"));

        double subtotal = 0.0;

    
        
        System.out.printf("%-20s %-10s %-10s %-10s\n", "Product", "Qty", "Price", "Total");
        

    
        for (Product p : productList) {
            double total = p.getTotal();
            subtotal += total;
            System.out.printf("%-20s %-10d ₹%-9.2f ₹%-9.2f\n", p.name, p.quantity, p.price, total);
        }

        double gst = subtotal * 0.18;
        double totalWithGst = subtotal + gst;
        double discount = 0;

        if (totalWithGst > 2000) {
            discount = totalWithGst * 0.10;
        }

        double finalAmount = totalWithGst - discount;

        
        System.out.println("--------------------------------------------------------------");
        System.out.printf("%-42s ₹%-9.2f\n", "Subtotal:", subtotal);
        System.out.printf("%-42s ₹%-9.2f\n", "GST @18%:", gst);
        System.out.printf("%-42s ₹%-9.2f\n", "Discount:", discount);
        System.out.printf("%-42s ₹%-9.2f\n", "Final Amount:", finalAmount);
        System.out.println("--------------------------------------------------------------");
        System.out.println("Thank you for shopping with us!");
    }
}
