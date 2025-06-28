class AreaCalculator {

    
    public int area(int side) {
        return side * side;
    }

    
    public int area(int length, int breadth) {
        return length * breadth;
    }

    
    public double area(double radius) {
        return Math.PI * radius * radius;
    }
}

public class AreaDemo {
    public static void main(String[] args) {
        AreaCalculator calculator = new AreaCalculator();

        int squareArea = calculator.area(5); 
        int rectangleArea = calculator.area(4, 6);
        double circleArea = calculator.area(3.5); 

        System.out.println("Area of Square (side 5): " + squareArea);
        System.out.println("Area of Rectangle (4 x 6): " + rectangleArea);
        System.out.printf("Area of Circle (radius 3.5): %.2f\n", circleArea);
    }
}
