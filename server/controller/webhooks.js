import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhook = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      'svix-id': req.headers['svix-id'],
      'svix-signature': req.headers['svix-signature'],
      'svix-timestamp': req.headers['svix-timestamp'],
    });

    const { data, type } = req.body;
    switch (type) {
      case 'user.created': {
        const userdata = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address || 'unknown@example.com',
          name:
            `${data.first_name || ''} ${data.last_name || ''}`.trim() ||
            'Unknown User',
          image: data.image_url || 'https://example.com/default-image.png', // Default image
          resume: '', // Optional
        };
        await User.create(userdata);
        return res.json({ success: true, message: 'User created successfully' });
      }
      case 'user.updated': {
        const userdata = {
          email: data.email_addresses[0]?.email_address || 'unknown@example.com',
          name:
            `${data.first_name || ''} ${data.last_name || ''}`.trim() ||
            'Unknown User',
          image: data.image_url || 'https://example.com/default-image.png',
        };
        const updatedUser = await User.findByIdAndUpdate(data.id, userdata, {
          new: true,
        });
        if (!updatedUser) {
          return res
            .status(404)
            .json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, message: 'User updated successfully' });
      }
      case 'user.deleted': {
        const deletedUser = await User.findByIdAndDelete(data.id);
        if (!deletedUser) {
          return res
            .status(404)
            .json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, message: 'User deleted successfully' });
      }
      default:
        console.log(`Unhandled type: ${type}`);
        return res
          .status(200)
          .json({ success: true, message: 'Unhandled event type' }); // Acknowledge
    }
  } catch (error) {
    console.error('Error in webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Webhook error',
      error: error.message,
    });
  }
};