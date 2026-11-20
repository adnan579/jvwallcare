import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Image as ImageIcon,
  Lock,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Phone,
  Building2,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Pencil,
  Eye,
  EyeOff,
  Copy,
  X,
  Save,
  FileEdit,
} from 'lucide-react';
import { BRAND_ASSETS } from '../data/products';

interface InquiryItem {
  id: number;
  referenceId: string;
  inquiryType: 'ORDER_INQUIRY' | 'DEALERSHIP_APPLICATION';
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST';
  fullName: string;
  firmName?: string | null;
  phone: string;
  email?: string | null;
  location: string;
  buildingSegment?: string | null;
  selectedProduct?: string | null;
  quantityOrTarget: string;
  godownAreaSqFt?: string | null;
  affiliationTier?: string | null;
  message?: string | null;
  adminNotes?: string | null;
  createdAt?: string;
}

interface BlogItem {
  id: number;
  slug: string;
  title: string;
  hindiSubtitle?: string | null;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string;
  mediaType: string;
  authorName: string;
  readTimeMinutes: number;
  seoKeywords?: string | null;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt?: string;
}

interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  mediaUrl: string;
  mediaType: string;
  featured: boolean;
  createdAt?: string;
}

interface AdminOverview {
  totalLeads: number;
  statusCounts: Record<string, number>;
  publishedBlogs: number;
  draftBlogs: number;
  totalGalleryItems: number;
  publishedGalleryItems?: number;
  draftGalleryItems?: number;
  recentLeads: InquiryItem[];
  recentBlogs: BlogItem[];
}

interface AdminPageProps {
  onBackToSite: () => void;
}

