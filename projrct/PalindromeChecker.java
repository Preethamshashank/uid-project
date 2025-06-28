import java.util.Scanner;

public class            0 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter a number: ");
        int original = scanner.nextInt();
        int number = original;
        int reversed = 0;

        while (number != 0) {
            int digit = number % 10;           // get last digit
            reversed = reversed * 10 + digit;  // build reversed number
            number /= 10;                      // remove last digit
        }

        if (original == reversed) {
            System.out.println(original + " is a palindrome.");
        } else {
            System.out.println(original + " is not a palindrome.");
        }
    }
}
