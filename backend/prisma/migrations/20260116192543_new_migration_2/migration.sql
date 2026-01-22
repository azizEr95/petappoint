/*
  Warnings:

  - You are about to drop the column `country` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `fk_country` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "country",
ADD COLUMN     "fk_country" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "veterinarypractices_has_confirmation_code" (
    "fk_veterinarypracticeid" INTEGER NOT NULL,
    "code" CHAR(6) NOT NULL,
    "dateofcreation" DATE NOT NULL,
    "verified" BOOLEAN NOT NULL,

    CONSTRAINT "veterinarypractices_has_confirmation_code_pkey" PRIMARY KEY ("fk_veterinarypracticeid")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_fk_country_fkey" FOREIGN KEY ("fk_country") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinarypractices_has_confirmation_code" ADD CONSTRAINT "veterinarypractices_has_confirmati_fk_veterinarypracticeid_fkey" FOREIGN KEY ("fk_veterinarypracticeid") REFERENCES "veterinarypractices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
