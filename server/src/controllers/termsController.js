import Term from '../models/Term.js';
import { logAdminAction } from '../services/auditService.js';

export const getPublicTerms = async (req, res, next) => {
  try {
    const terms = await Term.find({ isDeleted: false, status: 'published' }).lean();
    const data = {};
    terms.forEach(t => {
      data[t.key] = t.content;
    });

    data.lastUpdated = terms[0]?.lastUpdated || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPublicTermByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    let key = type;
    if (type === 'terms' || type === 'terms-of-service') key = 'termsOfService';
    else if (type === 'privacy' || type === 'privacy-policy') key = 'privacyPolicy';
    else if (type === 'refund' || type === 'refund-policy' || type === 'cancellation') key = 'refundPolicy';

    const term = await Term.findOne({ key, isDeleted: false, status: 'published' }).lean();
    if (!term) {
      return res.status(404).json({ success: false, message: 'Policy document not found' });
    }

    return res.json({
      success: true,
      data: {
        type,
        title: term.title,
        content: term.content,
        lastUpdated: term.lastUpdated,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const adminGetTerms = async (req, res, next) => {
  try {
    const terms = await Term.find({ isDeleted: false }).lean();
    const data = {};
    terms.forEach(t => {
      data[t.key] = t.content;
    });
    data.lastUpdated = terms[0]?.lastUpdated || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateTerms = async (req, res, next) => {
  try {
    const body = req.body || {};
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });

    for (const [key, content] of Object.entries(body)) {
      if (key === 'lastUpdated') continue;
      await Term.findOneAndUpdate(
        { key },
        {
          $set: {
            content,
            lastUpdated,
            updatedBy: req.user?._id || null,
          }
        },
        { upsert: true }
      );
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'UPDATE_TERMS',
      resource: 'Term',
      description: 'Updated platform terms and legal policies',
    });

    const updated = await Term.find({ isDeleted: false }).lean();
    const responseData = {};
    updated.forEach(t => { responseData[t.key] = t.content; });
    responseData.lastUpdated = lastUpdated;

    return res.json({
      success: true,
      message: 'Terms and legal policies saved to MongoDB successfully',
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
