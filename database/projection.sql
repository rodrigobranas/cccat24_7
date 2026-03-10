drop schema if exists ccca;

create schema ccca;

create table ccca.order (
	order_id uuid,
	market_id text,
	account_id uuid,
	name text,
    email text,
	side text,
	quantity numeric,
	price numeric,
	fill_quantity numeric,
	fill_price numeric,
	status text,
	timestamp timestamptz,
	primary key (order_id)
);
