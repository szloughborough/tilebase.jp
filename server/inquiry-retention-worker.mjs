import { purgeExpiredInquiries } from './inquiry-retention.mjs';

export default {
  async scheduled(controller, env) {
    const result = await purgeExpiredInquiries(env.DB, controller.scheduledTime);
    console.log('Inquiry retention cleanup', result);
  },
};
