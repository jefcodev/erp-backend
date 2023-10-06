
CREATE OR REPLACE FUNCTION update_stock() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE inv_products SET stock = stock + NEW.amount_product WHERE id = NEW.id_product;
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE inv_products SET stock = stock - OLD.amount_product + NEW.amount_product WHERE id = NEW.id_product;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_stock
AFTER INSERT OR UPDATE ON pur_details
FOR EACH ROW
EXECUTE FUNCTION update_stock();