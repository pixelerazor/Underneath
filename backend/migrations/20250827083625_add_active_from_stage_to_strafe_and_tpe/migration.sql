-- AlterTable
ALTER TABLE "public"."Strafe" ADD COLUMN     "activeFromStage" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "activeToStage" INTEGER;

-- AlterTable
ALTER TABLE "public"."TPEEintrag" ADD COLUMN     "activeFromStage" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "activeToStage" INTEGER;

-- CreateIndex
CREATE INDEX "Strafe_activeFromStage_idx" ON "public"."Strafe"("activeFromStage");

-- CreateIndex
CREATE INDEX "TPEEintrag_activeFromStage_idx" ON "public"."TPEEintrag"("activeFromStage");
