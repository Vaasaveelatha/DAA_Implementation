CREATE TABLE `sortx_quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorKey` varchar(96) NOT NULL,
	`score` int NOT NULL,
	`total` int NOT NULL,
	`percentage` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sortx_quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sortx_datasets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorKey` varchar(96) NOT NULL,
	`name` varchar(120) NOT NULL,
	`values` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sortx_datasets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sortx_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorKey` varchar(96) NOT NULL,
	`theme` enum('dark','light') NOT NULL DEFAULT 'dark',
	`reducedMotion` int NOT NULL DEFAULT 0,
	`defaultAlgorithm` varchar(32) NOT NULL DEFAULT 'quick',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sortx_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `sortx_preferences_visitorKey_unique` UNIQUE(`visitorKey`)
);
--> statement-breakpoint
CREATE TABLE `sortx_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorKey` varchar(96) NOT NULL,
	`algorithm` varchar(32) NOT NULL,
	`elements` int NOT NULL,
	`comparisons` int NOT NULL,
	`swaps` int NOT NULL,
	`accesses` int NOT NULL,
	`elapsedMs` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sortx_sessions_id` PRIMARY KEY(`id`)
);
