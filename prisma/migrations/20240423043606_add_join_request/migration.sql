-- CreateTable
CREATE TABLE "JoinRequest" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "JoinRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
