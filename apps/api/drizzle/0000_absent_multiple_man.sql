CREATE TABLE `installments` (
	`id` text PRIMARY KEY NOT NULL,
	`loan_id` text NOT NULL,
	`sequence` integer NOT NULL,
	`due_date` text NOT NULL,
	`principal_due` integer NOT NULL,
	`interest_due` integer NOT NULL,
	`paid_amount` integer DEFAULT 0 NOT NULL,
	`paid_at` text,
	FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `loan_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`term_months` integer NOT NULL,
	`annual_rate_bps` integer NOT NULL,
	`purpose` text NOT NULL,
	`employment` text NOT NULL,
	`status` text NOT NULL,
	`decision_reason` text,
	`decided_by` text,
	`decided_at` text,
	`disbursed_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`decided_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`user_id` text NOT NULL,
	`principal_cents` integer NOT NULL,
	`annual_rate_bps` integer NOT NULL,
	`term_months` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text NOT NULL,
	`outstanding_cents` integer NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `loan_applications`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` text NOT NULL,
	`role` text NOT NULL,
	`monthly_income` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_loan_seq` ON `installments` (`loan_id`,`sequence`);--> statement-breakpoint
CREATE UNIQUE INDEX `loans_application_id_unique` ON `loans` (`application_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);