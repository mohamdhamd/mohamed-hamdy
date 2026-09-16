// مسارات مشاريع البورتفوليو مع الدعم التلقائي المزدوج (MongoDB + Memory Fallback)
import express from 'express';
import { Project } from '../models/Project.js';
import { requireAuth } from '../middleware/auth.js';
import { isMongoDBConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

const router = express.Router();

// استرجاع جميع المشاريع
router.get('/', async (req, res) => {
  try {
    const { all, category } = req.query;

    if (isMongoDBConnected()) {
      try {
        const filter = {};
        if (all !== 'true') filter.status = 'published';
        if (category && category !== 'all') filter.category = category;

        const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
        return res.json({ success: true, count: projects.length, data: projects });
      } catch (dbErr) {
        console.warn('MongoDB projects fetch failed, fallback to memory:', dbErr.message);
      }
    }

    // Fallback: استخدام الذاكرة المحلية
    let projects = [...memoryStore.projects];
    if (all !== 'true') {
      projects = projects.filter((p) => (p.status || 'published') === 'published');
    }
    if (category && category !== 'all') {
      projects = projects.filter((p) => p.category === category);
    }
    projects.sort((a, b) => a.order - b.order);

    return res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return res.status(500).json({ success: false, message: 'تعذر جلب المشاريع' });
  }
});

// استرجاع مشروع فردي بالمعرف
router.get('/:id', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const project = await Project.findOne({ id: req.params.id });
        if (project) return res.json({ success: true, data: project });
      } catch (dbErr) {
        console.warn('DB get project failed, fallback:', dbErr.message);
      }
    }

    const project = memoryStore.projects.find((p) => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'المشروع غير موجود' });
    }
    return res.json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر جلب المشروع' });
  }
});

// إضافة مشروع جديد (يتطلب صلاحية الأدمن)
router.post('/', requireAuth, async (req, res) => {
  try {
    const projectData = { ...req.body };

    // توليد معرف فريد إذا لم يرسل
    if (!projectData.id) {
      const baseSlug = (projectData.title_en || projectData.title_ar || 'project')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      projectData.id = `${baseSlug}-${Date.now().toString(36)}`;
    }

    if (projectData.order === undefined || projectData.order === null) {
      projectData.order = memoryStore.projects.length + 1;
    }

    if (isMongoDBConnected()) {
      try {
        const existing = await Project.findOne({ id: projectData.id });
        if (existing) projectData.id = `${projectData.id}-${Date.now().toString(36)}`;
        const newProject = await Project.create(projectData);
        // تحديث الذاكرة أيضاً
        memoryStore.projects.push(newProject.toObject());
        return res.status(201).json({ success: true, message: 'تم إضافة المشروع بنجاح', data: newProject });
      } catch (dbErr) {
        console.warn('DB create project failed, saving to memory:', dbErr.message);
      }
    }

    // حفظ في الذاكرة
    memoryStore.projects.push(projectData);
    return res.status(201).json({
      success: true,
      message: 'تم إضافة المشروع بنجاح (وضع الذاكرة)',
      data: projectData,
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ success: false, message: error.message || 'تعذر إنشاء المشروع' });
  }
});

// تعديل مشروع قائم (يتطلب صلاحية الأدمن)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      try {
        const updated = await Project.findOneAndUpdate({ id }, req.body, {
          new: true,
          runValidators: true,
        });
        if (updated) {
          const idx = memoryStore.projects.findIndex((p) => p.id === id);
          if (idx !== -1) memoryStore.projects[idx] = updated.toObject();
          return res.json({ success: true, message: 'تم تعديل المشروع بنجاح', data: updated });
        }
      } catch (dbErr) {
        console.warn('DB update project failed, fallback:', dbErr.message);
      }
    }

    const idx = memoryStore.projects.findIndex((p) => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'المشروع غير موجود' });
    }
    memoryStore.projects[idx] = { ...memoryStore.projects[idx], ...req.body };
    return res.json({ success: true, message: 'تم تعديل المشروع بنجاح', data: memoryStore.projects[idx] });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ success: false, message: 'تعذر تعديل بيانات المشروع' });
  }
});

// تحديث ترتيب مجموعة مشاريع (Drag to reorder)
router.put('/reorder/batch', requireAuth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'تنسيق البيانات غير صحيح' });
    }

    if (isMongoDBConnected()) {
      try {
        const updates = items.map((item) =>
          Project.updateOne({ id: item.id }, { $set: { order: item.order } })
        );
        await Promise.all(updates);
      } catch (dbErr) {
        console.warn('DB reorder failed, fallback:', dbErr.message);
      }
    }

    for (const item of items) {
      const p = memoryStore.projects.find((proj) => proj.id === item.id);
      if (p) p.order = item.order;
    }

    return res.json({ success: true, message: 'تم تحديث ترتيب المشاريع بنجاح' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'تعذر إعادة ترتيب المشاريع' });
  }
});

// حذف مشروع (يتطلب صلاحية الأدمن)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      try {
        await Project.findOneAndDelete({ id });
      } catch (dbErr) {
        console.warn('DB delete failed, fallback:', dbErr.message);
      }
    }

    const initialLen = memoryStore.projects.length;
    memoryStore.projects = memoryStore.projects.filter((p) => p.id !== id);

    return res.json({ success: true, message: 'تم حذف المشروع بنجاح' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ success: false, message: 'تعذر حذف المشروع' });
  }
});

export default router;
