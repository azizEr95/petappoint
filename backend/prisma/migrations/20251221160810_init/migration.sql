-- CreateEnum
CREATE TYPE "sexes" AS ENUM ('not_known', 'male', 'female', 'not_applicable');

-- CreateEnum
CREATE TYPE "paymentstatus" AS ENUM ('unpaid', 'paid', 'cancelled');

-- CreateEnum
CREATE TYPE "lifestyles" AS ENUM ('indoor', 'outdoor', 'mixed');

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR(80) NOT NULL,
    "citycode" VARCHAR(12) NOT NULL,
    "city" VARCHAR(60) NOT NULL,
    "country" VARCHAR(150) NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "dateofbirth" DATE,
    "dateofbirthisexact" BOOLEAN,
    "weightingram" INTEGER,
    "heightincm" INTEGER,
    "timeofdeath" DATE,
    "iscastrated" BOOLEAN NOT NULL,
    "lifestyle" "lifestyles" NOT NULL DEFAULT 'indoor',
    "picturepath" VARCHAR(256),
    "sex" "sexes" NOT NULL DEFAULT 'not_known',
    "fk_animaltypeid" INTEGER NOT NULL,
    "fk_animalgroupid" INTEGER,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "starttime" TIMESTAMP(6) NOT NULL,
    "endtime" TIMESTAMP(6) NOT NULL,
    "fk_animalid" INTEGER,
    "fk_veterinaryid" INTEGER NOT NULL,
    "fk_veterinarypracticeid" INTEGER NOT NULL,
    "fk_serviceid" INTEGER,
    "notes" TEXT,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_has_animal" (
    "fk_personid" INTEGER NOT NULL,
    "fk_animalid" INTEGER NOT NULL,

    CONSTRAINT "person_has_animal_pkey" PRIMARY KEY ("fk_personid","fk_animalid")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(60) NOT NULL,
    "lastname" VARCHAR(60) NOT NULL,
    "sex" "sexes" NOT NULL,
    "dateofbirth" DATE NOT NULL,
    "fk_address" INTEGER NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "picturepath" VARCHAR(256),

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "used_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veterinarians" (
    "id" INTEGER NOT NULL,
    "infoemail" VARCHAR(100),
    "fk_veterinarypracticeid" INTEGER,

    CONSTRAINT "veterinarians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veterinarypractices" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "infoemail" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "website" VARCHAR(150),
    "info" TEXT,
    "fk_addressid" INTEGER NOT NULL,

    CONSTRAINT "veterinarypractices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_has_races" (
    "fk_animalid" INTEGER NOT NULL,
    "fk_animalraceid" INTEGER NOT NULL,

    CONSTRAINT "animal_has_races_pkey" PRIMARY KEY ("fk_animalid","fk_animalraceid")
);

-- CreateTable
CREATE TABLE "animal_has_vaccination" (
    "id" SERIAL NOT NULL,
    "dateofvaccination" DATE NOT NULL,
    "fk_animalid" INTEGER NOT NULL,
    "fk_vaccinationid" INTEGER NOT NULL,

    CONSTRAINT "animal_has_vaccination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_has_review" (
    "fk_appointmentid" INTEGER NOT NULL,
    "fk_reviewid" INTEGER NOT NULL,

    CONSTRAINT "appointment_has_review_pkey" PRIMARY KEY ("fk_appointmentid","fk_reviewid")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "fk_animalid" INTEGER NOT NULL,
    "fk_medicationid" INTEGER NOT NULL,
    "starting" DATE NOT NULL,
    "enddate" DATE NOT NULL,
    "instructions" TEXT,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "contentment" SMALLINT NOT NULL,
    "waitingtime" SMALLINT NOT NULL,
    "kindness" SMALLINT NOT NULL,
    "servicequality" SMALLINT NOT NULL,
    "price" SMALLINT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccinations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veterinary_has_invitation" (
    "fk_veterinaryid" INTEGER NOT NULL,
    "fk_veterinarypracticeid" INTEGER NOT NULL,
    "dateofinvitation" DATE NOT NULL,

    CONSTRAINT "veterinary_has_invitation_pkey" PRIMARY KEY ("fk_veterinaryid","fk_veterinarypracticeid")
);

-- CreateTable
CREATE TABLE "person_has_favorized_veterinarypractice" (
    "fk_personid" INTEGER NOT NULL,
    "fk_veterinarypracticeid" INTEGER NOT NULL,

    CONSTRAINT "person_has_favorized_veterinarypractice_pkey" PRIMARY KEY ("fk_personid","fk_veterinarypracticeid")
);

-- CreateTable
CREATE TABLE "appointment_has_service" (
    "fk_appointmentid" INTEGER NOT NULL,
    "fk_serviceid" INTEGER NOT NULL,

    CONSTRAINT "appointment_has_service_pkey" PRIMARY KEY ("fk_appointmentid","fk_serviceid")
);

-- CreateTable
CREATE TABLE "veterinary_can_treat_animaltype" (
    "fk_veterinaryid" INTEGER NOT NULL,
    "fk_animaltypeid" INTEGER NOT NULL,

    CONSTRAINT "veterinary_can_treat_animaltype_pkey" PRIMARY KEY ("fk_veterinaryid","fk_animaltypeid")
);

-- CreateTable
CREATE TABLE "veterinary_has_service" (
    "fk_veterinaryid" INTEGER NOT NULL,
    "fk_serviceid" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "veterinary_has_service_pkey" PRIMARY KEY ("fk_veterinaryid","fk_serviceid")
);

-- CreateTable
CREATE TABLE "animal_groups" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "animal_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_races" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "fk_animaltypeid" INTEGER NOT NULL,

    CONSTRAINT "animal_races_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "animal_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_has_confirmation_code" (
    "fk_personid" INTEGER NOT NULL,
    "code" CHAR(6) NOT NULL,
    "dateofcreation" DATE NOT NULL,
    "verified" BOOLEAN NOT NULL,

    CONSTRAINT "person_has_confirmation_code_pkey" PRIMARY KEY ("fk_personid")
);

-- CreateIndex
CREATE UNIQUE INDEX "persons_email_key" ON "persons"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "idx_password_reset_tokens_expires_at" ON "password_reset_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "idx_password_reset_tokens_user_id" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "veterinarypractices_email_key" ON "veterinarypractices"("email");

-- CreateIndex
CREATE UNIQUE INDEX "medications_name_key" ON "medications"("name");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vaccinations_name_key" ON "vaccinations"("name");

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_fk_animalgroupid_fkey" FOREIGN KEY ("fk_animalgroupid") REFERENCES "animal_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_fk_animaltypeid_fkey" FOREIGN KEY ("fk_animaltypeid") REFERENCES "animal_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_animalid_fkey" FOREIGN KEY ("fk_animalid") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_serviceid_fkey" FOREIGN KEY ("fk_serviceid") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_veterinaryid_fkey" FOREIGN KEY ("fk_veterinaryid") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_fk_veterinarypracticeid_fkey" FOREIGN KEY ("fk_veterinarypracticeid") REFERENCES "veterinarypractices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_has_animal" ADD CONSTRAINT "person_has_animal_fk_animalid_fkey" FOREIGN KEY ("fk_animalid") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_has_animal" ADD CONSTRAINT "person_has_animal_fk_personid_fkey" FOREIGN KEY ("fk_personid") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_fk_address_fkey" FOREIGN KEY ("fk_address") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinarians" ADD CONSTRAINT "veterinarians_fk_veterinarypracticeid_fkey" FOREIGN KEY ("fk_veterinarypracticeid") REFERENCES "veterinarypractices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinarians" ADD CONSTRAINT "veterinarians_id_fkey" FOREIGN KEY ("id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinarypractices" ADD CONSTRAINT "veterinarypractices_fk_addressid_fkey" FOREIGN KEY ("fk_addressid") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "animal_has_races" ADD CONSTRAINT "animal_has_races_fk_animalid_fkey" FOREIGN KEY ("fk_animalid") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "animal_has_races" ADD CONSTRAINT "animal_has_races_fk_animalraceid_fkey" FOREIGN KEY ("fk_animalraceid") REFERENCES "animal_races"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "animal_has_vaccination" ADD CONSTRAINT "animal_has_vaccination_fk_animalid_fkey" FOREIGN KEY ("fk_animalid") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "animal_has_vaccination" ADD CONSTRAINT "animal_has_vaccination_fk_vaccinationid_fkey" FOREIGN KEY ("fk_vaccinationid") REFERENCES "vaccinations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointment_has_review" ADD CONSTRAINT "appointment_has_review_fk_appointmentid_fkey" FOREIGN KEY ("fk_appointmentid") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointment_has_review" ADD CONSTRAINT "appointment_has_review_fk_reviewid_fkey" FOREIGN KEY ("fk_reviewid") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_fk_animalid_fkey" FOREIGN KEY ("fk_animalid") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_fk_medicationid_fkey" FOREIGN KEY ("fk_medicationid") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinary_has_invitation" ADD CONSTRAINT "veterinary_has_invitation_fk_veterinaryid_fkey" FOREIGN KEY ("fk_veterinaryid") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinary_has_invitation" ADD CONSTRAINT "veterinary_has_invitation_fk_veterinarypracticeid_fkey" FOREIGN KEY ("fk_veterinarypracticeid") REFERENCES "veterinarypractices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_has_favorized_veterinarypractice" ADD CONSTRAINT "person_has_favorized_veterinarypra_fk_veterinarypracticeid_fkey" FOREIGN KEY ("fk_veterinarypracticeid") REFERENCES "veterinarypractices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_has_favorized_veterinarypractice" ADD CONSTRAINT "person_has_favorized_veterinarypractice_fk_personid_fkey" FOREIGN KEY ("fk_personid") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointment_has_service" ADD CONSTRAINT "appointment_has_service_fk_appointmentid_fkey" FOREIGN KEY ("fk_appointmentid") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointment_has_service" ADD CONSTRAINT "appointment_has_service_fk_serviceid_fkey" FOREIGN KEY ("fk_serviceid") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinary_can_treat_animaltype" ADD CONSTRAINT "veterinary_can_treat_animaltype_fk_animaltypeid_fkey" FOREIGN KEY ("fk_animaltypeid") REFERENCES "animal_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinary_can_treat_animaltype" ADD CONSTRAINT "veterinary_can_treat_animaltype_fk_veterinaryid_fkey" FOREIGN KEY ("fk_veterinaryid") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinary_has_service" ADD CONSTRAINT "veterinary_has_service_fk_serviceid_fkey" FOREIGN KEY ("fk_serviceid") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "veterinary_has_service" ADD CONSTRAINT "veterinary_has_service_fk_veterinaryid_fkey" FOREIGN KEY ("fk_veterinaryid") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "animal_races" ADD CONSTRAINT "animal_races_fk_animaltypeid_fkey" FOREIGN KEY ("fk_animaltypeid") REFERENCES "animal_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_has_confirmation_code" ADD CONSTRAINT "person_has_confirmation_code_fk_personid_fkey" FOREIGN KEY ("fk_personid") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
