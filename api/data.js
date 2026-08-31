const { createClient } = require('@supabase/supabase-js');
 
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
const KEY = 'pv-tracker-data';
 
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
 
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('kv_store')
        .select('value')
        .eq('key', KEY)
        .maybeSingle();
      if (error) throw error;
      res.status(200).json(data ? data.value : null);
      return;
    }
 
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { error } = await supabase
        .from('kv_store')
        .upsert({ key: KEY, value: body, updated_at: new Date().toISOString() });
      if (error) throw error;
      res.status(200).json({ ok: true });
      return;
    }
 
    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
