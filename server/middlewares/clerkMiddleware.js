import { Clerk } from '@clerk/clerk-sdk-node';


const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

const customClerkMiddleware = async (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  
  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token not provided in the Authorization header' });
  }

  try {
    
    const session = await clerk.sessions.verifySession(token);

    
    req.session = session;
    next();
  } catch (error) {
    
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export default customClerkMiddleware;
