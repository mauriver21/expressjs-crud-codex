CREATE TABLE IF NOT EXISTS "data_initializers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
