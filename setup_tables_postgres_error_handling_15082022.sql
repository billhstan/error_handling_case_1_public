--SELECT brand_id, brand_name, brand_url FROM brands;
SET TIME ZONE 'UTC';
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP table IF EXISTS todotasks;
DROP table IF EXISTS priority_levels;
DROP table IF EXISTS recipe_ingredients;
DROP table IF EXISTS recipes;

create table brands (
brand_id smallserial NOT NULL PRIMARY KEY,
brand_name varchar(30) NOT NULL,
brand_url varchar(50) NOT NULL,
created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX uq_brands_brand_name on 
brands (lower(brand_name));
CREATE UNIQUE INDEX uq_brands_brand_url on 
brands (lower(brand_url));

-- https://stackoverflow.com/questions/14148880/how-do-i-reference-a-foreign-key-to-serial-datatype
create table products (
product_id serial NOT NULL PRIMARY KEY,
product_name varchar(150) NOT NULL,
brand_id smallint NOT NULL CONSTRAINT fk_products_brand_id REFERENCES brands (brand_id),
created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
updated_at timestamptz DEFAULT CURRENT_TIMESTAMP);
CREATE UNIQUE INDEX uq_products_product_name_brand_id on 
products (lower(product_name),brand_id);

create table priority_levels (
priority_level_id smallserial NOT NULL PRIMARY KEY,
code_name varchar(50), 
level_number int NOT NULL,
created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

create table todotasks (
todotask_id serial NOT NULL PRIMARY KEY,
title varchar(500), 
deadline timestamptz NOT NULL,
priority_level_id smallint NOT NULL,
created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

create table recipes (
recipe_id serial NOT NULL PRIMARY KEY,
recipe_name varchar(100), 
description varchar(500), 
created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);
-- Proper recipe DB design can be found at https://dev.to/amckean12/designing-a-relational-database-for-a-cookbook-4nj6
create table recipe_ingredients (
recipe_ingredient_id serial NOT NULL PRIMARY KEY,
description varchar(500), 
created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brand_updatetime BEFORE UPDATE ON brands FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_product_updatetime BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_todotask_updatetime BEFORE UPDATE ON todotasks FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_priority_level_updatetime BEFORE UPDATE ON priority_levels FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_recipe_updatetime BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_recipe_ingredient_updatetime BEFORE UPDATE ON recipe_ingredients FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();

 -- https://stackoverflow.com/questions/44708548/postgres-complains-id-already-exists-after-insert-of-initial-data
 -- There were problems after I populated the tables with some test records. The database engine some how generates
 -- a new record id which violates (breaks) the unique id rule for the primary key.
 SELECT setval('brands_brand_id_seq', (SELECT MAX(brand_id) from brands));
 SELECT setval('products_product_id_seq', (SELECT MAX(product_id) from products));
 SELECT setval('priority_levels_priority_level_id_seq', (SELECT MAX(priority_level_id) from priority_levels));
 SELECT setval('todotasks_todotask_id_seq', (SELECT MAX(todotask_id) from todotasks));
SELECT setval('recipe_ingredients_recipe_ingredient_id_seq', (SELECT MAX(recipe_ingredient_id) from recipe_ingredients));
 SELECT setval('recipes_recipe_id_seq', (SELECT MAX(recipe_id) from recipes));
