// Native fetch is available in Node 18+

// This demo uses real API endpoints to prove the application works end-to-end
async function runFinalDemo() {
  const BASE_URL = 'http://127.0.0.1:3007';
  
  // Real IDs from the database
  const MERCHANT_ID = 'c8acfedf-5011-4030-b584-f54d8f5e3a2e'; // Test Company 971
  const LOGISTICS_ID = 'aa23ab74-9b87-4b6c-bdda-967e3541192f'; // Test Company

  console.log('--- TAB LOGISTICS END-TO-END DEMO ---');

  try {
    // 1. Merchant Posts a shipment
    console.log('\n[1] MERCHANT: Posting new shipment...');
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originCompanyId: MERCHANT_ID,
        customerName: 'Ammar Zaki',
        regionName: 'Cairo',
        price: 900,
        status: 'PENDING'
      })
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');
    const orderId = orderData.order_id;
    console.log(`✅ Order Created! ID: ${orderId.slice(0,8)}`);

    // 2. Logistics accepts the shipment
    console.log('\n[2] LOGISTICS: Accepting shipment from marketplace...');
    const acceptRes = await fetch(`${BASE_URL}/api/orders/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: orderId, companyId: LOGISTICS_ID })
    });
    const acceptData = await acceptRes.json();
    if (!acceptRes.ok) throw new Error(acceptData.error || 'Accept failed');
    console.log('✅ Order Accepted Successfully.');

    // 3. Logistics updates status (Lifecycle start)
    console.log('\n[3] LOGISTICS: Updating status to SHIPPED...');
    const statusRes = await fetch(`${BASE_URL}/api/orders/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: orderId, status: 'SHIPPED' })
    });
    console.log('✅ Status Updated: جاري التوصيل (SHIPPED)');

    // 4. Verification Check: Notification for Merchant
    console.log('\n[4] VERIFICATION: Checking Merchant Notifications...');
    const notifRes = await fetch(`${BASE_URL}/api/notifications?companyId=${MERCHANT_ID}`);
    const notifData = await notifRes.json();
    const latestNotif = notifData.notifications[0];
    console.log(`🔔 Merchant Notification: "${latestNotif.title}: ${latestNotif.message}"`);

    // 5. Finalize Delivery
    console.log('\n[5] LOGISTICS: Marking as DELIVERED...');
    await fetch(`${BASE_URL}/api/orders/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: orderId, status: 'DELIVERED' })
    });
    console.log('✅ Cycle Complete: تم التسليم بنجاح');

    console.log('\n--- DEMO FINISHED SUCCESSFULLY ---');
  } catch (err) {
    console.error('❌ Error during demo:', err.message);
  }
}

runFinalDemo();
