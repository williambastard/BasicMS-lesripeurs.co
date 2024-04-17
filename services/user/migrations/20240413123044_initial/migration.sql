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
INSERT INTO "User"(email, phone, lastnames, firstnames, password) VALUES ('email-de-test-unique@test.comx','33650717809','COMPTE','test','7650657457584b4378746f30626d5139547368714a2b31327245675457346b66356c735543616868724a553d');