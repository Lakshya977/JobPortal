import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhook = async (req, res) => {
  try {
    // Create webhook instance with the secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify webhook
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-signature": req.headers["svix-signature"],
      "svix-timestamp": req.headers["svix-timestamp"],
    });

   
    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const userdata = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "", 
        };
        await User.create(userdata);
        return res.json({ message: "User created successfully" });
      }
      case "user.updated": {
        const userdata = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userdata);
        return res.json({ message: "User updated successfully" });
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.json({ message: "User deleted successfully" });
      }
      default:
        console.log(`Unhandled type: ${type}`);
        return res.status(400).json({ success: false, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Error in webhook:", error);
    return res.status(500).json({
      success: false,
      message: "Webhook error",
      error: error.message || error, 
    });
  }
};
