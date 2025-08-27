-- CreateTable
CREATE TABLE "public"."Privileg" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "type" TEXT,
    "conditions" TEXT,
    "duration" TEXT,
    "pointsRequired" INTEGER,
    "level" INTEGER,
    "canRevoke" BOOLEAN NOT NULL DEFAULT true,
    "autoExpires" BOOLEAN NOT NULL DEFAULT false,
    "expiresAfter" TEXT,
    "activeFromStage" INTEGER NOT NULL DEFAULT 1,
    "activeToStage" INTEGER,
    "creatorId" TEXT NOT NULL,
    "grantedToId" TEXT,
    "stageId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Privileg_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Privileg_activeFromStage_idx" ON "public"."Privileg"("activeFromStage");

-- CreateIndex
CREATE INDEX "Privileg_creatorId_idx" ON "public"."Privileg"("creatorId");

-- CreateIndex
CREATE INDEX "Privileg_grantedToId_idx" ON "public"."Privileg"("grantedToId");

-- CreateIndex
CREATE INDEX "Privileg_isActive_idx" ON "public"."Privileg"("isActive");

-- CreateIndex
CREATE INDEX "Privileg_type_idx" ON "public"."Privileg"("type");

-- AddForeignKey
ALTER TABLE "public"."Privileg" ADD CONSTRAINT "Privileg_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Privileg" ADD CONSTRAINT "Privileg_grantedToId_fkey" FOREIGN KEY ("grantedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Privileg" ADD CONSTRAINT "Privileg_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
