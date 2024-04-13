-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "lastnames" TEXT NOT NULL,
    "firstnames" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- InsertData
INSERT INTO "User"(email, phone, lastnames, firstnames, password) VALUES ('test@test.fr','33650717809','COMPTE','test','password');
INSERT INTO "User"(email, phone, lastnames, firstnames, password) VALUES ('test@test.fr3','33650717809','COMPTE','test','password');