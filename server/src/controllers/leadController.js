import Lead from '../models/Lead.js';
import { logAdminAction } from '../services/auditService.js';

// Public Endpoint
export const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, city, serviceType, message, travellersCount, preferredDate } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Devotee name and phone number are required' });
    }

    const lead = await Lead.create({
      name,
      email: email || '',
      phone,
      city: city || '',
      serviceType: serviceType || 'General Pilgrimage',
      message: message || '',
      travellersCount: Number(travellersCount) || 1,
      preferredDate: preferredDate || '',
      status: 'new',
    });

    return res.status(201).json({
      success: true,
      message: 'Enquiry received. Our Pilgrim Coordinator will connect with you shortly.',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// Admin Endpoints
export const adminGetAllLeads = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { isDeleted: false };
    if (status) filter.status = status.toLowerCase();

    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
    const formatted = leads.map(l => ({
      ...l,
      id: l._id,
      status: l.status ? (l.status.charAt(0).toUpperCase() + l.status.slice(1)) : 'New',
    }));
    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateLeadStatus = async (req, res, next) => {
  try {
    const { status, notes, assignedTo } = req.body;
    const update = {};
    if (status) update.status = status.toLowerCase();
    if (notes) update.notes = notes;
    if (assignedTo) update.assignedTo = assignedTo;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'UPDATE_LEAD',
      resource: 'Lead',
      resourceId: lead._id,
      description: `Updated lead ${lead.name} status to ${status || lead.status}`,
    });

    return res.json({ success: true, message: 'Lead updated successfully', data: lead });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'DELETE_LEAD',
      resource: 'Lead',
      resourceId: lead._id,
      description: `Archived lead: ${lead.name}`,
    });

    return res.json({ success: true, message: 'Lead archived successfully' });
  } catch (error) {
    next(error);
  }
};