const STATUS_BADGE: Record<string, string> = {
  NEW: 'bg-teal-50 dark:bg-teal-950/70 text-[#06686B] dark:text-teal-300 border-teal-200 dark:border-teal-800',
  CONTACTED:
    'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  CONVERTED:
    'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  LOST: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToSite }) => {
  // Tab-scoped session token so page reloads preserve admin login until Sign Out
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('jv_admin_token');
    } catch {
      return null;
    }
  });
  const [adminEmailDisplay, setAdminEmailDisplay] = useState<string>(() => {
    try {
      return sessionStorage.getItem('jv_admin_email') || '';
    } catch {
      return '';
    }
  });

  // Bootstrap & Login state (Vercel ADMIN_EMAIL & ADMIN_PASSWORD or Bootstrap)
  const [checkingBootstrap, setCheckingBootstrap] = useState<boolean>(true);
  const [isBootstrapped, setIsBootstrapped] = useState<boolean>(false);
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('j.v.wallcare01@gmail.com');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);

  // Admin navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'blogs' | 'gallery'>(
    'overview'
  );

  // Data state
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [actionBanner, setActionBanner] = useState<string | null>(null);

  // CRM Filters
  const [leadTypeFilter, setLeadTypeFilter] = useState<
    'ALL' | 'ORDER_INQUIRY' | 'DEALERSHIP_APPLICATION'
  >('ALL');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('ALL');
  const [leadSearch, setLeadSearch] = useState<string>('');

  // Blog CMS Editor State (Create + Edit + Draft/Publish)
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogHindiSubtitle, setBlogHindiSubtitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Product Selection Guide');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCoverUrl, setBlogCoverUrl] = useState<string>(BRAND_ASSETS.dualBagsMockup);
  const [blogMediaType, setBlogMediaType] = useState<'image' | 'video'>('image');
  const [blogReadTime, setBlogReadTime] = useState('4');
  const [blogKeywords, setBlogKeywords] = useState(
    'JV Wall Putty, 40kg Waterproof Putty, Bhadohi UP'
  );
  const [blogStatus, setBlogStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [blogFilterStatus, setBlogFilterStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [blogSearch, setBlogSearch] = useState('');
  const [confirmDeleteBlogId, setConfirmDeleteBlogId] = useState<number | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Gallery CMS Editor State (Create + Edit + Publish/Unpublish Draft)
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [gallerySubtitle, setGallerySubtitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('PACKAGING');
  const [galleryMediaUrl, setGalleryMediaUrl] = useState<string>(BRAND_ASSETS.realBagPhoto);
  const [galleryMediaType, setGalleryMediaType] = useState<'image' | 'video'>('image');
  const [galleryFeatured, setGalleryFeatured] = useState<boolean>(true);
  const [galleryFilterStatus, setGalleryFilterStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>(
    'ALL'
  );
  const [galleryFilterCategory, setGalleryFilterCategory] = useState<string>('ALL');
  const [confirmDeleteGalleryId, setConfirmDeleteGalleryId] = useState<number | null>(null);

  // Check Bootstrap Status on mount
  useEffect(() => {
    let active = true;
    fetch('/api/admin/bootstrap-status')
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          throw new Error('Admin API endpoint returned an unexpected response.');
        }
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setIsBootstrapped(Boolean(data.isBootstrapped));
        if (data.emailHint) setEmailInput(data.emailHint);
        setCloudinaryConfigured(Boolean(data.cloudinaryConfigured));
      })
      .catch(() => {
        if (!active) return;
        // Default safely to Sign In form (e.g., if ADMIN_EMAIL/ADMIN_PASSWORD are configured)
        setIsBootstrapped(true);
        setAuthError(
          'Unable to verify server bootstrap status. Ensure /api serverless routes are active on your deployment.'
        );
      })
      .finally(() => {
        if (active) setCheckingBootstrap(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const fetchAdminData = useCallback(async (token: string) => {
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [ovRes, inqRes, blogRes, galRes] = await Promise.all([
        fetch('/api/admin/overview', { headers }),
        fetch('/api/admin/inquiries', { headers }),
        fetch('/api/admin/blogs', { headers }),
        fetch('/api/admin/gallery', { headers }),
      ]);

      if (ovRes.status === 401 || inqRes.status === 401) {
        setAuthToken(null);
        try {
          sessionStorage.removeItem('jv_admin_token');
          sessionStorage.removeItem('jv_admin_email');
        } catch {
          // Ignore
        }
        return;
      }

      if (ovRes.ok) {
        const ovData = await ovRes.json();
        setOverview(ovData);
      }
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData.inquiries || []);
      }
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setBlogs(blogData.blogs || []);
      }
      if (galRes.ok) {
        const galData = await galRes.json();
        setGallery(galData.gallery || []);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchAdminData(authToken);
    }
  }, [authToken, fetchAdminData]);

  // Handle Admin Bootstrap Setup
  const handleBootstrapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!emailInput || !passwordInput || passwordInput.length < 6) {
      setAuthError('Please enter a valid admin email and a password of at least 6 characters.');
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setAuthError('Passwords do not match. Please confirm your admin password.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Failed to bootstrap admin account.');
        return;
      }
      setIsBootstrapped(true);
      const emailVal = data.admin?.email || emailInput;
      setAdminEmailDisplay(emailVal);
      setAuthToken(data.token);
      try {
        sessionStorage.setItem('jv_admin_token', data.token);
        sessionStorage.setItem('jv_admin_email', emailVal);
      } catch {
        // Ignore storage errors
      }
    } catch {
      setAuthError('Network error while bootstrapping admin credentials.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle Admin Email + Password Sign-In (Vercel ADMIN_EMAIL & ADMIN_PASSWORD or Bootstrap)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput || !passwordInput) {
      setAuthError('Please enter both your admin email and password.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Invalid admin email or password.');
        return;
      }
      const emailVal = data.admin?.email || emailInput;
      setAdminEmailDisplay(emailVal);
      setAuthToken(data.token);
      try {
        sessionStorage.setItem('jv_admin_token', data.token);
        sessionStorage.setItem('jv_admin_email', emailVal);
      } catch {
        // Ignore storage errors
      }
    } catch {
      setAuthError('Network error during login.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setPasswordInput('');
    try {
      sessionStorage.removeItem('jv_admin_token');
      sessionStorage.removeItem('jv_admin_email');
    } catch {
      // Ignore
    }
  };

  // Signed Cloudinary Upload (Setupgram Pattern) with automatic local DataURL fallback
  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string, mediaType: 'image' | 'video') => void
  ) => {
    if (!authToken) return;
    setUploadingMedia(true);
    const detectedType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';

    try {
      const sigRes = await fetch('/api/admin/cloudinary-signature', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const sigData = await sigRes.json();

      if (sigData.configured && sigData.signature && sigData.cloudName && sigData.apiKey) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', sigData.apiKey);
        formData.append('timestamp', String(sigData.timestamp));
        formData.append('signature', sigData.signature);
        formData.append('folder', sigData.folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const uploadJson = await uploadRes.json();
        if (uploadRes.ok && uploadJson.secure_url) {
          onSuccess(uploadJson.secure_url, detectedType);
          setActionBanner('Uploaded media directly to Cloudinary CDN.');
          setUploadingMedia(false);
          return;
        }
      }

      // Fallback: Read as Data URL if Cloudinary keys are not yet set in environment
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSuccess(reader.result, detectedType);
          setActionBanner('Media attached ready for publishing.');
        }
        setUploadingMedia(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingMedia(false);
    }
  };

  // ============================================================================
  // CRM INQUIRY CONTROLS
  // ============================================================================
  const handleUpdateInquiryStatus = async (id: number, status: string, adminNotes?: string) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (res.ok) {
        setActionBanner(`Inquiry #${id} updated to ${status}.`);
        fetchAdminData(authToken);
      }
    } catch {
      // Ignore
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setActionBanner(`Inquiry #${id} deleted.`);
        fetchAdminData(authToken);
      }
    } catch {
      // Ignore
    }
  };

  // ============================================================================
  // BLOG CMS CONTROLS (CREATE, EDIT, SAVE AS DRAFT, PUBLISH/UNPUBLISH, DUPLICATE, DELETE)
  // ============================================================================
  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogHindiSubtitle('');
    setBlogCategory('Product Selection Guide');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCoverUrl(BRAND_ASSETS.dualBagsMockup);
    setBlogMediaType('image');
    setBlogReadTime('4');
    setBlogKeywords('JV Wall Putty, 40kg Waterproof Putty, Bhadohi UP');
    setBlogStatus('PUBLISHED');
  };

  const handleStartEditBlog = (post: BlogItem) => {
    setEditingBlogId(post.id);
    setBlogTitle(post.title);
    setBlogHindiSubtitle(post.hindiSubtitle || '');
    setBlogCategory(post.category);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogCoverUrl(post.coverImageUrl);
    setBlogMediaType(post.mediaType === 'video' ? 'video' : 'image');
    setBlogReadTime(String(post.readTimeMinutes || 4));
    setBlogKeywords(post.seoKeywords || 'JV Wall Putty, 40kg Waterproof Putty, Bhadohi UP');
    setBlogStatus(post.status);
    setActionBanner(`Editing Blog Article "${post.title}" — make changes and click Save.`);
  };

  const handleSaveBlog = async (
    e: React.FormEvent,
    overrideStatus?: 'PUBLISHED' | 'DRAFT'
  ) => {
    e.preventDefault();
    if (!authToken || !blogTitle || !blogExcerpt || !blogContent) return;

    const targetStatus = overrideStatus || blogStatus;

    try {
      if (editingBlogId !== null) {
        // Update existing blog post
        const res = await fetch(`/api/admin/blogs/${editingBlogId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: blogTitle,
            hindiSubtitle: blogHindiSubtitle,
            category: blogCategory,
            excerpt: blogExcerpt,
            content: blogContent,
            coverImageUrl: blogCoverUrl,
            mediaType: blogMediaType,
            readTimeMinutes: Number(blogReadTime) || 4,
            seoKeywords: blogKeywords,
            status: targetStatus,
          }),
        });
        if (res.ok) {
          setActionBanner(
            `Updated blog article "${blogTitle}" (${
              targetStatus === 'PUBLISHED' ? 'Live on About Page' : 'Saved as Draft'
            }).`
          );
          resetBlogForm();
          fetchAdminData(authToken);
        }
      } else {
        // Create new blog post
        const res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: blogTitle,
            hindiSubtitle: blogHindiSubtitle,
            category: blogCategory,
            excerpt: blogExcerpt,
            content: blogContent,
            coverImageUrl: blogCoverUrl,
            mediaType: blogMediaType,
            readTimeMinutes: Number(blogReadTime) || 4,
            seoKeywords: blogKeywords,
            status: targetStatus,
          }),
        });
        if (res.ok) {
          setActionBanner(
            targetStatus === 'PUBLISHED'
              ? 'Blog article published and live on the About Page.'
              : 'Blog article saved as a Draft in CMS.'
          );
          resetBlogForm();
          fetchAdminData(authToken);
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleToggleBlogStatus = async (blog: BlogItem) => {
    if (!authToken) return;
    const nextStatus = blog.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setActionBanner(
          nextStatus === 'PUBLISHED'
            ? `Published "${blog.title}" live to the About Page.`
            : `Unpublished "${blog.title}" (moved to Drafts).`
        );
        fetchAdminData(authToken);
      }
    } catch {
      // Ignore
    }
  };

  const handleDuplicateBlogAsDraft = async (blog: BlogItem) => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: `${blog.title} (Copy)`,
          hindiSubtitle: blog.hindiSubtitle || '',
          category: blog.category,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImageUrl: blog.coverImageUrl,
          mediaType: blog.mediaType,
          readTimeMinutes: blog.readTimeMinutes,
          seoKeywords: blog.seoKeywords || '',
          status: 'DRAFT',
        }),
      });
      if (res.ok) {
        setActionBanner(`Duplicated "${blog.title}" as a new Draft.`);
        fetchAdminData(authToken);
      }
    } catch {
      // Ignore
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        if (editingBlogId === id) resetBlogForm();
        setConfirmDeleteBlogId(null);
        setActionBanner('Blog article permanently deleted.');
        fetchAdminData(authToken);
      }
    } catch {
      // Ignore
    }
  };

  // ============================================================================
  // GALLERY CMS CONTROLS (CREATE, EDIT, PUBLISH/UNPUBLISH DRAFT, DUPLICATE, DELETE)
  // ============================================================================
  const resetGalleryForm = () => {
    setEditingGalleryId(null);
    setGalleryTitle('');
    setGallerySubtitle('');
    setGalleryCategory('PACKAGING');
    setGalleryMediaUrl(BRAND_ASSETS.realBagPhoto);
    setGalleryMediaType('image');
    setGalleryFeatured(true);
  };

  const handleStartEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setGalleryTitle(item.title);
    setGallerySubtitle(item.subtitle);
    setGalleryCategory(item.category);
    setGalleryMediaUrl(item.mediaUrl);
    setGalleryMediaType(item.mediaType === 'video' ? 'video' : 'image');
    setGalleryFeatured(Boolean(item.featured));
    setActionBanner(`Editing Gallery Item "${item.title}" — make changes and click Save.`);
  };

  const handleSaveGalleryItem = async (e: React.FormEvent, overrideFeatured?: boolean) => {
    e.preventDefault();
    if (!authToken || !galleryTitle || !gallerySubtitle || !galleryMediaUrl) return;

    const targetFeatured = overrideFeatured !== undefined ? overrideFeatured : galleryFeatured;

    try {
      if (editingGalleryId !== null) {
        const res = await fetch(`/api/admin/gallery/${editingGalleryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: galleryTitle,
            subtitle: gallerySubtitle,
            category: galleryCategory,
            mediaUrl: galleryMediaUrl,
            mediaType: galleryMediaType,
            featured: targetFeatured,
          }),
        });
        if (res.ok) {
          setActionBanner(
            `Updated gallery item "${galleryTitle}" (${
              targetFeatured ? 'Published Live' : 'Saved as Unpublished Draft'
            }).`
          );
          resetGalleryForm();
          fetchAdminData(authToken);
        }
      } else {
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: galleryTitle,
            subtitle: gallerySubtitle,
            category: galleryCategory,
            mediaUrl: galleryMediaUrl,
            mediaType: galleryMediaType,
            featured: targetFeatured,
          }),
        });
        if (res.ok) {
          setActionBanner(
            targetFeatured
              ? 'Gallery item published to About Page.'
              : 'Gallery item saved as Draft (Unpublished).'
          );
          resetGalleryForm();
          fetchAdminData(authToken);
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleToggleGalleryFeatured = async (item: GalleryItem) => {
    if (!authToken) return;
    const nextFeatured = !item.featured;
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      if (res.ok) {
        setActionBanner(
          nextFeatured
            ? `Published "${item.title}" to the public About Page Gallery.`
            : `Unpublished "${item.title}" (hidden as Draft in Gallery CMS).`
        );
        fetchAdminData(authToken);
      }
    } catch {
      // Ignore
    }
  };

  const handleDuplicateGalleryItemAsDraft = async (item: GalleryItem) => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: `${item.title} (Copy)`,
          subtitle: item.subtitle,
          category: item.category,
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          featured: false,
        }),
      });
      if (res.ok) {
        setActionBanner(`Duplicated "${item.title}" as an Unpublished Draft.`);
        fetchAdminData(authToken);
      }
    } catch {
      // Ignore
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        if (editingGalleryId === id) resetGalleryForm();
        setConfirmDeleteGalleryId(null);
        setActionBanner('Gallery item permanently deleted.');
        fetchAdminData(authToken);
      }
    } catch {
      // Ignore
    }
  };

  // Filtered Lists
  const filteredLeads = inquiries.filter((inq) => {
    if (leadTypeFilter !== 'ALL' && inq.inquiryType !== leadTypeFilter) return false;
    if (leadStatusFilter !== 'ALL' && inq.status !== leadStatusFilter) return false;
    if (leadSearch.trim()) {
      const q = leadSearch.toLowerCase();
      return (
        inq.fullName.toLowerCase().includes(q) ||
        (inq.firmName || '').toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q) ||
        inq.referenceId.toLowerCase().includes(q) ||
        inq.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredBlogs = blogs.filter((b) => {
    if (blogFilterStatus !== 'ALL' && b.status !== blogFilterStatus) return false;
    if (blogSearch.trim()) {
      const q = blogSearch.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        (b.hindiSubtitle || '').toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredGallery = gallery.filter((g) => {
    if (galleryFilterStatus === 'PUBLISHED' && !g.featured) return false;
    if (galleryFilterStatus === 'DRAFT' && g.featured) return false;
    if (galleryFilterCategory !== 'ALL' && g.category !== galleryFilterCategory) return false;
    return true;
  });

  // ============================================================================
  // RENDER 1: ADMIN EMAIL & PASSWORD GATE (VERCEL ENV OR BOOTSTRAP)
  // ============================================================================
  if (!authToken) {
    return (
      <div className="min-h-[82vh] bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-10 rounded-xl overflow-hidden bg-[#f7f7f5] border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="J.V. Wall Care Udyog"
                  className="w-[125%] h-full max-w-none object-cover object-[56%_48%]"
                />
              </div>
              <div>
                <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold block">
                  J.V. Wall Care Udyog · /admin
                </span>
                <h1 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                  {checkingBootstrap
                    ? 'Checking Admin Security...'
                    : isBootstrapped
                    ? 'Admin CRM & CMS Sign In'
                    : 'First-Time Admin Bootstrap'}
                </h1>
              </div>
            </div>
            <Lock className="w-5 h-5 text-[#06686B] dark:text-teal-400 shrink-0" />
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {!checkingBootstrap && !isBootstrapped ? (
            <form onSubmit={handleBootstrapSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Admin Email &amp; Password Protection</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Set your master Admin Email and Password here, or configure{' '}
                  <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> directly in your Vercel
                  Environment Variables.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="bootstrap-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Admin Email Address
                </label>
                <input
                  id="bootstrap-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="bootstrap-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Create Admin Password (min. 6 chars)
                </label>
                <input
                  id="bootstrap-password"
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter strong admin password"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="bootstrap-confirm"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirm Admin Password
                </label>
                <input
                  id="bootstrap-confirm"
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter admin password"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full min-h-[48px] py-3 px-5 text-sm font-semibold text-white bg-[#06686B] hover:bg-[#055255] rounded-xl cursor-pointer"
              >
                {authSubmitting
                  ? 'Bootstrapping Admin...'
                  : 'Complete Admin Bootstrap & Enter Dashboard'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                Sign in with your <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code>{' '}
                configured in Vercel Environment Variables.
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Admin Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Admin Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full min-h-[48px] py-3 px-5 text-sm font-semibold text-white bg-[#06686B] hover:bg-[#055255] rounded-xl cursor-pointer"
              >
                {authSubmitting ? 'Verifying Credentials...' : 'Sign In to Admin Portal'}
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onBackToSite}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to J.V. Wall Care Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER 2: AUTHENTICATED SETUPGRAM-STYLE ADMIN SHELL & CRM/CMS WORKSPACE
  // ============================================================================
  const totalLeads = overview?.totalLeads ?? inquiries.length;
  const convertedCount = overview?.statusCounts?.CONVERTED ?? 0;
  const activePipelineCount =
    (overview?.statusCounts?.NEW ?? 0) + (overview?.statusCounts?.CONTACTED ?? 0);
  const publishedBlogsCount = blogs.filter((b) => b.status === 'PUBLISHED').length;
  const draftBlogsCount = blogs.filter((b) => b.status === 'DRAFT').length;
  const publishedGalleryCount = gallery.filter((g) => g.featured).length;
  const draftGalleryCount = gallery.filter((g) => !g.featured).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Admin Header Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-10 rounded-xl bg-[#06686B] text-white flex items-center justify-center font-display font-extrabold text-sm shrink-0">
              JV
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  J.V. Wall Care Admin CRM &amp; CMS
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono-tabular font-bold bg-teal-50 dark:bg-teal-950 text-[#06686B] dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-md">
                  {adminEmailDisplay || 'Authenticated Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage 40 kg Wall Putty customer orders, dealership applications, technical blogs,
                and Cloudinary gallery media.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchAdminData(authToken)}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={onBackToSite}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Setupgram AdminShell Pattern) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'leads', label: `CRM Inquiries (${inquiries.length})`, icon: Users },
            { id: 'blogs', label: `Blog CMS (${blogs.length})`, icon: FileText },
            { id: 'gallery', label: `Gallery CMS (${gallery.length})`, icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[46px] px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-[#06686B] text-white border-[#06686B] shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-600'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {actionBanner && (
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200">
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#06686B] dark:text-teal-400 shrink-0" />
              <span>{actionBanner}</span>
            </span>
            <button
              type="button"
              onClick={() => setActionBanner(null)}
              className="text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Total CRM Inquiries
                </span>
                <p className="text-3xl font-extrabold font-mono-tabular text-slate-900 dark:text-white">
                  {totalLeads}
                </p>
                <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                  Customer Orders + Dealerships
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Active Pipeline
                </span>
                <p className="text-3xl font-extrabold font-mono-tabular text-amber-600 dark:text-amber-400">
                  {activePipelineCount}
                </p>
                <p className="text-[11px] text-slate-500">New + Contacted Leads</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Converted Dispatches
                </span>
                <p className="text-3xl font-extrabold font-mono-tabular text-emerald-600 dark:text-emerald-400">
                  {convertedCount}
                </p>
                <p className="text-[11px] text-slate-500">
                  {totalLeads ? Math.round((convertedCount / totalLeads) * 100) : 0}% conversion
                  rate
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  CMS Content Status
                </span>
                <p className="text-3xl font-extrabold font-mono-tabular text-[#06686B] dark:text-teal-400">
                  {publishedBlogsCount} Live
                </p>
                <p className="text-[11px] text-slate-500">
                  {draftBlogsCount} Draft Blogs · {publishedGalleryCount} Live / {draftGalleryCount}{' '}
                  Draft Gallery
                </p>
              </div>
            </div>

            {/* Recent Inquiries & Recent Blogs Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Recent Order &amp; Dealership Inquiries
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('leads')}
                    className="text-xs font-semibold text-[#06686B] dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Manage All ({inquiries.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {inquiries.slice(0, 5).map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-tabular font-bold text-[#06686B] dark:text-teal-400">
                            {lead.referenceId}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {lead.fullName}
                          </span>
                          {lead.firmName && (
                            <span className="text-slate-500">({lead.firmName})</span>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          {lead.quantityOrTarget} · {lead.location} · {lead.phone}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-[11px] font-mono-tabular font-bold rounded-md border self-start sm:self-center ${
                          STATUS_BADGE[lead.status] || STATUS_BADGE.NEW
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Technical Blog Articles
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('blogs')}
                    className="text-xs font-semibold text-[#06686B] dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Open Blog CMS →
                  </button>
                </div>

                <div className="space-y-3">
                  {blogs.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {b.title}
                        </p>
                        <p className="text-slate-500 truncate mt-0.5">
                          {b.category} · {b.readTimeMinutes} min read
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-1 text-[10px] font-mono-tabular font-bold rounded-md ${
                            b.status === 'PUBLISHED'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {b.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('blogs');
                            handleStartEditBlog(b);
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#06686B] rounded-md cursor-pointer"
                          title="Edit Article"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CRM LEADS & INQUIRY PIPELINE */}
        {activeTab === 'leads' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Customer Order &amp; Dealership Inquiry Pipeline
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update lead statuses (NEW → CONTACTED → CONVERTED → LOST) and log factory dispatch
                  notes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Filter by inquiry type"
                  value={leadTypeFilter}
                  onChange={(e) => setLeadTypeFilter(e.target.value as any)}
                  className="min-h-[40px] px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                >
                  <option value="ALL">All Types ({inquiries.length})</option>
                  <option value="ORDER_INQUIRY">40 kg Bag Orders</option>
                  <option value="DEALERSHIP_APPLICATION">Dealership Applications</option>
                </select>

                <select
                  aria-label="Filter by lead status"
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="min-h-[40px] px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="LOST">LOST</option>
                </select>

                <input
                  type="search"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Search name, phone, district..."
                  className="min-h-[40px] px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 text-[11px] font-mono-tabular font-bold bg-[#0B3B68] text-white rounded-md">
                          {lead.referenceId}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-semibold bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 rounded-md">
                          {lead.inquiryType === 'DEALERSHIP_APPLICATION'
                            ? 'Dealership Affiliation'
                            : '40 kg Putty Order'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {lead.fullName}
                        </h3>
                        {lead.firmName && (
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-teal-600" />
                            <span>{lead.firmName}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1 font-mono-tabular font-bold text-[#06686B] dark:text-teal-400 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{lead.phone}</span>
                        </a>
                        <span>Location: {lead.location}</span>
                        <span>
                          Volume/Qty: <strong>{lead.quantityOrTarget}</strong>
                        </span>
                        {lead.selectedProduct && <span>Pack: {lead.selectedProduct}</span>}
                        {lead.affiliationTier && <span>Tier: {lead.affiliationTier}</span>}
                        {lead.godownAreaSqFt && <span>Godown: {lead.godownAreaSqFt} sq.ft.</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <select
                        aria-label={`Status for ${lead.referenceId}`}
                        value={lead.status}
                        onChange={(e) =>
                          handleUpdateInquiryStatus(
                            lead.id,
                            e.target.value,
                            lead.adminNotes || undefined
                          )
                        }
                        className={`min-h-[38px] px-3 py-1.5 text-xs font-mono-tabular font-bold rounded-lg border cursor-pointer ${
                          STATUS_BADGE[lead.status] || STATUS_BADGE.NEW
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="LOST">LOST</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDeleteInquiry(lead.id)}
                        aria-label={`Delete inquiry ${lead.referenceId}`}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {lead.message && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
                      <strong>Customer / Dealer Note:</strong> {lead.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BLOG CMS (CREATE, EDIT, DRAFT, UNPUBLISH, DUPLICATE, DELETE) */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 6 Columns: Create or Edit Blog Post */}
            <form
              onSubmit={(e) => handleSaveBlog(e)}
              className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {editingBlogId !== null
                        ? `Edit Blog Article #${editingBlogId}`
                        : 'Publish New Technical Blog Article'}
                    </h2>
                    {editingBlogId !== null && (
                      <span className="px-2 py-0.5 text-[10px] font-mono-tabular font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded">
                        EDIT MODE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {editingBlogId !== null
                      ? 'Modify article content, cover media, or switch between Published and Draft.'
                      : 'Publish immediately to the About Page or save as a Draft for review.'}
                  </p>
                </div>

                {editingBlogId !== null && (
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Article Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="e.g., How to Prevent Monsoon Wall Dampness with J.V. Blue Pack Putty"
                  className="w-full min-h-[42px] px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Hindi Subtitle (हिंदी उपशीर्षक — Optional)
                </label>
                <input
                  type="text"
                  value={blogHindiSubtitle}
                  onChange={(e) => setBlogHindiSubtitle(e.target.value)}
                  placeholder="e.g., मानसून की सीलन से दीवारों की सुरक्षा कैसे करें"
                  className="w-full min-h-[42px] px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <input
                    type="text"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Read Time (Mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 text-xs font-mono-tabular bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Publication Status
                  </label>
                  <select
                    value={blogStatus}
                    onChange={(e) => setBlogStatus(e.target.value as 'PUBLISHED' | 'DRAFT')}
                    className="w-full min-h-[40px] px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live)</option>
                    <option value="DRAFT">DRAFT (Unpublished)</option>
                  </select>
                </div>
              </div>

              {/* Cover Media Upload (Cloudinary or Brand Asset) */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Cover Image or Video (Cloudinary Upload or URL)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#06686B] hover:bg-[#055255] rounded-lg cursor-pointer">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadingMedia ? 'Uploading...' : 'Upload Image/Video'}</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (url, type) => {
                            setBlogCoverUrl(url);
                            setBlogMediaType(type);
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={blogCoverUrl}
                  onChange={(e) => setBlogCoverUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/... or /assets/aistudio/..."
                  className="w-full px-3 py-2 text-xs font-mono-tabular bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Short Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="1–2 sentence summary for the blog card and SEO meta description..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Article Content *
                </label>
                <textarea
                  rows={5}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Write full technical article content..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target SEO Keywords
                </label>
                <input
                  type="text"
                  value={blogKeywords}
                  onChange={(e) => setBlogKeywords(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="submit"
                  className="min-h-[46px] py-2.5 px-4 text-xs sm:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {editingBlogId !== null ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Update Article</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>
                        {blogStatus === 'DRAFT' ? 'Save New Draft' : 'Publish Blog Article'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) =>
                    handleSaveBlog(
                      e as unknown as React.FormEvent,
                      blogStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
                    )
                  }
                  className="min-h-[46px] py-2.5 px-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileEdit className="w-4 h-4" />
                  <span>
                    {blogStatus === 'PUBLISHED' ? 'Save as Draft Instead' : 'Publish Live Instead'}
                  </span>
                </button>
              </div>
            </form>

            {/* Right 6 Columns: Existing Blog Posts Management List */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    Manage Blog Posts ({filteredBlogs.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Edit, Publish, Unpublish to Draft, Duplicate, or Delete articles.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Filter blogs by status"
                    value={blogFilterStatus}
                    onChange={(e) => setBlogFilterStatus(e.target.value as any)}
                    className="min-h-[36px] px-2.5 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  >
                    <option value="ALL">All ({blogs.length})</option>
                    <option value="PUBLISHED">Published ({publishedBlogsCount})</option>
                    <option value="DRAFT">Drafts ({draftBlogsCount})</option>
                  </select>

                  <input
                    type="search"
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    placeholder="Search blogs..."
                    className="min-h-[36px] px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredBlogs.map((post) => {
                  const isEditingThis = editingBlogId === post.id;
                  const isConfirmingDelete = confirmDeleteBlogId === post.id;
                  return (
                    <div
                      key={post.id}
                      className={`p-4 rounded-xl border space-y-3 ${
                        isEditingThis
                          ? 'bg-teal-50/50 dark:bg-teal-950/30 border-[#06686B]'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono-tabular font-bold rounded ${
                                post.status === 'PUBLISHED'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {post.status === 'PUBLISHED' ? 'PUBLISHED (LIVE)' : 'DRAFT (HIDDEN)'}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-mono-tabular font-bold bg-teal-50 dark:bg-teal-950 text-[#06686B] dark:text-teal-300 rounded">
                              {post.category}
                            </span>
                            <span className="text-[11px] font-mono-tabular text-slate-400">
                              {post.readTimeMinutes}m read
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {post.title}
                          </h3>
                          {post.hindiSubtitle && (
                            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                              {post.hindiSubtitle}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 line-clamp-2">{post.excerpt}</p>
                        </div>
                      </div>

                      {/* Action Toolbar: Edit | Publish/Unpublish | Duplicate | Delete */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/70">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditBlog(post)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:border-[#06686B] border border-slate-300 dark:border-slate-700 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 text-[#06686B]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleBlogStatus(post)}
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border inline-flex items-center gap-1.5 cursor-pointer ${
                              post.status === 'PUBLISHED'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                            }`}
                          >
                            {post.status === 'PUBLISHED' ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Unpublish (Draft)</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Publish Live</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicateBlogAsDraft(post)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                            title="Duplicate as Draft"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Duplicate</span>
                          </button>
                        </div>

                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeleteBlog(post.id)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteBlogId(null)}
                              className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteBlogId(post.id)}
                            aria-label={`Delete blog ${post.title}`}
                            className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY CMS (CREATE, EDIT, PUBLISH/UNPUBLISH DRAFT, DUPLICATE, DELETE) */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={(e) => handleSaveGalleryItem(e)}
              className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {editingGalleryId !== null
                        ? `Edit Gallery Item #${editingGalleryId}`
                        : 'Add Media to About Page Gallery'}
                    </h2>
                    {editingGalleryId !== null && (
                      <span className="px-2 py-0.5 text-[10px] font-mono-tabular font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded">
                        EDIT MODE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Upload packaging photos, plant videos, or catalog sheets via Cloudinary.
                  </p>
                </div>

                {editingGalleryId !== null && (
                  <button
                    type="button"
                    onClick={resetGalleryForm}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Gallery Title *
                </label>
                <input
                  type="text"
                  required
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  placeholder="e.g., 40 kg Truckload Dispatch at Gopiganj Plant"
                  className="w-full min-h-[42px] px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subtitle / Caption *
                </label>
                <input
                  type="text"
                  required
                  value={gallerySubtitle}
                  onChange={(e) => setGallerySubtitle(e.target.value)}
                  placeholder="e.g., Saripur, Gopiganj, Bhadohi (U.P.) - 221303"
                  className="w-full min-h-[42px] px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Gallery Category
                  </label>
                  <select
                    value={galleryCategory}
                    onChange={(e) => setGalleryCategory(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    <option value="PACKAGING">PACKAGING (40 kg Bags)</option>
                    <option value="PLANT">PLANT (Bhadohi Factory)</option>
                    <option value="POSTER">POSTER (Catalog Sheets)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Publication Status
                  </label>
                  <select
                    value={galleryFeatured ? 'PUBLISHED' : 'DRAFT'}
                    onChange={(e) => setGalleryFeatured(e.target.value === 'PUBLISHED')}
                    className="w-full min-h-[42px] px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live on /about)</option>
                    <option value="DRAFT">DRAFT (Hidden / Unpublished)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Media File (Cloudinary Image / Video)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#06686B] hover:bg-[#055255] rounded-lg cursor-pointer">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadingMedia ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (url, type) => {
                            setGalleryMediaUrl(url);
                            setGalleryMediaType(type);
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={galleryMediaUrl}
                  onChange={(e) => setGalleryMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-tabular bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="submit"
                  className="min-h-[46px] py-2.5 px-4 text-xs sm:text-sm font-semibold text-white bg-[#06686B] hover:bg-[#055255] rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {editingGalleryId !== null ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{galleryFeatured ? 'Publish to Gallery' : 'Save as Draft'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) =>
                    handleSaveGalleryItem(e as unknown as React.FormEvent, !galleryFeatured)
                  }
                  className="min-h-[46px] py-2.5 px-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileEdit className="w-4 h-4" />
                  <span>{galleryFeatured ? 'Save as Draft Instead' : 'Publish Live Instead'}</span>
                </button>
              </div>
            </form>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    Manage Gallery Items ({filteredGallery.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Edit captions, switch categories, unpublish to Draft, duplicate, or delete.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Filter gallery by status"
                    value={galleryFilterStatus}
                    onChange={(e) => setGalleryFilterStatus(e.target.value as any)}
                    className="min-h-[36px] px-2.5 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  >
                    <option value="ALL">All ({gallery.length})</option>
                    <option value="PUBLISHED">Published ({publishedGalleryCount})</option>
                    <option value="DRAFT">Draft / Hidden ({draftGalleryCount})</option>
                  </select>

                  <select
                    aria-label="Filter gallery by category"
                    value={galleryFilterCategory}
                    onChange={(e) => setGalleryFilterCategory(e.target.value)}
                    className="min-h-[36px] px-2.5 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="PACKAGING">PACKAGING</option>
                    <option value="PLANT">PLANT</option>
                    <option value="POSTER">POSTER</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredGallery.map((item) => {
                  const isEditingThis = editingGalleryId === item.id;
                  const isConfirmingDelete = confirmDeleteGalleryId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 ${
                        isEditingThis
                          ? 'bg-teal-50/50 dark:bg-teal-950/30 border-[#06686B]'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 shrink-0"
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 text-[9px] font-mono-tabular font-bold rounded ${
                                item.featured
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {item.featured ? 'PUBLISHED' : 'DRAFT / HIDDEN'}
                            </span>
                            <span className="text-[10px] font-mono-tabular font-bold text-orange-600 dark:text-orange-400">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle}</p>
                        </div>
                      </div>

                      {/* Gallery Item Control Bar: Edit | Publish/Unpublish | Duplicate | Delete */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/70">
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditGalleryItem(item)}
                            className="px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-[#06686B] rounded-md inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Pencil className="w-3 h-3 text-[#06686B]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleGalleryFeatured(item)}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-md border inline-flex items-center gap-1 cursor-pointer ${
                              item.featured
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            }`}
                          >
                            {item.featured ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Unpublish</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Publish</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicateGalleryItemAsDraft(item)}
                            className="px-2 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md inline-flex items-center gap-1 cursor-pointer"
                            title="Duplicate as Draft"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="px-2 py-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteGalleryId(null)}
                              className="px-1.5 py-1 text-[11px] text-slate-500 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteGalleryId(item.id)}
                            aria-label={`Delete gallery item ${item.title}`}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
