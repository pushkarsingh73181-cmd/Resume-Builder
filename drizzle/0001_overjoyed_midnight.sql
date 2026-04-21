CREATE TABLE `atsScoreHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resumeId` int NOT NULL,
	`jobDescriptionId` int,
	`score` int NOT NULL,
	`matchedKeywords` text,
	`missingKeywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `atsScoreHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coverLetters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`resumeId` int NOT NULL,
	`jobDescriptionId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coverLetters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobDescriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`company` varchar(255),
	`content` text NOT NULL,
	`keywords` text,
	`skills` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobDescriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`template` varchar(64) NOT NULL DEFAULT 'modern',
	`data` text NOT NULL,
	`atsScore` int,
	`pdfUrl` varchar(512),
	`pdfKey` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resumes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('free','pro') NOT NULL DEFAULT 'free',
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`resumeCount` int NOT NULL DEFAULT 0,
	`maxResumes` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `atsScoreHistory` ADD CONSTRAINT `atsScoreHistory_resumeId_resumes_id_fk` FOREIGN KEY (`resumeId`) REFERENCES `resumes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `atsScoreHistory` ADD CONSTRAINT `atsScoreHistory_jobDescriptionId_jobDescriptions_id_fk` FOREIGN KEY (`jobDescriptionId`) REFERENCES `jobDescriptions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coverLetters` ADD CONSTRAINT `coverLetters_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coverLetters` ADD CONSTRAINT `coverLetters_resumeId_resumes_id_fk` FOREIGN KEY (`resumeId`) REFERENCES `resumes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coverLetters` ADD CONSTRAINT `coverLetters_jobDescriptionId_jobDescriptions_id_fk` FOREIGN KEY (`jobDescriptionId`) REFERENCES `jobDescriptions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobDescriptions` ADD CONSTRAINT `jobDescriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resumes` ADD CONSTRAINT `resumes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;