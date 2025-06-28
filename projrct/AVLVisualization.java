import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Random;

public class AVLVisualization extends JFrame {
    private AVLTree avlTree;
    private TreePanel treePanel;
    private JTextField insertField;
    private JTextField deleteField;
    private JButton insertButton;
    private JButton deleteButton;
    private JButton randomButton;
    private JButton clearButton;

    public AVLVisualization() {
        super("AVL Tree Visualization");
        avlTree = new AVLTree();
        
        // Set up the main frame
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1000, 700);
        setLayout(new BorderLayout());
        
        // Create the tree visualization panel
        treePanel = new TreePanel(avlTree);
        add(treePanel, BorderLayout.CENTER);
        
        // Create control panel
        JPanel controlPanel = new JPanel(new GridLayout(1, 6));
        
        insertField = new JTextField();
        insertButton = new JButton("Insert");
        insertButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    int value = Integer.parseInt(insertField.getText());
                    avlTree.insert(value);
                    treePanel.repaint();
                    insertField.setText("");
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(AVLVisualization.this, 
                            "Please enter a valid integer", "Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        });
        
        deleteField = new JTextField();
        deleteButton = new JButton("Delete");
        deleteButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    int value = Integer.parseInt(deleteField.getText());
                    avlTree.delete(value);
                    treePanel.repaint();
                    deleteField.setText("");
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(AVLVisualization.this, 
                            "Please enter a valid integer", "Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        });
        
        randomButton = new JButton("Random 10");
        randomButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Random rand = new Random();
                for (int i = 0; i < 10; i++) {
                    int value = rand.nextInt(100);
                    avlTree.insert(value);
                }
                treePanel.repaint();
            }
        });
        
        clearButton = new JButton("Clear");
        clearButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                avlTree = new AVLTree();
                treePanel.setTree(avlTree);
                treePanel.repaint();
            }
        });
        
        controlPanel.add(new JLabel("Insert:"));
        controlPanel.add(insertField);
        controlPanel.add(insertButton);
        controlPanel.add(new JLabel("Delete:"));
        controlPanel.add(deleteField);
        controlPanel.add(deleteButton);
        controlPanel.add(randomButton);
        controlPanel.add(clearButton);
        
        add(controlPanel, BorderLayout.SOUTH);
        
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new AVLVisualization();
            }
        });
    }
}

class TreePanel extends JPanel {
    private AVLTree tree;
    
    public TreePanel(AVLTree tree) {
        this.tree = tree;
        setBackground(Color.WHITE);
    }
    
    public void setTree(AVLTree tree) {
        this.tree = tree;
    }
    
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        if (tree.getRoot() != null) {
            drawTree(g, tree.getRoot(), getWidth() / 2, 30, getWidth() / 4);
        }
    }
    
    private void drawTree(Graphics g, AVLTree.Node node, int x, int y, int xOffset) {
        // Draw the node
        g.setColor(Color.BLUE);
        g.fillOval(x - 15, y - 15, 30, 30);
        g.setColor(Color.WHITE);
        g.drawString(Integer.toString(node.value), x - 5, y + 5);
        
        // Draw balance factor
        g.setColor(Color.RED);
        g.drawString(Integer.toString(node.height), x - 5, y + 25);
        
        // Draw left child
        if (node.left != null) {
            g.setColor(Color.BLACK);
            g.drawLine(x, y + 15, x - xOffset, y + 50);
            drawTree(g, node.left, x - xOffset, y + 50, xOffset / 2);
        }
        
        // Draw right child
        if (node.right != null) {
            g.setColor(Color.BLACK);
            g.drawLine(x, y + 15, x + xOffset, y + 50);
            drawTree(g, node.right, x + xOffset, y + 50, xOffset / 2);
        }
    }
}

class AVLTree {
    class Node {
        int value;
        Node left;
        Node right;
        int height;
        
        Node(int value) {
            this.value = value;
            this.height = 1;
        }
    }
    
    private Node root;
    
    public Node getRoot() {
        return root;
    }
    
    public void insert(int value) {
        root = insert(root, value);
    }
    
    private Node insert(Node node, int value) {
        if (node == null) {
            return new Node(value);
        }
        
        if (value < node.value) {
            node.left = insert(node.left, value);
        } else if (value > node.value) {
            node.right = insert(node.right, value);
        } else {
            return node; // Duplicate values not allowed
        }
        
        // Update height
        node.height = 1 + Math.max(height(node.left), height(node.right));
        
        // Check balance factor and perform rotations if needed
        int balance = getBalance(node);
        
        // Left Left Case
        if (balance > 1 && value < node.left.value) {
            return rightRotate(node);
        }
        
        // Right Right Case
        if (balance < -1 && value > node.right.value) {
            return leftRotate(node);
        }
        
        // Left Right Case
        if (balance > 1 && value > node.left.value) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }
        
        // Right Left Case
        if (balance < -1 && value < node.right.value) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }
        
        return node;
    }
    
    public void delete(int value) {
        root = delete(root, value);
    }
    
    private Node delete(Node node, int value) {
        if (node == null) {
            return node;
        }
        
        if (value < node.value) {
            node.left = delete(node.left, value);
        } else if (value > node.value) {
            node.right = delete(node.right, value);
        } else {
            // Node with only one child or no child
            if (node.left == null || node.right == null) {
                Node temp = null;
                if (temp == node.left) {
                    temp = node.right;
                } else {
                    temp = node.left;
                }
                
                // No child case
                if (temp == null) {
                    temp = node;
                    node = null;
                } else { // One child case
                    node = temp; // Copy the contents of the non-empty child
                }
            } else {
                // Node with two children: Get the inorder successor
                Node temp = minValueNode(node.right);
                
                // Copy the inorder successor's data to this node
                node.value = temp.value;
                
                // Delete the inorder successor
                node.right = delete(node.right, temp.value);
            }
        }
        
        // If the tree had only one node then return
        if (node == null) {
            return node;
        }
        
        // Update height
        node.height = 1 + Math.max(height(node.left), height(node.right));
        
        // Check balance factor and perform rotations if needed
        int balance = getBalance(node);
        
        // Left Left Case
        if (balance > 1 && getBalance(node.left) >= 0) {
            return rightRotate(node);
        }
        
        // Left Right Case
        if (balance > 1 && getBalance(node.left) < 0) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }
        
        // Right Right Case
        if (balance < -1 && getBalance(node.right) <= 0) {
            return leftRotate(node);
        }
        
        // Right Left Case
        if (balance < -1 && getBalance(node.right) > 0) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }
        
        return node;
    }
    
    private Node minValueNode(Node node) {
        Node current = node;
        while (current.left != null) {
            current = current.left;
        }
        return current;
    }
    
    private int height(Node node) {
        if (node == null) {
            return 0;
        }
        return node.height;
    }
    
    private int getBalance(Node node) {
        if (node == null) {
            return 0;
        }
        return height(node.left) - height(node.right);
    }
    
    private Node rightRotate(Node y) {
        Node x = y.left;
        Node T2 = x.right;
        
        // Perform rotation
        x.right = y;
        y.left = T2;
        
        // Update heights
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        
        return x;
    }
    
    private Node leftRotate(Node x) {
        Node y = x.right;
        Node T2 = y.left;
        
        // Perform rotation
        y.left = x;
        x.right = T2;
        
        // Update heights
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        
        return y;
    }
}