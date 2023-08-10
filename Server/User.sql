CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);



CREATE TABLE "Quiz" (
  "ResponseID" SERIAL NOT NULL UNIQUE,
  "UserID" INTEGER NOT NULL,
  "Timestamp" TIMESTAMP NOT NULL,
  "Response" VARCHAR(255) NOT NULL,
  PRIMARY KEY ("ResponseID"),
  CONSTRAINT "Quiz_fk0" FOREIGN KEY ("UserID") REFERENCES "User" ("UserId")
);


CREATE TABLE "Hairstyles" (
  "Hairstyle_ID" SERIAL NOT NULL UNIQUE,
  "Hairstyle_name" VARCHAR(255) NOT NULL,
  "image" VARCHAR(255) NOT NULL,
  PRIMARY KEY ("Hairstyle_ID")
);


CREATE TABLE "Likes" (
  "LikeID" SERIAL NOT NULL,
  "userID" INTEGER NOT NULL,
  "HairstylesID" INTEGER NOT NULL,
  PRIMARY KEY ("LikeID"),
  CONSTRAINT "Likes_fk0" FOREIGN KEY ("userID") REFERENCES "User" ("UserId"),
  CONSTRAINT "Likes_fk1" FOREIGN KEY ("HairstylesID") REFERENCES "Hairstyles" ("Hairstyle_ID")
);


CREATE TABLE "Favorite" (
  "FavoriteID" SERIAL NOT NULL,
  "UserID" INTEGER NOT NULL,
  "HairstylesID" INTEGER NOT NULL,
  PRIMARY KEY ("FavoriteID"),
  CONSTRAINT "Favorites_fk0" FOREIGN KEY ("UserID") REFERENCES "User" ("UserId"),
  CONSTRAINT "Favorites_fk1" FOREIGN KEY ("HairstylesID") REFERENCES "Hairstyles" ("Hairstyle_ID")
);