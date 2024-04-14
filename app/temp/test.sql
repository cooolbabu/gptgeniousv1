CREATE TABLE CustomerOrders (
    -- Unique identifier for each order
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign key linked to the Customers table to identify the customer making the order
    -- Adjusted to use a GUID (also known as UUID) for unique customer identification
    CustomerID CHAR(36),
    
    -- Details about the product ordered. 
    -- In a normalized database, this might be a foreign key to a Products table
    ProductID INT,
    
    -- Quantity of the product ordered
    Quantity INT CHECK (Quantity > 0),
    
    -- Price of the product at the time of the order
    Price DECIMAL(10, 2),
    
    -- The date and time when the order was placed
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- The date and time when the order was last updated (e.g., status change)
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Order status to track the progression of the customer's order
    -- Using ENUM for predefined status values; adjust these based on your business logic
    OrderStatus ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') NOT NULL,
    
    -- Additional notes or special instructions for the order
    Notes TEXT,
    
    -- Constraints and foreign keys
    -- Ensure that CustomerID references a valid customer in the Customers table
    -- Assuming Customers table is also using CHAR(36) for GUID as the primary key
    CONSTRAINT fk_CustomerID FOREIGN KEY (CustomerID)
        REFERENCES Customers(CustomerID)
        ON DELETE CASCADE,
        
    -- Ensure that ProductID references a valid product in the Products table
    CONSTRAINT fk_ProductID FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID)
        ON DELETE CASCADE
);
