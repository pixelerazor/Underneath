-- CreateTable
CREATE TABLE "public"."AllgemeineInformation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllgemeineInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GeistlichesWohlbefinden" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mood" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "category" TEXT,
    "triggers" TEXT,
    "duration" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeistlichesWohlbefinden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Keuschheit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" INTEGER,
    "device" TEXT,
    "description" TEXT,
    "intensity" INTEGER,
    "satisfaction" INTEGER,
    "wasPlanned" BOOLEAN NOT NULL DEFAULT false,
    "wasPermission" BOOLEAN NOT NULL DEFAULT false,
    "wasReward" BOOLEAN NOT NULL DEFAULT false,
    "wasPunishment" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keuschheit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NeueErkenntnis" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "context" TEXT,
    "category" TEXT,
    "importance" TEXT NOT NULL DEFAULT 'medium',
    "clarity" INTEGER,
    "application" TEXT,
    "relatedTo" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NeueErkenntnis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rueckfall" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "triggers" TEXT NOT NULL,
    "description" TEXT,
    "duration" TEXT,
    "pointsPenalty" INTEGER,
    "emotions" TEXT,
    "wasReported" BOOLEAN NOT NULL DEFAULT false,
    "wasIntentional" BOOLEAN NOT NULL DEFAULT false,
    "requiresAction" BOOLEAN NOT NULL DEFAULT false,
    "hasConsequences" BOOLEAN NOT NULL DEFAULT false,
    "prevention" TEXT,
    "lessons" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rueckfall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Strafe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL,
    "category" TEXT,
    "duration" TEXT,
    "intensity" INTEGER,
    "tools" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "wasEffective" BOOLEAN NOT NULL DEFAULT false,
    "wasConsensual" BOOLEAN NOT NULL DEFAULT true,
    "requiresFollowup" BOOLEAN NOT NULL DEFAULT false,
    "reaction" TEXT,
    "effectiveness" TEXT,
    "userId" TEXT NOT NULL,
    "adminBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Strafe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TPEEintrag" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "duration" TEXT,
    "intensity" INTEGER,
    "context" TEXT,
    "compliance" INTEGER,
    "satisfaction" INTEGER,
    "wasInitiated" BOOLEAN NOT NULL DEFAULT false,
    "wasSuccessful" BOOLEAN NOT NULL DEFAULT true,
    "hadResistance" BOOLEAN NOT NULL DEFAULT false,
    "requiresFollowup" BOOLEAN NOT NULL DEFAULT false,
    "emotions" TEXT,
    "lessons" TEXT,
    "improvements" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TPEEintrag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trigger" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "intensity" INTEGER,
    "frequency" TEXT,
    "response" TEXT,
    "context" TEXT,
    "emotions" TEXT,
    "physicalReaction" TEXT,
    "wasExpected" BOOLEAN NOT NULL DEFAULT false,
    "wasManaged" BOOLEAN NOT NULL DEFAULT false,
    "causedRelapse" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "copingStrategies" TEXT,
    "prevention" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AllgemeineInformation_creatorId_idx" ON "public"."AllgemeineInformation"("creatorId");

-- CreateIndex
CREATE INDEX "AllgemeineInformation_category_idx" ON "public"."AllgemeineInformation"("category");

-- CreateIndex
CREATE INDEX "AllgemeineInformation_priority_idx" ON "public"."AllgemeineInformation"("priority");

-- CreateIndex
CREATE INDEX "FAQ_creatorId_idx" ON "public"."FAQ"("creatorId");

-- CreateIndex
CREATE INDEX "FAQ_category_idx" ON "public"."FAQ"("category");

-- CreateIndex
CREATE INDEX "FAQ_priority_idx" ON "public"."FAQ"("priority");

-- CreateIndex
CREATE INDEX "GeistlichesWohlbefinden_userId_idx" ON "public"."GeistlichesWohlbefinden"("userId");

-- CreateIndex
CREATE INDEX "GeistlichesWohlbefinden_category_idx" ON "public"."GeistlichesWohlbefinden"("category");

