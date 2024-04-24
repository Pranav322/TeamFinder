-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,
    "projectowneremail" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
