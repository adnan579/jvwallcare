import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').notNull().default('ADMIN'),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  referenceId: text('reference_id').notNull().unique(),
  inquiryType: text('inquiry_type').notNull().default('ORDER_INQUIRY'), // ORDER_INQUIRY | DEALERSHIP_APPLICATION
  status: text('status').notNull().default('NEW'), // NEW | CONTACTED | CONVERTED | LOST
  fullName: text('full_name').notNull(),
  firmName: text('firm_name'),
  phone: text('phone').notNull(),
  email: text('email'),
  location: text('location').notNull(),
  buildingSegment: text('building_segment'),
  selectedProduct: text('selected_product'),
  quantityOrTarget: text('quantity_or_target').notNull(),
  godownAreaSqFt: text('godown_area_sqft'),
  affiliationTier: text('affiliation_tier'),
  message: text('message'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  hindiSubtitle: text('hindi_subtitle'),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull().default('Wall Care Guide'),
  coverImageUrl: text('cover_image_url').notNull(),
  mediaType: text('media_type').notNull().default('image'), // image | video
  authorName: text('author_name').notNull().default('J.V. Wall Care Technical Desk'),
  readTimeMinutes: integer('read_time_minutes').notNull().default(4),
  seoKeywords: text('seo_keywords'),
  status: text('status').notNull().default('PUBLISHED'), // PUBLISHED | DRAFT
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  category: text('category').notNull().default('PACKAGING'), // PACKAGING | PLANT | APPLICATION | POSTER
  mediaUrl: text('media_url').notNull(),
  mediaType: text('media_type').notNull().default('image'), // image | video
  cloudinaryPublicId: text('cloudinary_public_id'),
  featured: boolean('featured').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
}));

export const blogsRelations = relations(blogs, ({ one }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
}));
