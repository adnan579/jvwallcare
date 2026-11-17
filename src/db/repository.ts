import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { blogs, galleryItems, inquiries, users } from './schema.ts';

// 1. Admin Bootstrap Account Helpers
export async function getBootstrapAdminUser() {
  try {
    const rows = await db.select().from(users).where(eq(users.uid, 'admin-bootstrap'));
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed in getBootstrapAdminUser:', error);
    throw new Error('Failed to check admin bootstrap status.', { cause: error });
  }
}

export async function upsertBootstrapAdminUser(email: string, passwordHash: string) {
  try {
    const rows = await db
      .insert(users)
      .values({
        uid: 'admin-bootstrap',
        email,
        role: 'ADMIN',
        passwordHash,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          passwordHash,
        },
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Database query failed in upsertBootstrapAdminUser:', error);
    throw new Error('Failed to save admin bootstrap credentials.', { cause: error });
  }
}

// 2. Inquiries (CRM Leads) Helpers
export async function listInquiries() {
  try {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  } catch (error) {
    console.error('Database query failed in listInquiries:', error);
    throw new Error('Failed to load CRM inquiries.', { cause: error });
  }
}

export async function createInquiryRecord(input: {
  referenceId: string;
  inquiryType: 'ORDER_INQUIRY' | 'DEALERSHIP_APPLICATION';
  fullName: string;
  firmName?: string;
  phone: string;
  email?: string;
  location: string;
  buildingSegment?: string;
  selectedProduct?: string;
  quantityOrTarget: string;
  godownAreaSqFt?: string;
  affiliationTier?: string;
  message?: string;
}) {
  try {
    const rows = await db
      .insert(inquiries)
      .values({
        referenceId: input.referenceId,
        inquiryType: input.inquiryType,
        status: 'NEW',
        fullName: input.fullName,
        firmName: input.firmName || null,
        phone: input.phone,
        email: input.email || null,
        location: input.location,
        buildingSegment: input.buildingSegment || null,
        selectedProduct: input.selectedProduct || null,
        quantityOrTarget: input.quantityOrTarget,
        godownAreaSqFt: input.godownAreaSqFt || null,
        affiliationTier: input.affiliationTier || null,
        message: input.message || null,
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Database query failed in createInquiryRecord:', error);
    throw new Error('Failed to store inquiry in database.', { cause: error });
  }
}

export async function updateInquiryStatusAndNotes(
  id: number,
  status: string,
  adminNotes?: string
) {
  try {
    const updatePayload: { status: string; adminNotes?: string } = { status };
    if (adminNotes !== undefined) {
      updatePayload.adminNotes = adminNotes;
    }
    const rows = await db
      .update(inquiries)
      .set(updatePayload)
      .where(eq(inquiries.id, id))
      .returning();
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed in updateInquiryStatusAndNotes:', error);
    throw new Error('Failed to update inquiry status.', { cause: error });
  }
}

export async function deleteInquiryRecord(id: number) {
  try {
    await db.delete(inquiries).where(eq(inquiries.id, id));
    return true;
  } catch (error) {
    console.error('Database query failed in deleteInquiryRecord:', error);
    throw new Error('Failed to delete inquiry record.', { cause: error });
  }
}

// 3. Blogs (CMS) Helpers
export async function listBlogs(includeDrafts = false) {
  try {
    const all = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
    if (includeDrafts) return all;
    return all.filter((b) => b.status === 'PUBLISHED');
  } catch (error) {
    console.error('Database query failed in listBlogs:', error);
    throw new Error('Failed to fetch blog posts.', { cause: error });
  }
}

export async function createBlogRecord(input: {
  slug: string;
  title: string;
  hindiSubtitle?: string;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string;
  mediaType?: string;
  authorName?: string;
  readTimeMinutes?: number;
  seoKeywords?: string;
  status: 'PUBLISHED' | 'DRAFT';
}) {
  try {
    const rows = await db
      .insert(blogs)
      .values({
        slug: input.slug,
        title: input.title,
        hindiSubtitle: input.hindiSubtitle || null,
        excerpt: input.excerpt,
        content: input.content,
        category: input.category || 'Wall Care Guide',
        coverImageUrl: input.coverImageUrl,
        mediaType: input.mediaType || 'image',
        authorName: input.authorName || 'J.V. Wall Care Technical Desk',
        readTimeMinutes: input.readTimeMinutes || 4,
        seoKeywords: input.seoKeywords || null,
        status: input.status || 'PUBLISHED',
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Database query failed in createBlogRecord:', error);
    throw new Error('Failed to publish blog article.', { cause: error });
  }
}

export async function updateBlogRecord(
  id: number,
  input: Partial<{
    title: string;
    hindiSubtitle: string;
    excerpt: string;
    content: string;
    category: string;
    coverImageUrl: string;
    mediaType: string;
    readTimeMinutes: number;
    seoKeywords: string;
    status: 'PUBLISHED' | 'DRAFT';
  }>
) {
  try {
    const rows = await db
      .update(blogs)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(blogs.id, id))
      .returning();
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed in updateBlogRecord:', error);
    throw new Error('Failed to update blog post.', { cause: error });
  }
}

export async function deleteBlogRecord(id: number) {
  try {
    await db.delete(blogs).where(eq(blogs.id, id));
    return true;
  } catch (error) {
    console.error('Database query failed in deleteBlogRecord:', error);
    throw new Error('Failed to delete blog post.', { cause: error });
  }
}

// 4. Gallery Media Helpers
export async function listGalleryItems(includeUnpublished = false) {
  try {
    const all = await db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt));
    if (includeUnpublished) return all;
    return all.filter((item) => item.featured === true);
  } catch (error) {
    console.error('Database query failed in listGalleryItems:', error);
    throw new Error('Failed to fetch gallery media items.', { cause: error });
  }
}

export async function createGalleryItemRecord(input: {
  title: string;
  subtitle: string;
  category: string;
  mediaUrl: string;
  mediaType?: string;
  cloudinaryPublicId?: string;
  featured?: boolean;
}) {
  try {
    const rows = await db
      .insert(galleryItems)
      .values({
        title: input.title,
        subtitle: input.subtitle,
        category: input.category || 'PACKAGING',
        mediaUrl: input.mediaUrl,
        mediaType: input.mediaType || 'image',
        cloudinaryPublicId: input.cloudinaryPublicId || null,
        featured: input.featured ?? true,
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Database query failed in createGalleryItemRecord:', error);
    throw new Error('Failed to save gallery item.', { cause: error });
  }
}

export async function updateGalleryItemRecord(
  id: number,
  input: Partial<{
    title: string;
    subtitle: string;
    category: string;
    mediaUrl: string;
    mediaType: string;
    cloudinaryPublicId: string;
    featured: boolean;
  }>
) {
  try {
    const rows = await db
      .update(galleryItems)
      .set(input)
      .where(eq(galleryItems.id, id))
      .returning();
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed in updateGalleryItemRecord:', error);
    throw new Error('Failed to update gallery item.', { cause: error });
  }
}

export async function deleteGalleryItemRecord(id: number) {
  try {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
    return true;
  } catch (error) {
    console.error('Database query failed in deleteGalleryItemRecord:', error);
    throw new Error('Failed to delete gallery item.', { cause: error });
  }
}
