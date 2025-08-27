-- CreateTable
CREATE TABLE "public"."Initiationsriten" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ritualType" TEXT,
    "markingType" TEXT,
    "bodyLocation" TEXT,
    "symbolism" TEXT,
    "actionSequence" TEXT,
    "symbolMeaning" TEXT,
    "repetitionSchedule" TEXT,
    "ceremonyLocation" TEXT,
    "participants" TEXT,
    "ceremonyDuration" TEXT,
    "ceremonyElements" TEXT,
    "behaviorDescription" TEXT,
    "behaviorDuration" TEXT,
    "behaviorFrequency" TEXT,
    "customDefinition" TEXT,
    "timing" TEXT,
    "documentation" TEXT,
    "requiresPreparation" BOOLEAN NOT NULL DEFAULT false,
    "requiresAftercare" BOOLEAN NOT NULL DEFAULT false,
    "preparationDetails" TEXT,
    "aftercareDetails" TEXT,
    "explicitConsent" BOOLEAN NOT NULL DEFAULT false,
    "hardLimits" TEXT,
    "exitClause" TEXT,
    "medicalConsiderations" TEXT,
    "reversibility" TEXT,
    "reversibilityDetails" TEXT,
    "activeFromStage" INTEGER NOT NULL DEFAULT 1,
    "activeToStage" INTEGER,
    "creatorId" TEXT NOT NULL,
    "stageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Initiationsriten_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Initiationsriten_creatorId_idx" ON "public"."Initiationsriten"("creatorId");

-- CreateIndex
CREATE INDEX "Initiationsriten_activeFromStage_idx" ON "public"."Initiationsriten"("activeFromStage");

-- CreateIndex
CREATE INDEX "Initiationsriten_ritualType_idx" ON "public"."Initiationsriten"("ritualType");

-- CreateIndex
CREATE INDEX "Initiationsriten_createdAt_idx" ON "public"."Initiationsriten"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Initiationsriten" ADD CONSTRAINT "Initiationsriten_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Initiationsriten" ADD CONSTRAINT "Initiationsriten_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;