import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const companyId = formData.get('companyId');
    
    if (!companyId) {
      return new Response(JSON.stringify({ error: 'Company ID is required' }), { status: 400 });
    }

    const docTypes = ['commercial_registry', 'tax_card', 'national_id'];
    const uploadResults = {};

    for (const type of docTypes) {
      const file = formData.get(type);
      if (file && file instanceof File) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${companyId}/${type}_${Date.now()}.${fileExt}`;
        const filePath = `verification/${fileName}`;

        // Convert File to Buffer/ArrayBuffer for Supabase
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabaseAdmin.storage
          .from('company_docs')
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: true
          });

        if (error) throw error;
        
        // Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('company_docs')
          .getPublicUrl(filePath);
          
        uploadResults[type] = publicUrl;
      }
    }

    // Update company record with document URLs and change status to UNDER_REVIEW
    const { error: updateError } = await supabaseAdmin
      .from('companies')
      .update({
        commercial_registry_url: uploadResults.commercial_registry,
        tax_card_url: uploadResults.tax_card,
        national_id_url: uploadResults.national_id,
        verification_status: 'UNDER_REVIEW',
        updated_at: new Date().toISOString()
      })
      .eq('id', companyId);

    if (updateError) throw updateError;

    // Create a notification for the company
    await supabaseAdmin.from('notifications').insert({
      company_id: companyId,
      title: 'طلب التوثيق قيد المراجعة',
      message: 'شكراً لرفع مستنداتك. فريقنا يقوم الآن بمراجعة طلبك وسيتم الرد خلال ساعات.',
      type: 'VERIFICATION_UNDER_REVIEW'
    });

    return new Response(JSON.stringify({ success: true, status: 'UNDER_REVIEW' }), { status: 200 });
  } catch (e) {
    console.error('KYC Upload Error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
