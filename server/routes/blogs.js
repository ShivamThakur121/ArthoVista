const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/blogs
// @desc    Get all published blogs (with category filter and search)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const query = {};

    // Filter by status (default to Published for public users)
    if (status) {
      query.status = status;
    } else {
      query.status = 'Published';
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { title: regex },
        { excerpt: regex },
        { category: regex },
        { keywords: regex }
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'fullName designation');

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/blogs/:slugOrId
// @desc    Get single blog by slug or ID
// @access  Public
router.get('/:slugOrId', async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let blog = await Blog.findOne({ slug: slugOrId }).populate('createdBy', 'fullName designation');

    if (!blog && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(slugOrId).populate('createdBy', 'fullName designation');
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found'
      });
    }

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog post
// @access  Private (Admin / Manager)
router.post('/', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    const {
      title,
      slug,
      category,
      readTime,
      author,
      featured,
      excerpt,
      metaDescription,
      keywords,
      tableOfContents,
      sections,
      bodyHtml,
      status
    } = req.body;

    if (!title || !excerpt) {
      return res.status(400).json({
        success: false,
        message: 'Title and excerpt are required'
      });
    }

    // Generate slug from title if not provided
    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check duplicate slug
    const existing = await Blog.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A blog with slug '${cleanSlug}' already exists. Please customize the slug.`
      });
    }

    const blog = await Blog.create({
      title,
      slug: cleanSlug,
      category: category || 'Government Schemes',
      readTime: readTime || '5 min read',
      author: author || req.user.fullName || 'ArthoVista Advisory Team',
      featured: Boolean(featured),
      excerpt,
      metaDescription: metaDescription || excerpt,
      keywords: Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',').map(k => k.trim()) : []),
      tableOfContents: tableOfContents || [],
      sections: sections || [],
      bodyHtml: bodyHtml || '',
      status: status || 'Published',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Blog article created and published successfully!',
      data: blog
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog post
// @access  Private (Admin / Manager)
router.put('/:id', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    if (req.body.slug && req.body.slug !== blog.slug) {
      const existing = await Blog.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Slug already taken by another article'
        });
      }
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post
// @access  Private (Admin / Manager)
router.delete('/:id', protect, authorize('Admin', 'Manager'), async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog article deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
