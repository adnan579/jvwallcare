import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { createServer as createViteServer } from 'vite';
import {
  AuthRequest,
  createAdminSessionToken,
  hashPassword,
  requireAuth,
  safeCompareStrings,
} from './src/middleware/auth.ts';
import {
  createBlogRecord,
  createGalleryItemRecord,
  createInquiryRecord,
  deleteBlogRecord,
  deleteGalleryItemRecord,
  deleteInquiryRecord,
  getBootstrapAdminUser,
  listBlogs,
  listGalleryItems,
  listInquiries,
  updateBlogRecord,
  updateGalleryItemRecord,
  updateInquiryStatusAndNotes,
  upsertBootstrapAdminUser,
} from './src/db/repository.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRealEnv(key: string): string {
  const val = (process.env[key] || '').trim();
  if (!val || val === `MY_${key}` || val.startsWith('MY_')) return '';
  return val;
}

function slugifyTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) +
    '-' +
    Math.floor(100 + Math.random() * 900)
  );
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '12mb' }));

  // ============================================================================
  // 1. PUBLIC READ APIs (Blogs & Gallery for About Page)
  // ============================================================================
  app.get('/api/blogs', async (_req, res) => {
    try {
      const items = await listBlogs(false);
      res.json({ blogs: items });
    } catch (error: any) {
      console.error('Failed to fetch public blogs:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch blog posts' });
    }
  });

  app.get('/api/gallery', async (_req, res) => {
    try {
      const items = await listGalleryItems(false);
      res.json({ gallery: items });
    } catch (error: any) {
      console.error('Failed to fetch public gallery:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch gallery items' });
    }
  });

  // ============================================================================
  // 2. PUBLIC INQUIRY SUBMISSION API (Contact & Dealership Forms -> CRM)
  // ============================================================================
  app.post('/api/inquiries', async (req, res) => {
    try {
      const {
        referenceId,
        inquiryType,
        fullName,
        firmName,
        phone,
        email,
        location,
        buildingSegment,
        selectedProduct,
        quantityOrTarget,
        godownAreaSqFt,
        affiliationTier,
        message,
      } = req.body || {};

      if (!fullName || !phone || !location || !quantityOrTarget) {
        return res.status(400).json({
          error: 'Full name, phone number, location, and quantity/target are required.',
        });
      }

      const generatedRef =
        referenceId ||
        (inquiryType === 'DEALERSHIP_APPLICATION'
          ? `JV-DLR-${Math.floor(10000 + Math.random() * 90000)}`
          : `JV-ORD-${Math.floor(100000 + Math.random() * 900000)}`);

      const created = await createInquiryRecord({
        referenceId: generatedRef,
        inquiryType:
          inquiryType === 'DEALERSHIP_APPLICATION' ? 'DEALERSHIP_APPLICATION' : 'ORDER_INQUIRY',
        fullName: String(fullName).trim(),
        firmName: firmName ? String(firmName).trim() : undefined,
        phone: String(phone).trim(),
        email: email ? String(email).trim() : undefined,
        location: String(location).trim(),
        buildingSegment: buildingSegment ? String(buildingSegment).trim() : undefined,
        selectedProduct: selectedProduct ? String(selectedProduct).trim() : undefined,
        quantityOrTarget: String(quantityOrTarget).trim(),
        godownAreaSqFt: godownAreaSqFt ? String(godownAreaSqFt).trim() : undefined,
        affiliationTier: affiliationTier ? String(affiliationTier).trim() : undefined,
        message: message ? String(message).trim() : undefined,
      });

      res.status(201).json({ inquiry: created });
    } catch (error: any) {
      console.error('Failed to save inquiry:', error);
      res.status(500).json({ error: error.message || 'Failed to submit inquiry' });
    }
  });

  // ============================================================================
  // 3. ADMIN BOOTSTRAP & AUTHENTICATION APIs (Setupgram-inspired)
  // ============================================================================
  app.get('/api/admin/bootstrap-status', async (_req, res) => {
    try {
      const envEmail = getRealEnv('ADMIN_EMAIL');
      const envPassword = getRealEnv('ADMIN_PASSWORD');
      const dbAdmin = await getBootstrapAdminUser();

      const envConfigured = Boolean(envEmail && envPassword);
      const isBootstrapped = Boolean(envConfigured || dbAdmin?.passwordHash);
      const emailHint = envEmail || dbAdmin?.email || 'j.v.wallcare01@gmail.com';
      const cloudinaryConfigured = Boolean(
        getRealEnv('CLOUDINARY_CLOUD_NAME') &&
          getRealEnv('CLOUDINARY_API_KEY') &&
          getRealEnv('CLOUDINARY_API_SECRET')
      );

      res.json({
        isBootstrapped,
        envConfigured,
        emailHint,
        cloudinaryConfigured,
      });
    } catch (error: any) {
      console.error('Bootstrap status check failed:', error);
      res.status(500).json({ error: error.message || 'Failed to check bootstrap status' });
    }
  });

  app.post('/api/admin/bootstrap', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password || String(password).length < 6) {
        return res.status(400).json({
          error: 'Valid admin email and a password of at least 6 characters are required.',
        });
      }

      const existing = await getBootstrapAdminUser();
      if (existing && existing.passwordHash) {
        return res.status(403).json({
          error: 'Admin account is already bootstrapped. Please sign in with your credentials.',
        });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const hashed = hashPassword(String(password));
      await upsertBootstrapAdminUser(cleanEmail, hashed);

      const token = createAdminSessionToken(cleanEmail);
      res.status(201).json({
        success: true,
        token,
        admin: { email: cleanEmail, role: 'ADMIN', authMethod: 'bootstrap' },
      });
    } catch (error: any) {
      console.error('Admin bootstrap failed:', error);
      res.status(500).json({ error: error.message || 'Failed to bootstrap admin account' });
    }
  });

  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'Admin email and password are required.' });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const rawPassword = String(password);

      // 1. Check environment variables (ADMIN_EMAIL / ADMIN_PASSWORD) configured in Vercel
      const envEmail = getRealEnv('ADMIN_EMAIL').toLowerCase();
      const envPassword = getRealEnv('ADMIN_PASSWORD');

      if (envEmail && envPassword) {
        const emailMatch = safeCompareStrings(cleanEmail, envEmail);
        const passMatch = safeCompareStrings(rawPassword, envPassword);
        if (emailMatch && passMatch) {
          const token = createAdminSessionToken(cleanEmail);
          return res.json({
            success: true,
            token,
            admin: { email: cleanEmail, role: 'ADMIN', authMethod: 'env' },
          });
        }
      }

      // 2. Check database-bootstrapped admin user
      const dbAdmin = await getBootstrapAdminUser();
      if (dbAdmin && dbAdmin.passwordHash) {
        const emailMatch = safeCompareStrings(cleanEmail, dbAdmin.email.toLowerCase());
        const passMatch = safeCompareStrings(hashPassword(rawPassword), dbAdmin.passwordHash);
        if (emailMatch && passMatch) {
          const token = createAdminSessionToken(dbAdmin.email);
          return res.json({
            success: true,
            token,
            admin: { email: dbAdmin.email, role: 'ADMIN', authMethod: 'bootstrap' },
          });
        }
      }

      return res.status(401).json({ error: 'Invalid admin email or password.' });
    } catch (error: any) {
      console.error('Admin login failed:', error);
      res.status(500).json({ error: error.message || 'Authentication failed' });
    }
  });

  // ============================================================================
  // 4. PROTECTED ADMIN CRM, CMS & CLOUDINARY APIs (Requires Auth Token)
  // ============================================================================
  app.get('/api/admin/overview', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const [allInquiries, allBlogs, allGallery] = await Promise.all([
        listInquiries(),
        listBlogs(true),
        listGalleryItems(true),
      ]);

      const statusCounts: Record<string, number> = {
        NEW: 0,
        CONTACTED: 0,
        CONVERTED: 0,
        LOST: 0,
      };
      allInquiries.forEach((inq) => {
        statusCounts[inq.status] = (statusCounts[inq.status] || 0) + 1;
      });

      const publishedBlogs = allBlogs.filter((b) => b.status === 'PUBLISHED').length;
      const draftBlogs = allBlogs.filter((b) => b.status === 'DRAFT').length;
      const publishedGalleryItems = allGallery.filter((g) => g.featured === true).length;
      const draftGalleryItems = allGallery.filter((g) => g.featured === false).length;

      res.json({
        totalLeads: allInquiries.length,
        statusCounts,
        publishedBlogs,
        draftBlogs,
        totalGalleryItems: allGallery.length,
        publishedGalleryItems,
        draftGalleryItems,
        recentLeads: allInquiries.slice(0, 5),
        recentBlogs: allBlogs.slice(0, 4),
      });
    } catch (error: any) {
      console.error('Admin overview failed:', error);
      res.status(500).json({ error: error.message || 'Failed to load dashboard overview' });
    }
  });

  app.get('/api/admin/inquiries', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const items = await listInquiries();
      res.json({ inquiries: items });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load inquiries' });
    }
  });

  app.patch('/api/admin/inquiries/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      const { status, adminNotes } = req.body || {};
      if (!id || !status) {
        return res.status(400).json({ error: 'Valid inquiry ID and status are required.' });
      }
      const updated = await updateInquiryStatusAndNotes(id, String(status), adminNotes);
      res.json({ inquiry: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update inquiry' });
    }
  });

  app.delete('/api/admin/inquiries/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      await deleteInquiryRecord(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete inquiry' });
    }
  });

  app.get('/api/admin/blogs', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const items = await listBlogs(true);
      res.json({ blogs: items });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load blogs' });
    }
  });

  app.post('/api/admin/blogs', requireAuth, async (req: AuthRequest, res) => {
    try {
      const {
        title,
        hindiSubtitle,
        excerpt,
        content,
        category,
        coverImageUrl,
        mediaType,
        authorName,
        readTimeMinutes,
        seoKeywords,
        status,
      } = req.body || {};

      if (!title || !excerpt || !content || !coverImageUrl) {
        return res.status(400).json({
          error: 'Title, excerpt, article content, and cover image/video are required.',
        });
      }

      const created = await createBlogRecord({
        slug: slugifyTitle(String(title)),
        title: String(title).trim(),
        hindiSubtitle: hindiSubtitle ? String(hindiSubtitle).trim() : undefined,
        excerpt: String(excerpt).trim(),
        content: String(content).trim(),
        category: category ? String(category).trim() : 'Wall Care Guide',
        coverImageUrl: String(coverImageUrl).trim(),
        mediaType: mediaType === 'video' ? 'video' : 'image',
        authorName: authorName ? String(authorName).trim() : 'J.V. Wall Care Technical Desk',
        readTimeMinutes: Number(readTimeMinutes) || 4,
        seoKeywords: seoKeywords ? String(seoKeywords).trim() : undefined,
        status: status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
      });

      res.status(201).json({ blog: created });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create blog post' });
    }
  });

  app.patch('/api/admin/blogs/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      const updated = await updateBlogRecord(id, req.body || {});
      res.json({ blog: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update blog post' });
    }
  });

  app.delete('/api/admin/blogs/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      await deleteBlogRecord(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete blog post' });
    }
  });

  app.get('/api/admin/gallery', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const items = await listGalleryItems(true);
      res.json({ gallery: items });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load admin gallery items' });
    }
  });

  app.post('/api/admin/gallery', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { title, subtitle, category, mediaUrl, mediaType, cloudinaryPublicId, featured } =
        req.body || {};
      if (!title || !subtitle || !mediaUrl) {
        return res.status(400).json({
          error: 'Title, subtitle, and media URL are required for gallery items.',
        });
      }
      const created = await createGalleryItemRecord({
        title: String(title).trim(),
        subtitle: String(subtitle).trim(),
        category: category ? String(category).trim() : 'PACKAGING',
        mediaUrl: String(mediaUrl).trim(),
        mediaType: mediaType === 'video' ? 'video' : 'image',
        cloudinaryPublicId: cloudinaryPublicId ? String(cloudinaryPublicId) : undefined,
        featured: featured ?? true,
      });
      res.status(201).json({ item: created });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to add gallery item' });
    }
  });

  app.patch('/api/admin/gallery/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      const updated = await updateGalleryItemRecord(id, req.body || {});
      res.json({ item: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update gallery item' });
    }
  });

  app.delete('/api/admin/gallery/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      await deleteGalleryItemRecord(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete gallery item' });
    }
  });

  // Cloudinary Signed Upload Endpoint (Setupgram Pattern)
  app.get('/api/admin/cloudinary-signature', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const cloudName = getRealEnv('CLOUDINARY_CLOUD_NAME');
      const apiKey = getRealEnv('CLOUDINARY_API_KEY');
      const apiSecret = getRealEnv('CLOUDINARY_API_SECRET');

      if (!cloudName || !apiKey || !apiSecret) {
        return res.json({
          configured: false,
          message:
            'Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not set. Using direct media storage.',
        });
      }

      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      const timestamp = Math.round(Date.now() / 1000);
      const folder = 'jvwallcare/media';
      const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);

      res.json({
        configured: true,
        timestamp,
        signature,
        folder,
        cloudName,
        apiKey,
      });
    } catch (error: any) {
      console.error('Cloudinary signature error:', error);
      res.status(500).json({ error: 'Failed to generate Cloudinary signature' });
    }
  });

  // ============================================================================
  // 5. VITE DEV MIDDLEWARE / PRODUCTION STATIC ASSETS
  // ============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`J.V. Wall Care Udyog server running on http://localhost:${PORT}`);
  });
}

startServer();
