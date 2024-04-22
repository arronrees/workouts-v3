import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { prismaDB } from '..';

async function recoverFromNotFound<A>(promise: Promise<A>): Promise<A | null> {
  try {
    return await promise;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return null;
  }
}

export async function webhookController(req: Request, res: Response) {
  // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('You need a WEBHOOK_SECRET in your .env');
  }

  // Grab the headers and body
  const headers = req.headers;
  const payload = req.body;

  // Get the Svix headers for verification
  const svix_id = headers['svix-id'] as string;
  const svix_timestamp = headers['svix-timestamp'] as string;
  const svix_signature = headers['svix-signature'] as string;

  // If there are missing Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Initiate Svix
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and  return error code
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err: any) {
    // Console log and return error
    console.log('Webhook failed to verify. Error:', err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const eventType = evt.type;

  // console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  // console.log('Webhook body:', evt.data);

  switch (eventType) {
    case 'user.created':
      await prismaDB.user.create({
        data: {
          clerkId: evt.data.id,
          clerkData: JSON.parse(JSON.stringify(evt.data)),
        },
      });
      break;

    case 'user.updated':
      await recoverFromNotFound(
        prismaDB.user.update({
          where: {
            clerkId: evt.data.id,
          },
          data: {
            clerkData: JSON.parse(JSON.stringify(evt.data)),
          },
        })
      );
      break;

    case 'user.deleted':
      await recoverFromNotFound(
        prismaDB.user.delete({
          where: {
            clerkId: evt.data.id,
          },
        })
      );

    default:
      break;
  }

  return res.status(200).json({
    success: true,
    message: 'Webhook received',
  });
}
