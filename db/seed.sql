DELETE FROM items;
ALTER TABLE items AUTO_INCREMENT = 1;

INSERT INTO items (name, description, price) VALUES
  ('Notebook', 'Lined A5 notebook', 4.50),
  ('Pen', 'Blue ballpoint pen', 1.25),
  ('Backpack', 'Campus backpack', 39.99),
  ('Calculator', 'Scientific calculator', 18.00);
