DELETE FROM games;
ALTER TABLE games AUTO_INCREMENT = 1;

INSERT INTO games (title, studio, price, stock) VALUES
  ('Minecraft', 'Mojang Studios', 29.99, 15),
  ('Stardew Valley', 'ConcernedApe', 14.99, 20),
  ('Hades', 'Supergiant Games', 19.99, 10),
  ('Elden Ring', 'FromSoftware', 59.99, 8),
  ('Celeste', 'Maddy Makes Games', 24.99, 12);
