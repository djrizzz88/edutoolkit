CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`plan` text DEFAULT 'free' NOT NULL,
	`requested_plan` text DEFAULT 'free' NOT NULL,
	`stripe_customer` text,
	`stripe_subscription` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_stripe_customer` ON `profiles` (`stripe_customer`);--> statement-breakpoint
CREATE TABLE `account_usage` (
	`user_id` text NOT NULL,
	`period` text NOT NULL,
	`kind` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`user_id`, `period`, `kind`)
);