-- CreateIndex
CREATE INDEX "GeistlichesWohlbefinden_mood_idx" ON "public"."GeistlichesWohlbefinden"("mood");

-- CreateIndex
CREATE INDEX "GeistlichesWohlbefinden_createdAt_idx" ON "public"."GeistlichesWohlbefinden"("createdAt");

-- CreateIndex
CREATE INDEX "Keuschheit_userId_idx" ON "public"."Keuschheit"("userId");

-- CreateIndex
CREATE INDEX "Keuschheit_type_idx" ON "public"."Keuschheit"("type");

-- CreateIndex
CREATE INDEX "Keuschheit_createdAt_idx" ON "public"."Keuschheit"("createdAt");

-- CreateIndex
CREATE INDEX "NeueErkenntnis_userId_idx" ON "public"."NeueErkenntnis"("userId");

-- CreateIndex
CREATE INDEX "NeueErkenntnis_category_idx" ON "public"."NeueErkenntnis"("category");

-- CreateIndex
CREATE INDEX "NeueErkenntnis_importance_idx" ON "public"."NeueErkenntnis"("importance");

-- CreateIndex
CREATE INDEX "NeueErkenntnis_createdAt_idx" ON "public"."NeueErkenntnis"("createdAt");

-- CreateIndex
CREATE INDEX "Rueckfall_userId_idx" ON "public"."Rueckfall"("userId");

-- CreateIndex
CREATE INDEX "Rueckfall_type_idx" ON "public"."Rueckfall"("type");

-- CreateIndex
CREATE INDEX "Rueckfall_severity_idx" ON "public"."Rueckfall"("severity");

-- CreateIndex
CREATE INDEX "Rueckfall_createdAt_idx" ON "public"."Rueckfall"("createdAt");

-- CreateIndex
CREATE INDEX "Strafe_userId_idx" ON "public"."Strafe"("userId");

-- CreateIndex
CREATE INDEX "Strafe_adminBy_idx" ON "public"."Strafe"("adminBy");

-- CreateIndex
CREATE INDEX "Strafe_severity_idx" ON "public"."Strafe"("severity");

-- CreateIndex
CREATE INDEX "Strafe_category_idx" ON "public"."Strafe"("category");

-- CreateIndex
CREATE INDEX "Strafe_createdAt_idx" ON "public"."Strafe"("createdAt");

-- CreateIndex
CREATE INDEX "TPEEintrag_userId_idx" ON "public"."TPEEintrag"("userId");

-- CreateIndex
CREATE INDEX "TPEEintrag_type_idx" ON "public"."TPEEintrag"("type");

-- CreateIndex
CREATE INDEX "TPEEintrag_intensity_idx" ON "public"."TPEEintrag"("intensity");

-- CreateIndex
CREATE INDEX "TPEEintrag_createdAt_idx" ON "public"."TPEEintrag"("createdAt");

-- CreateIndex
CREATE INDEX "Trigger_userId_idx" ON "public"."Trigger"("userId");

-- CreateIndex
CREATE INDEX "Trigger_type_idx" ON "public"."Trigger"("type");

-- CreateIndex
CREATE INDEX "Trigger_intensity_idx" ON "public"."Trigger"("intensity");

-- CreateIndex
CREATE INDEX "Trigger_frequency_idx" ON "public"."Trigger"("frequency");

-- CreateIndex
CREATE INDEX "Trigger_createdAt_idx" ON "public"."Trigger"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."AllgemeineInformation" ADD CONSTRAINT "AllgemeineInformation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GeistlichesWohlbefinden" ADD CONSTRAINT "GeistlichesWohlbefinden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Keuschheit" ADD CONSTRAINT "Keuschheit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NeueErkenntnis" ADD CONSTRAINT "NeueErkenntnis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rueckfall" ADD CONSTRAINT "Rueckfall_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Strafe" ADD CONSTRAINT "Strafe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Strafe" ADD CONSTRAINT "Strafe_adminBy_fkey" FOREIGN KEY ("adminBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TPEEintrag" ADD CONSTRAINT "TPEEintrag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trigger" ADD CONSTRAINT "Trigger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
