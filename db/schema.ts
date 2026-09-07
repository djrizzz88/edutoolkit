import {sqliteTable,text,integer,primaryKey,uniqueIndex} from 'drizzle-orm/sqlite-core';
export const profiles=sqliteTable('profiles',{
 id:text('id').primaryKey(),name:text('name').notNull(),email:text('email').notNull(),plan:text('plan').notNull().default('free'),requestedPlan:text('requested_plan').notNull().default('free'),stripeCustomer:text('stripe_customer'),stripeSubscription:text('stripe_subscription'),createdAt:integer('created_at').notNull()
},t=>[uniqueIndex('profiles_stripe_customer').on(t.stripeCustomer)]);
export const usage=sqliteTable('account_usage',{userId:text('user_id').notNull(),period:text('period').notNull(),kind:text('kind').notNull(),count:integer('count').notNull().default(0)},t=>[primaryKey({columns:[t.userId,t.period,t.kind]})]);
